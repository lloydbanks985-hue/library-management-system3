import { useEffect, useState } from 'react';

const DELAY_MS = 400;

export default function SearchBar({ onSearch }) {
  const [text, setText] = useState('');

  // Debounce: wait until typing pauses, and cancel the pending call on each keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(text.trim());
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [text, onSearch]);

  return (
    <label className="field field-search">
      <span>Search</span>
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Title or author"
        autoComplete="off"
      />
    </label>
  );
}
