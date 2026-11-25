import { useState } from 'react';
import BookGrid from '../components/BookGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import GenreFilter from '../components/GenreFilter.jsx';

// Owns the shared filter state used by SearchBar, GenreFilter and BookGrid.
export default function HomePage() {
  const [search, setSearch] = useState('');
  const [genreId, setGenreId] = useState('');
  const [sort, setSort] = useState('title'); // stretch: 'title' | 'author'

  const clearFilters = () => {
    setSearch('');
    setGenreId('');
  };

  return (
    <>
      <h1 className="page-title">Find your next read</h1>

      <div className="toolbar">
        <SearchBar onSearch={setSearch} />
        <GenreFilter value={genreId} onChange={setGenreId} />
        <label className="field">
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </label>
      </div>

      <BookGrid
        genreId={genreId}
        search={search}
        sort={sort}
        onClearFilters={clearFilters}
      />
    </>
  );
}
