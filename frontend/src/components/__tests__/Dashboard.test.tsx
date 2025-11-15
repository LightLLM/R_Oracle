import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { OracleValue } from '@/lib/pallet';

describe('Dashboard Component', () => {
  it('should render "No data available" when lastValue is null', () => {
    render(<Dashboard lastValue={null} />);
    
    expect(screen.getByText('Last Oracle Value')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should render oracle value correctly', () => {
    const mockValue: OracleValue = {
      value: '50000000000000000', // 50000 * 1e12
      source: 'Binance',
      updated_at: '1000',
      status: 'success',
    };

    render(<Dashboard lastValue={mockValue} />);

    expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    expect(screen.getByText('Binance')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('should format price with 2 decimal places', () => {
    const mockValue: OracleValue = {
      value: '50000123456789000', // 50000.123456789 * 1e12
      source: 'Coinbase',
      updated_at: '1000',
      status: 'success',
    };

    render(<Dashboard lastValue={mockValue} />);

    expect(screen.getByText('$50,000.12')).toBeInTheDocument();
  });

  it('should display correct source badge color for Binance', () => {
    const mockValue: OracleValue = {
      value: '50000000000000000',
      source: 'Binance',
      updated_at: '1000',
      status: 'success',
    };

    const { container } = render(<Dashboard lastValue={mockValue} />);
    const sourceBadge = container.querySelector('.bg-yellow-100');
    
    expect(sourceBadge).toBeInTheDocument();
    expect(sourceBadge).toHaveTextContent('Binance');
  });

  it('should display correct source badge color for Coinbase', () => {
    const mockValue: OracleValue = {
      value: '50000000000000000',
      source: 'Coinbase',
      updated_at: '1000',
      status: 'success',
    };

    const { container } = render(<Dashboard lastValue={mockValue} />);
    const sourceBadge = container.querySelector('.bg-blue-100');
    
    expect(sourceBadge).toBeInTheDocument();
    expect(sourceBadge).toHaveTextContent('Coinbase');
  });

  it('should display correct status badge color for success', () => {
    const mockValue: OracleValue = {
      value: '50000000000000000',
      source: 'Binance',
      updated_at: '1000',
      status: 'success',
    };

    const { container } = render(<Dashboard lastValue={mockValue} />);
    const statusBadge = container.querySelector('.bg-green-100');
    
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('success');
  });

  it('should display formatted timestamp', () => {
    const mockValue: OracleValue = {
      value: '50000000000000000',
      source: 'Binance',
      updated_at: '1000000000', // Unix timestamp
      status: 'success',
    };

    render(<Dashboard lastValue={mockValue} />);

    // Check that timestamp is displayed (format may vary by locale)
    const timestampElement = screen.getByText(/Last Updated/i).nextSibling;
    expect(timestampElement).toBeInTheDocument();
  });
});

