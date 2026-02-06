import { useState, FormEvent } from 'react';
import { createUrl, getShortUrl, Url } from '../services';

interface UrlFormProps {
  onUrlCreated: (url: Url) => void;
}

export function UrlForm({ onUrlCreated }: UrlFormProps) {
  const [longUrl, setLongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);

    try {
      const url = await createUrl(longUrl.trim());
      onUrlCreated(url);
      setSuccess(`Created: ${getShortUrl(url.short_code)}`);
      setLongUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Shorten a URL</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter your long URL here..."
            maxLength={256}
            disabled={loading}
          />
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Shorten'}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}
