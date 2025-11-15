'use client';

import { OracleValue } from '@/lib/pallet';

interface DashboardProps {
  lastValue: OracleValue | null;
}

export default function Dashboard({ lastValue }: DashboardProps) {
  if (!lastValue) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Last Oracle Value</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const value = parseFloat(lastValue.value) / 1e12; // Convert from u128
  const source = lastValue.source;
  const status = lastValue.status;
  const updatedAt = new Date(parseInt(lastValue.updated_at) * 1000);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'binance':
        return 'bg-yellow-100 text-yellow-800';
      case 'coinbase':
        return 'bg-blue-100 text-blue-800';
      case 'kraken':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Last Oracle Value</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Value</label>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Source</label>
            <div className="mt-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSourceColor(source)}`}>
                {source}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Last Updated</label>
          <p className="text-gray-900 mt-1">
            {updatedAt.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

