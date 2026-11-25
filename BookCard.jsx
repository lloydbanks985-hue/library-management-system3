import { Link } from 'react-router-dom';
import BookCover from './BookCover.jsx';

export function genreName(book) {
  return typeof book.genre === 'object' ? book.genre?.name : book.genre;
}

export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="card">
      <BookCover book={book} />
      <div className="card-body">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">{book.author}</p>
        {genreName(book) && <p className="card-genre">{genreName(book)}</p>}
      </div>
    </Link>
  );
}
