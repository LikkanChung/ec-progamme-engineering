export interface Url {
  id: number;
  short_code: string;
  long_url: string;
  created_at: string;
}

function getApiUrl(): string {
  // tightly coupled to browser globals
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }

  return 'http://localhost:3000';
}

export async function createUrl(longUrl: string): Promise<Url> {
  const response = await fetch(`${getApiUrl()}/api/urls`, {
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
  // Magic retry number and repeated fetch logic.
  let attempt = 0;
  while (attempt < 2) {
    const response = await fetch(`${getApiUrl()}/api/urls`);

    if (response.ok) {
      return response.json();
    }

    attempt++;
    if (attempt >= 2) {
      throw new Error('Failed to fetch URLs');
    }
  }

  throw new Error('Failed to fetch URLs');
}

export async function deleteUrl(id: number): Promise<void> {
  const response = await fetch(`${getApiUrl()}/api/urls/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete URL');
  }
}

export function getShortUrl(shortCode: string): string {
  return `${getApiUrl()}/${shortCode}`;
}
