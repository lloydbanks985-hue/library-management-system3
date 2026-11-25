import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function GenreFilter({ value, onChange }) {
  const [genres, setGenres] = useState([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/genres`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setGenres(Array.isArray(data) ? data : data.data ?? []))
      .catch((err) => {
        if (err.name !== 'AbortError') setFailed(true);
      });
    return () => controller.abort();
  }, []);

  return (
    <label className="field">
      <span>Genre</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={failed}
      >
        <option value="">{failed ? 'Genres unavailable' : 'All genres'}</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </label>
  );
}
