import { render, screen, fireEvent } from '@testing-library/react';
import SubmitButton from '../SubmitButton';

describe('SubmitButton Component', () => {
  it('should render submit button', () => {
    const mockOnSubmit = jest.fn();
    render(<SubmitButton onSubmit={mockOnSubmit} loading={false} />);

    expect(screen.getByText('Submit Oracle Update')).toBeInTheDocument();
  });

  it('should call onSubmit when clicked', () => {
    const mockOnSubmit = jest.fn();
    render(<SubmitButton onSubmit={mockOnSubmit} loading={false} />);

    const button = screen.getByText('Submit Oracle Update');
    fireEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    const mockOnSubmit = jest.fn();
    render(<SubmitButton onSubmit={mockOnSubmit} loading={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading text when loading', () => {
    const mockOnSubmit = jest.fn();
    render(<SubmitButton onSubmit={mockOnSubmit} loading={true} />);

    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should not call onSubmit when disabled', () => {
    const mockOnSubmit = jest.fn();
    render(<SubmitButton onSubmit={mockOnSubmit} loading={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display description text', () => {
    const mockOnSubmit = jest.fn();
    render(<SubmitButton onSubmit={mockOnSubmit} loading={false} />);

    expect(
      screen.getByText(/Fetch the latest price from oracle sources/i)
    ).toBeInTheDocument();
  });
});

