import { useState, useEffect } from 'react';
import { UrlForm, UrlList } from './components';
import { getAllUrls, Url } from './services';

function App() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = async () => {
    try {
      const data = await getAllUrls();
      setUrls(data);
      setError(null);
    } catch (err) {
      setError('Failed to load URLs. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCreated = (url: Url) => {
    setUrls((prev) => [url, ...prev]);
  };

  const handleUrlDeleted = (id: number) => {
    setUrls((prev) => prev.filter((url) => url.id !== id));
  };

  return (
    <div className="container">
      <h1>🔗 URL Shortener</h1>
      <UrlForm onUrlCreated={handleUrlCreated} />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="card">
          <p className="error">{error}</p>
        </div>
      ) : (
        <UrlList urls={urls} onUrlDeleted={handleUrlDeleted} />
      )}
    </div>
  );
}

export default App;
