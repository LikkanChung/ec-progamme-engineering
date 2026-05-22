import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UrlList } from './UrlList';
import { deleteUrl } from '../services';

vi.mock('../services', () => ({
  deleteUrl: vi.fn(),
  getShortUrl: vi.fn((shortCode: string) => `http://localhost:3000/${shortCode}`),
}));

const sampleUrl = {
  id: 7,
  short_code: 'qwert',
  long_url: 'https://example.com/very/long/url',
  created_at: '2026-05-22T00:00:00.000Z',
};

describe('UrlList', () => {
  const onUrlDeleted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no URLs exist', () => {
    render(<UrlList urls={[]} onUrlDeleted={onUrlDeleted} />);

    expect(screen.getByText('No URLs yet. Create one above!')).toBeInTheDocument();
  });

  it('renders URL entries and short link', () => {
    render(<UrlList urls={[sampleUrl]} onUrlDeleted={onUrlDeleted} />);

    expect(screen.getByText('https://example.com/very/long/url')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'http://localhost:3000/qwert' })).toHaveAttribute(
      'href',
      'http://localhost:3000/qwert'
    );
  });

  it('deletes URL and notifies parent', async () => {
    vi.mocked(deleteUrl).mockResolvedValue();

    render(<UrlList urls={[sampleUrl]} onUrlDeleted={onUrlDeleted} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deleteUrl).toHaveBeenCalledWith(7);
    });

    expect(onUrlDeleted).toHaveBeenCalledWith(7);
  });

  it('shows API error message when delete fails', async () => {
    vi.mocked(deleteUrl).mockRejectedValue(new Error('Delete failed'));

    render(<UrlList urls={[sampleUrl]} onUrlDeleted={onUrlDeleted} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(await screen.findByText('Delete failed')).toBeInTheDocument();
  });
});
