import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import BookDetail from './pages/BookDetail.jsx';

export default function App() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">Shelfmark</Link>
        <span className="tagline">Library catalog</span>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route
            path="*"
            element={
              <div className="state">
                <h2>Page not found</h2>
                <Link to="/" className="btn">Back to the catalog</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}
