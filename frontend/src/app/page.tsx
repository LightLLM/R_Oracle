'use client';

import { useEffect, useState } from 'react';
import { getLastValue, getHistory, submitOracleValue, OracleValue } from '@/lib/pallet';
import { fetchOraclePrice } from '@/lib/oracle';
import { getApi, disconnectApi } from '@/lib/api';
import Dashboard from '@/components/Dashboard';
import HistoryChart from '@/components/HistoryChart';
import SubmitButton from '@/components/SubmitButton';

export default function Home() {
  const [lastValue, setLastValue] = useState<OracleValue | null>(null);
  const [history, setHistory] = useState<OracleValue[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeConnection();
    return () => {
      disconnectApi();
    };
  }, []);

  const initializeConnection = async () => {
    try {
      setLoading(true);
      const api = await getApi();
      setIsConnected(api.isConnected);
      await loadData();
    } catch (err: any) {
      setError(err.message);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [last, hist] = await Promise.all([
        getLastValue(),
        getHistory(20),
      ]);
      setLastValue(last);
      setHistory(hist);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch price from oracle with failover
      const priceData = await fetchOraclePrice();
      
      // Get signer from extension
      const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp');
      const extensions = await web3Enable('R-Oracle');
      
      if (extensions.length === 0) {
        throw new Error('No Polkadot extension found');
      }
      
      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found in extension');
      }
      
      const api = await getApi();
      const injector = await extensions[0].accounts.subscribe();
      const signer = extensions[0].signer;
      
      // Submit to chain
      const hash = await submitOracleValue(
        priceData.price,
        priceData.source,
        'success',
        { address: accounts[0].address, signer }
      );
      
      console.log('Transaction submitted:', hash);
      
      // Reload data after a delay
      setTimeout(loadData, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !lastValue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to R-Oracle chain...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">R-Oracle Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Resilient Multi-Source Oracle Chain
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Dashboard lastValue={lastValue} />
            <div className="mt-6">
              <HistoryChart history={history} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <SubmitButton onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      </div>
    </main>
  );
}

