import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import { genreName } from '../components/BookCard.jsx';

const API_URL = import.meta.env.VITE_API_URL;

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | error | notfound | ready
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    fetch(`${API_URL}/books/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) {
          setStatus('notfound');
          return null;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data) {
          setBook(data);
          setStatus('ready');
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error');
      });
    return () => controller.abort();
  }, [id, retryCount]);

  const back = <Link to="/" className="back-link">‹ Back to catalog</Link>;

  if (status === 'loading') {
    return (
      <>
        {back}
        <div className="detail" aria-busy="true">
          <div className="cover cover-lg skeleton-block" />
          <div className="detail-info">
            <div className="skeleton-line tall" />
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
          </div>
        </div>
      </>
    );
  }

  if (status === 'notfound') {
    return (
      <>
        {back}
        <div className="state">
          <h2>We couldn’t find that book</h2>
          <p>It may have been removed from the catalog.</p>
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        {back}
        <div className="state" role="alert">
          <h2>We couldn’t load this book</h2>
          <button className="btn" onClick={() => setRetryCount((c) => c + 1)}>
            Try again
          </button>
        </div>
      </>
    );
  }

  const available = book.availableCopies ?? book.available;
  const details = [
    ['Genre', genreName(book)],
    ['ISBN', book.isbn],
    ['Publisher', book.publisher],
    ['Published', book.publishedYear ?? book.publicationYear],
    ['Pages', book.pages],
    ['Language', book.language],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '');

  return (
    <>
      {back}
      <article className="detail">
        <BookCover book={book} large />
        <div className="detail-info">
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>

          {available !== undefined && (
            <p className={`badge ${available > 0 || available === true ? 'badge-ok' : 'badge-out'}`}>
              {typeof available === 'boolean'
                ? available ? 'Available' : 'Checked out'
                : available > 0
                ? `${available} ${available === 1 ? 'copy' : 'copies'} available`
                : 'All copies checked out'}
            </p>
          )}

          {book.description && <p className="detail-desc">{book.description}</p>}

          <dl className="meta">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </>
  );
}
