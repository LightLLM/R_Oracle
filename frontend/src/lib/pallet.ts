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
  try {
    const api = await getApi();
    
    // Check if roracle pallet exists
    if (!api.query.roracle || !api.query.roracle.lastValue) {
      throw new Error('Roracle pallet not found. Make sure you are connected to the R-Oracle chain.');
    }
    
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
  } catch (error: any) {
    console.error('Error getting last value:', error);
    throw new Error(`Failed to get last value: ${error.message}`);
  }
}

/**
 * Get oracle history
 */
export async function getHistory(limit: number = 10): Promise<OracleValue[]> {
  try {
    const api = await getApi();
    
    // Check if roracle pallet exists
    if (!api.query.roracle || !api.query.roracle.historyIndex) {
      throw new Error('Roracle pallet not found. Make sure you are connected to the R-Oracle chain.');
    }
    
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
  } catch (error: any) {
    console.error('Error getting history:', error);
    throw new Error(`Failed to get history: ${error.message}`);
  }
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
  try {
    const api = await getApi();
    
    // Check if roracle pallet exists
    if (!api.tx.roracle || !api.tx.roracle.submitOracleValue) {
      throw new Error('Roracle pallet not found. Make sure you are connected to the R-Oracle chain.');
    }
    
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
  } catch (error: any) {
    console.error('Error submitting oracle value:', error);
    throw new Error(`Failed to submit oracle value: ${error.message}`);
  }
}

