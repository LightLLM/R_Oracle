'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { OracleValue } from '@/lib/pallet';

interface HistoryChartProps {
  history: OracleValue[];
}

export default function HistoryChart({ history }: HistoryChartProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Price History</h2>
        <p className="text-gray-500">No history data available</p>
      </div>
    );
  }

  const chartData = history.map((item) => ({
    time: new Date(parseInt(item.updated_at) * 1000).toLocaleTimeString(),
    value: parseFloat(item.value) / 1e12,
    source: item.source,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Price History</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Price (USD)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

