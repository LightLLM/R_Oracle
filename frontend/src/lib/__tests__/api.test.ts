import { getApi, disconnectApi, ensureConnection } from '../api';

// Mock @polkadot/api
jest.mock('@polkadot/api', () => {
  const mockApi = {
    isConnected: true,
    isReady: Promise.resolve(mockApi),
    rpc: {
      chain: {
        getBlockNumber: jest.fn().mockResolvedValue(12345),
      },
    },
    disconnect: jest.fn().mockResolvedValue(undefined),
  };

  return {
    ApiPromise: jest.fn().mockImplementation(() => mockApi),
    WsProvider: jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
    })),
  };
});

describe('API Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getApi', () => {
    it('should return existing API if already connected', async () => {
      const api1 = await getApi();
      const api2 = await getApi();

      expect(api1).toBe(api2);
    });

    it('should create new API instance if not connected', async () => {
      const { ApiPromise, WsProvider } = require('@polkadot/api');
      
      await getApi();

      expect(WsProvider).toHaveBeenCalled();
      expect(ApiPromise).toHaveBeenCalled();
    });
  });

  describe('disconnectApi', () => {
    it('should disconnect API and clear instance', async () => {
      await getApi();
      await disconnectApi();

      // Next call should create new instance
      const { ApiPromise } = require('@polkadot/api');
      const callCount = (ApiPromise as jest.Mock).mock.calls.length;

      await getApi();

      expect((ApiPromise as jest.Mock).mock.calls.length).toBeGreaterThan(callCount);
    });
  });

  describe('ensureConnection', () => {
    it('should return existing API if connected', async () => {
      const api = await getApi();
      const ensuredApi = await ensureConnection();

      expect(ensuredApi).toBe(api);
    });
  });
});

