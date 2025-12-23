import React, { useState, useEffect } from 'react';

export default function RaidMenu() {
  const [raids, setRaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRaid, setSelectedRaid] = useState(null);

  useEffect(() => {
    fetchRaids();
    const interval = setInterval(fetchRaids, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRaids = async () => {
    try {
      const res = await fetch('/api/raids');
      const data = await res.json();
      setRaids(data);
    } catch (error) {
      console.error('Failed to fetch raids:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierStars = (tier) => {
    return '⭐'.repeat(tier);
  };

  const getDifficultyLabel = (tier) => {
    const labels = { 1: 'Easy', 2: 'Medium', 3: 'Hard', 4: 'Extreme' };
    return labels[tier] || 'Unknown';
  };

  if (loading) return <p>Loading raids...</p>;

  return (
    <div className="raid-menu">
      <h1>Raids</h1>
      <p>Join cooperative boss battles and attempt to catch legendary Pokémon!</p>

      <div className="raid-filters">
        <button>All Raids</button>
        <button>1-Star (Easy)</button>
        <button>2-Star (Medium)</button>
        <button>3-Star (Hard)</button>
        <button>4-Star (Extreme)</button>
      </div>

      <div className="raids-list">
        {raids.length === 0 ? (
          <p>No active raids at the moment.</p>
        ) : (
          raids.map((raid) => (
            <div key={raid._id} className="raid-card">
              <div className="raid-header">
                <h3>{getTierStars(raid.tier)} Boss Raid</h3>
                <span className="difficulty">{getDifficultyLabel(raid.tier)}</span>
              </div>
              <p className="boss-name">Boss: Pokémon #{raid.bossPokemon.speciesId}</p>
              <div className="raid-stats">
                <p>Players: {raid.currentPlayers} / {raid.maxPlayers}</p>
                <p>HP: {raid.bossHp} / {raid.totalBossHp}</p>
                <p>Status: {raid.status}</p>
              </div>
              <button
                onClick={() => setSelectedRaid(raid)}
                disabled={raid.currentPlayers >= raid.maxPlayers}
              >
                {raid.currentPlayers >= raid.maxPlayers ? 'Full' : 'Join Raid'}
              </button>
            </div>
          ))
        )}
      </div>

      {selectedRaid && (
        <div className="raid-detail-modal">
          <h2>{getTierStars(selectedRaid.tier)} Raid Details</h2>
          <p>Boss Pokémon: #{selectedRaid.bossPokemon.speciesId}</p>
          <p>Players Joined: {selectedRaid.currentPlayers}</p>
          <p>Boss HP: {selectedRaid.bossHp} / {selectedRaid.totalBossHp}</p>
          <button onClick={() => console.log('Joining raid:', selectedRaid._id)}>
            Join Raid
          </button>
          <button onClick={() => setSelectedRaid(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
