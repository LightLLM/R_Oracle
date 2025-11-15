import { ApiPromise } from '@polkadot/api';
import { getApi } from './api';

export interface OracleValue {
  value: string;
  source: string;
  updated_at: string;
  status: string;
}

/**
 * Get last oracle value
 */
export async function getLastValue(): Promise<OracleValue | null> {
  const api = await getApi();
  const result = await api.query.roracle.lastValue();
  
  if (result.isNone) {
    return null;
  }

  const value = result.unwrap();
  return {
    value: value.value.toString(),
    source: new TextDecoder().decode(value.source),
    updated_at: value.updated_at.toString(),
    status: new TextDecoder().decode(value.status),
  };
}

/**
 * Get oracle history
 */
export async function getHistory(limit: number = 10): Promise<OracleValue[]> {
  const api = await getApi();
  const index = await api.query.roracle.historyIndex();
  const currentIndex = index.toNumber();
  
  const history: OracleValue[] = [];
  const startIndex = Math.max(0, currentIndex - limit);
  
  for (let i = startIndex; i < currentIndex; i++) {
    const result = await api.query.roracle.history(i);
    if (result.isSome) {
      const value = result.unwrap();
      history.push({
        value: value.value.toString(),
        source: new TextDecoder().decode(value.source),
        updated_at: value.updated_at.toString(),
        status: new TextDecoder().decode(value.status),
      });
    }
  }
  
  return history.reverse(); // Most recent first
}

/**
 * Submit oracle value
 */
export async function submitOracleValue(
  value: number,
  source: string,
  status: string,
  signer: any
): Promise<string> {
  const api = await getApi();
  
  const valueU128 = BigInt(Math.floor(value * 1e12)); // Convert to u128 with 12 decimals
  const sourceBytes = new TextEncoder().encode(source);
  const statusBytes = new TextEncoder().encode(status);
  
  const tx = api.tx.roracle.submitOracleValue(valueU128, sourceBytes, statusBytes);
  
  return new Promise((resolve, reject) => {
    tx.signAndSend(signer, ({ status, events }) => {
      if (status.isInBlock || status.isFinalized) {
        const hash = status.isInBlock ? status.asInBlock : status.asFinalized;
        resolve(hash.toString());
      }
    }).catch(reject);
  });
}

