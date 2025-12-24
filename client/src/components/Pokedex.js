import React, { useState, useEffect } from 'react';
import '../styles/Pokedex.css';

export default function Pokedex({ user, onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPokedex();
  }, [page, search]);

  const fetchPokedex = async () => {
    setLoading(true);
    try {
      const url = search
        ? `${API_URL}/api/pokedex/search/${search}`
        : `${API_URL}/api/pokedex?page=${page}&limit=20`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : data.entries || []);
    } catch (error) {
      console.error('Failed to fetch Pokedex:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pokedex-container">
      <div className="pokedex-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>POKÉDEX</h1>
        <div className="user-info">
          <p>{user?.username || 'Player'}</p>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="search-input"
      />

      <div className="pokedex-content">
        {loading ? (
          <p className="loading">Loading Pokédex...</p>
        ) : (
          <>
            <div className="pokedex-grid">
              {entries.map((entry) => (
                <div key={entry._id} className="pokedex-entry">
                  <h3>{entry.name}</h3>
                  <p>#{entry.speciesId}</p>
                  <p className="types">{entry.types?.join(', ')}</p>
                  <div className="stats">
                    <p>HP: {entry.baseStats?.hp}</p>
                    <p>ATK: {entry.baseStats?.atk}</p>
                    <p>DEF: {entry.baseStats?.def}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {!loading && (
        <div className="pagination">
          <button onClick={() => setPage(Math.max(1, page - 1))}>← Prev</button>
          <span>Page {page}</span>
          <button onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
