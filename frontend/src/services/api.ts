export interface Url {
  id: number;
  short_code: string;
  long_url: string;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function createUrl(longUrl: string): Promise<Url> {
  const response = await fetch(`${API_URL}/api/urls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ longUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create URL');
  }

  return response.json();
}

export async function getAllUrls(): Promise<Url[]> {
  const response = await fetch(`${API_URL}/api/urls`);

  if (!response.ok) {
    throw new Error('Failed to fetch URLs');
  }

  return response.json();
}

export async function deleteUrl(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/urls/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete URL');
  }
}

export function getShortUrl(shortCode: string): string {
  return `${API_URL}/${shortCode}`;
}
