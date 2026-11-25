// Generated cover: a stable colour per book, so the grid looks like a shelf
// even when the API has no cover images.
function hue(seed) {
  let h = 0;
  for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

export default function BookCover({ book, large = false }) {
  const h = hue(book.id ?? book.title);
  const style = {
    '--cover-bg': `hsl(${h} 38% 30%)`,
    '--cover-fg': `hsl(${h} 40% 92%)`,
  };

  if (book.coverUrl) {
    return (
      <img
        className={`cover cover-img${large ? ' cover-lg' : ''}`}
        src={book.coverUrl}
        alt={`Cover of ${book.title}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`cover${large ? ' cover-lg' : ''}`}
      style={style}
      role="img"
      aria-label={`Cover of ${book.title}`}
    >
      <span className="cover-title">{book.title}</span>
      <span className="cover-author">{book.author}</span>
    </div>
  );
}
