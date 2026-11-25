import { useEffect, useMemo, useState } from 'react';
import BookCard from './BookCard.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function SkeletonGrid() {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading books">
      {Array.from({ length: 8 }, (_, i) => (
        <div className="card skeleton" key={i}>
          <div className="cover skeleton-block" />
          <div className="card-body">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BookGrid({ genreId, search, sort, onClearFilters }) {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | error | ready
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (genreId) params.set('genreId', genreId);
    if (search) params.set('search', search);
    const qs = params.toString();

    setStatus('loading');
    fetch(`${API_URL}/books${qs ? `?${qs}` : ''}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setBooks(Array.isArray(data) ? data : data.data ?? []);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error');
      });

    // Cancels stale requests so a slow earlier response can't overwrite a newer one.
    return () => controller.abort();
  }, [genreId, search, retryCount]);

  const sorted = useMemo(() => {
    const key = sort === 'author' ? 'author' : 'title';
    return [...books].sort((a, b) =>
      String(a[key] ?? '').localeCompare(String(b[key] ?? ''), undefined, {
        sensitivity: 'base',
      })
    );
  }, [books, sort]);

  if (status === 'loading') return <SkeletonGrid />;

  if (status === 'error') {
    return (
      <div className="state" role="alert">
        <h2>We couldn’t load the catalog</h2>
        <p>Check your connection and try again.</p>
        <button className="btn" onClick={() => setRetryCount((c) => c + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (sorted.length === 0) {
    const filtered = Boolean(genreId || search);
    return (
      <div className="state">
        <h2>{filtered ? 'No books match your search' : 'The catalog is empty'}</h2>
        {filtered && (
          <>
            <p>Try a different title, author or genre.</p>
            <button className="btn" onClick={onClearFilters}>
              Clear filters
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <p className="result-count" aria-live="polite">
        {sorted.length} {sorted.length === 1 ? 'book' : 'books'}
      </p>
      <div className="grid">
        {sorted.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
}
