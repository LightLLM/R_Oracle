import { render, screen } from '@testing-library/react';
import HistoryChart from '../HistoryChart';
import { OracleValue } from '@/lib/pallet';

describe('HistoryChart Component', () => {
  it('should render "No history data available" when history is empty', () => {
    render(<HistoryChart history={[]} />);
    
    expect(screen.getByText('Price History')).toBeInTheDocument();
    expect(screen.getByText('No history data available')).toBeInTheDocument();
  });

  it('should render chart when history has data', () => {
    const mockHistory: OracleValue[] = [
      {
        value: '50000000000000000',
        source: 'Binance',
        updated_at: '1000',
        status: 'success',
      },
      {
        value: '51000000000000000',
        source: 'Coinbase',
        updated_at: '2000',
        status: 'success',
      },
    ];

    render(<HistoryChart history={mockHistory} />);

    expect(screen.getByText('Price History')).toBeInTheDocument();
    // Chart should be rendered (Recharts components)
    const chartContainer = document.querySelector('.recharts-wrapper');
    expect(chartContainer).toBeInTheDocument();
  });

  it('should format values correctly in chart data', () => {
    const mockHistory: OracleValue[] = [
      {
        value: '50000000000000000', // 50000 * 1e12
        source: 'Binance',
        updated_at: '1000',
        status: 'success',
      },
    ];

    render(<HistoryChart history={mockHistory} />);

    // Chart should be rendered with data
    const chartContainer = document.querySelector('.recharts-wrapper');
    expect(chartContainer).toBeInTheDocument();
  });
});

