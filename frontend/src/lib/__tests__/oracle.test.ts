import { fetchOraclePrice, OraclePrice } from '../oracle';

// Mock fetch globally
global.fetch = jest.fn();

describe('Oracle Price Fetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchOraclePrice', () => {
    it('should fetch price from Binance successfully', async () => {
      const mockPrice = { price: '50000.00' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPrice,
      });

      const result = await fetchOraclePrice();

      expect(result.price).toBe(50000.00);
      expect(result.source).toBe('Binance');
      expect(result.timestamp).toBeGreaterThan(0);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
      );
    });

    it('should fallback to Coinbase when Binance fails', async () => {
      // Binance fails
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Binance API failed'));

      // Coinbase succeeds
      const mockCoinbaseData = {
        data: {
          rates: {
            USD: '51000.00',
          },
        },
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinbaseData,
      });

      const result = await fetchOraclePrice();

      expect(result.price).toBe(51000.00);
      expect(result.source).toBe('Coinbase');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should fallback to Kraken when Binance and Coinbase fail', async () => {
      // Binance fails
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Binance API failed'));

      // Coinbase fails
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Coinbase API failed'));

      // Kraken succeeds
      const mockKrakenData = {
        result: {
          XXBTZUSD: {
            c: ['52000.00'],
          },
        },
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockKrakenData,
      });

      const result = await fetchOraclePrice();

      expect(result.price).toBe(52000.00);
      expect(result.source).toBe('Kraken');
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should throw error when all sources fail', async () => {
      // All sources fail
      (global.fetch as jest.Mock).mockRejectedValue(new Error('API failed'));

      await expect(fetchOraclePrice()).rejects.toThrow('All oracle sources failed');
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should handle non-200 responses from Binance', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Coinbase succeeds
      const mockCoinbaseData = {
        data: {
          rates: {
            USD: '51000.00',
          },
        },
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinbaseData,
      });

      const result = await fetchOraclePrice();

      expect(result.source).toBe('Coinbase');
    });

    it('should parse decimal prices correctly', async () => {
      const mockPrice = { price: '50000.123456' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPrice,
      });

      const result = await fetchOraclePrice();

      expect(result.price).toBe(50000.123456);
    });
  });
});

