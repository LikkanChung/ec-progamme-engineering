import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UrlForm } from './UrlForm';
import { createUrl } from '../services';

vi.mock('../services', () => ({
  createUrl: vi.fn(),
  getShortUrl: vi.fn((shortCode: string) => `http://localhost:3000/${shortCode}`),
}));

describe('UrlForm', () => {
  const onUrlCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation error when URL is empty', async () => {
    render(<UrlForm onUrlCreated={onUrlCreated} />);

    fireEvent.click(screen.getByRole('button', { name: 'Shorten' }));

    expect(await screen.findByText('Please enter a URL')).toBeInTheDocument();
    expect(createUrl).not.toHaveBeenCalled();
  });

  it('creates a URL and shows success feedback', async () => {
    const created = {
      id: 1,
      short_code: 'abc12',
      long_url: 'https://example.com',
      created_at: '2026-05-22T00:00:00.000Z',
    };

    vi.mocked(createUrl).mockResolvedValue(created);

    render(<UrlForm onUrlCreated={onUrlCreated} />);

    fireEvent.change(screen.getByPlaceholderText('Enter your long URL here...'), {
      target: { value: '   https://example.com   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Shorten' }));

    await waitFor(() => {
      expect(createUrl).toHaveBeenCalledWith('https://example.com');
    });

    expect(onUrlCreated).toHaveBeenCalledWith(created);
    expect(await screen.findByText('Created: http://localhost:3000/abc12')).toBeInTheDocument();
  });

  it('shows API error message when creation fails', async () => {
    vi.mocked(createUrl).mockRejectedValue(new Error('Backend unavailable'));

    render(<UrlForm onUrlCreated={onUrlCreated} />);

    fireEvent.change(screen.getByPlaceholderText('Enter your long URL here...'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Shorten' }));

    expect(await screen.findByText('Backend unavailable')).toBeInTheDocument();
  });
});
