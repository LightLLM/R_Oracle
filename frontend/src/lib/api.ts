import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from './types';

// RPC endpoints with failover
const PRIMARY_RPC = process.env.NEXT_PUBLIC_PRIMARY_RPC || 'wss://rpc.polkadot.io';
const FALLBACK_RPC = process.env.NEXT_PUBLIC_FALLBACK_RPC || 'wss://rpc.ibp.network/polkadot';

let api: ApiPromise | null = null;
let currentProvider: WsProvider | null = null;
let isConnecting = false;

/**
 * Health check for RPC endpoint
 */
async function checkRpcHealth(provider: WsProvider): Promise<boolean> {
  try {
    const testApi = new ApiPromise({ provider, types });
    await testApi.isReady;
    const blockNumber = await testApi.rpc.chain.getBlockNumber();
    testApi.disconnect();
    return blockNumber !== undefined;
  } catch (error) {
    console.error('RPC health check failed:', error);
    return false;
  }
}

/**
 * Get API instance with automatic failover
 */
export async function getApi(): Promise<ApiPromise> {
  if (api && api.isConnected) {
    return api;
  }

  if (isConnecting) {
    // Wait for existing connection attempt
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (api && api.isConnected) {
      return api;
    }
  }

  isConnecting = true;

  try {
    // Try primary RPC first
    const primaryProvider = new WsProvider(PRIMARY_RPC);
    const primaryHealthy = await checkRpcHealth(primaryProvider);
    
    if (primaryHealthy) {
      currentProvider = primaryProvider;
      api = new ApiPromise({ provider: primaryProvider, types });
      await api.isReady;
      isConnecting = false;
      return api;
    }

    // Fallback to secondary RPC
    console.warn('Primary RPC failed, switching to fallback');
    const fallbackProvider = new WsProvider(FALLBACK_RPC);
    currentProvider = fallbackProvider;
    api = new ApiPromise({ provider: fallbackProvider, types });
    await api.isReady;
    isConnecting = false;
    return api;
  } catch (error) {
    isConnecting = false;
    throw new Error(`Failed to connect to RPC: ${error}`);
  }
}

/**
 * Disconnect API
 */
export async function disconnectApi(): Promise<void> {
  if (api) {
    await api.disconnect();
    api = null;
  }
  if (currentProvider) {
    currentProvider.disconnect();
    currentProvider = null;
  }
}

/**
 * Health check and reconnect if needed
 */
export async function ensureConnection(): Promise<ApiPromise> {
  if (api && api.isConnected) {
    try {
      await api.rpc.chain.getBlockNumber();
      return api;
    } catch (error) {
      console.warn('Connection lost, reconnecting...');
      await disconnectApi();
    }
  }
  return getApi();
}

