import { getLastValue, getHistory, submitOracleValue } from '../pallet';
import { getApi } from '../api';

// Mock the API module
jest.mock('../api', () => ({
  getApi: jest.fn(),
}));

describe('Pallet Interactions', () => {
  const mockApi = {
    query: {
      roracle: {
        lastValue: jest.fn(),
        history: jest.fn(),
        historyIndex: jest.fn(),
      },
    },
    tx: {
      roracle: {
        submitOracleValue: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getApi as jest.Mock).mockResolvedValue(mockApi);
  });

  describe('getLastValue', () => {
    it('should return null when no value exists', async () => {
      mockApi.query.roracle.lastValue.mockResolvedValue({
        isNone: true,
      });

      const result = await getLastValue();

      expect(result).toBeNull();
      expect(mockApi.query.roracle.lastValue).toHaveBeenCalled();
    });

    it('should return formatted oracle value', async () => {
      const mockValue = {
        isNone: false,
        unwrap: () => ({
          value: { toString: () => '50000000000000000' }, // 50000 * 1e12
          source: new Uint8Array([66, 105, 110, 97, 110, 99, 101]), // "Binance"
          updated_at: { toString: () => '1000' },
          status: new Uint8Array([115, 117, 99, 99, 101, 115, 115]), // "success"
        }),
      };

      mockApi.query.roracle.lastValue.mockResolvedValue(mockValue);

      const result = await getLastValue();

      expect(result).toEqual({
        value: '50000000000000000',
        source: 'Binance',
        updated_at: '1000',
        status: 'success',
      });
    });
  });

  describe('getHistory', () => {
    it('should return empty array when no history', async () => {
      mockApi.query.roracle.historyIndex.mockResolvedValue({
        toNumber: () => 0,
      });

      const result = await getHistory();

      expect(result).toEqual([]);
    });

    it('should return history entries', async () => {
      mockApi.query.roracle.historyIndex.mockResolvedValue({
        toNumber: () => 2,
      });

      mockApi.query.roracle.history
        .mockResolvedValueOnce({
          isSome: true,
          unwrap: () => ({
            value: { toString: () => '50000000000000000' },
            source: new Uint8Array([66, 105, 110, 97, 110, 99, 101]),
            updated_at: { toString: () => '1000' },
            status: new Uint8Array([115, 117, 99, 99, 101, 115, 115]),
          }),
        })
        .mockResolvedValueOnce({
          isSome: true,
          unwrap: () => ({
            value: { toString: () => '51000000000000000' },
            source: new Uint8Array([67, 111, 105, 110, 98, 97, 115, 101]),
            updated_at: { toString: () => '2000' },
            status: new Uint8Array([115, 117, 99, 99, 101, 115, 115]),
          }),
        });

      const result = await getHistory(10);

      expect(result).toHaveLength(2);
      expect(result[0].source).toBe('Coinbase'); // Most recent first (reversed)
      expect(result[1].source).toBe('Binance');
    });

    it('should respect limit parameter', async () => {
      mockApi.query.roracle.historyIndex.mockResolvedValue({
        toNumber: () => 10,
      });

      mockApi.query.roracle.history.mockResolvedValue({
        isSome: true,
        unwrap: () => ({
          value: { toString: () => '50000000000000000' },
          source: new Uint8Array([66, 105, 110, 97, 110, 99, 101]),
          updated_at: { toString: () => '1000' },
          status: new Uint8Array([115, 117, 99, 99, 101, 115, 115]),
        }),
      });

      await getHistory(5);

      // Should only query last 5 entries
      expect(mockApi.query.roracle.history).toHaveBeenCalledTimes(5);
    });
  });

  describe('submitOracleValue', () => {
    it('should submit oracle value successfully', async () => {
      const mockTx = {
        signAndSend: jest.fn((signer, callback) => {
          callback({ status: { isFinalized: true, asFinalized: '0x123' } });
          return Promise.resolve();
        }),
      };

      mockApi.tx.roracle.submitOracleValue.mockReturnValue(mockTx);

      const signer = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' };
      const result = await submitOracleValue(50000, 'Binance', 'success', signer);

      expect(result).toBe('0x123');
      expect(mockApi.tx.roracle.submitOracleValue).toHaveBeenCalledWith(
        expect.any(BigInt),
        expect.any(Uint8Array),
        expect.any(Uint8Array)
      );
    });

    it('should convert price to u128 with 12 decimals', async () => {
      const mockTx = {
        signAndSend: jest.fn((signer, callback) => {
          callback({ status: { isFinalized: true, asFinalized: '0x123' } });
          return Promise.resolve();
        }),
      };

      mockApi.tx.roracle.submitOracleValue.mockReturnValue(mockTx);

      const signer = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' };
      await submitOracleValue(50000.50, 'Binance', 'success', signer);

      const callArgs = mockApi.tx.roracle.submitOracleValue.mock.calls[0];
      const value = callArgs[0] as BigInt;
      
      // 50000.50 * 1e12 = 50000500000000000
      expect(value.toString()).toBe('50000500000000000');
    });

    it('should handle transaction errors', async () => {
      const mockTx = {
        signAndSend: jest.fn(() => Promise.reject(new Error('Transaction failed'))),
      };

      mockApi.tx.roracle.submitOracleValue.mockReturnValue(mockTx);

      const signer = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' };

      await expect(
        submitOracleValue(50000, 'Binance', 'success', signer)
      ).rejects.toThrow('Transaction failed');
    });
  });
});

