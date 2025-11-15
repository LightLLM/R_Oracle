// Oracle data fetching with failover

export interface OraclePrice {
  price: number;
  source: string;
  timestamp: number;
}

const BINANCE_API = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
const COINBASE_API = 'https://api.coinbase.com/v2/exchange-rates?currency=BTC';
const KRAKEN_API = 'https://api.kraken.com/0/public/Ticker?pair=XBTUSD';

/**
 * Fetch price from Binance
 */
async function fetchBinancePrice(): Promise<OraclePrice> {
  const response = await fetch(BINANCE_API);
  if (!response.ok) throw new Error('Binance API failed');
  const data = await response.json();
  return {
    price: parseFloat(data.price),
    source: 'Binance',
    timestamp: Date.now(),
  };
}

/**
 * Fetch price from Coinbase
 */
async function fetchCoinbasePrice(): Promise<OraclePrice> {
  const response = await fetch(COINBASE_API);
  if (!response.ok) throw new Error('Coinbase API failed');
  const data = await response.json();
  const price = parseFloat(data.data.rates.USD);
  return {
    price,
    source: 'Coinbase',
    timestamp: Date.now(),
  };
}

/**
 * Fetch price from Kraken
 */
async function fetchKrakenPrice(): Promise<OraclePrice> {
  const response = await fetch(KRAKEN_API);
  if (!response.ok) throw new Error('Kraken API failed');
  const data = await response.json();
  const price = parseFloat(data.result.XXBTZUSD.c[0]);
  return {
    price,
    source: 'Kraken',
    timestamp: Date.now(),
  };
}

/**
 * Fetch oracle price with automatic failover
 * Primary: Binance -> Fallback 1: Coinbase -> Fallback 2: Kraken
 */
export async function fetchOraclePrice(): Promise<OraclePrice> {
  const sources = [
    { name: 'Binance', fetch: fetchBinancePrice },
    { name: 'Coinbase', fetch: fetchCoinbasePrice },
    { name: 'Kraken', fetch: fetchKrakenPrice },
  ];

  for (const source of sources) {
    try {
      const price = await source.fetch();
      console.log(`Successfully fetched price from ${source.name}:`, price.price);
      return price;
    } catch (error) {
      console.warn(`${source.name} failed, trying next source...`, error);
      // Continue to next source
    }
  }

  throw new Error('All oracle sources failed');
}

