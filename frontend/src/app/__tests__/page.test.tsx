import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';

// Mock the API and pallet modules
jest.mock('@/lib/api', () => ({
  getApi: jest.fn().mockResolvedValue({
    isConnected: true,
  }),
  disconnectApi: jest.fn(),
}));

jest.mock('@/lib/pallet', () => ({
  getLastValue: jest.fn().mockResolvedValue(null),
  getHistory: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/lib/oracle', () => ({
  fetchOraclePrice: jest.fn(),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(<Home />);
    
    expect(screen.getByText(/Connecting to R-Oracle chain/i)).toBeInTheDocument();
  });

  it('should render dashboard when loaded', async () => {
    const { getLastValue, getHistory } = require('@/lib/pallet');
    getLastValue.mockResolvedValue({
      value: '50000000000000000',
      source: 'Binance',
      updated_at: '1000',
      status: 'success',
    });
    getHistory.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('R-Oracle Dashboard')).toBeInTheDocument();
    });
  });

  it('should display connection status', async () => {
    const { getApi } = require('@/lib/api');
    getApi.mockResolvedValue({ isConnected: true });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });
  });

  it('should display error message on error', async () => {
    const { getApi } = require('@/lib/api');
    getApi.mockRejectedValue(new Error('Connection failed'));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
    });
  });
});

