import { useState } from 'react';
import { deleteUrl, getShortUrl, Url } from '../services';

interface UrlListProps {
  urls: Url[];
  onUrlDeleted: (id: number) => void;
}

export function UrlList({ urls, onUrlDeleted }: UrlListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    setError(null);
    setDeletingId(id);

    try {
      await deleteUrl(id);
      onUrlDeleted(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete URL');
    } finally {
      setDeletingId(null);
    }
  };

  if (urls.length === 0) {
    return (
      <div className="card">
        <h2>Your URLs</h2>
        <p className="empty-state">No URLs yet. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Your URLs</h2>
      {error && <p className="error">{error}</p>}
      <ul className="url-list">
        {urls.map((url) => (
          <li key={url.id} className="url-item">
            <div className="url-info">
              <a
                href={getShortUrl(url.short_code)}
                target="_blank"
                rel="noopener noreferrer"
                className="short-url"
              >
                {getShortUrl(url.short_code)}
              </a>
              <span className="long-url" title={url.long_url}>
                {url.long_url}
              </span>
            </div>
            <button
              className="danger"
              onClick={() => handleDelete(url.id)}
              disabled={deletingId === url.id}
            >
              {deletingId === url.id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
