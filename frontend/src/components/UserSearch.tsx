import React, { useState } from 'react';
import API_URL from '../config';

export default function UserSearch({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  console.log('API_URL:', API_URL);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Array<any>>([]);
  async function doSearch() {
    if (!q) return setResults([]);
    const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  };

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  };

  return (
    <div className="user-search">
      <div className="search-box">
        <span>&#8981;</span>
        <input
          value={q}
          onChange={onChangeHandler}
          onKeyDown={onKeyDownHandler}
          placeholder="Search user..."
        />
        {/* <button onClick={doSearch}>Search</button> */}
      </div>
      <ul className="results">
        {results.map((r: any) => (
          <li key={r.id} onClick={() => onSelect(r.id)}>
            <strong>{r.name}</strong> — {r.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
