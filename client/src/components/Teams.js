import React, { useState, useEffect } from 'react';

export default function TeamManager({ telegramId }) {
  const [teams, setTeams] = useState({});
  const [mainTeamId, setMainTeamId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, [telegramId]);

  const fetchTeams = async () => {
    try {
      const res = await fetch(`/api/teams/${telegramId}`);
      const data = await res.json();
      setTeams(data.teams || {});
      setMainTeamId(data.mainTeamId || 1);
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const setMainTeam = async (teamId) => {
    try {
      await fetch(`/api/teams/${telegramId}/main/${teamId}`, { method: 'POST' });
      setMainTeamId(teamId);
    } catch (error) {
      console.error('Failed to set main team:', error);
    }
  };

  const toggleFavorite = async (pokemonId) => {
    try {
      const response = await fetch(`/api/teams/${telegramId}/favorite/${pokemonId}`, {
        method: 'POST',
      });
      const newFavorites = await response.json();
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (loading) return <p>Loading teams...</p>;

  return (
    <div className="team-manager">
      <h1>Team Manager</h1>
      <p>Main Team: {mainTeamId}</p>

      <div className="teams-grid">
        {[1, 2, 3, 4, 5, 6].map((teamId) => (
          <div key={teamId} className={`team-slot ${mainTeamId === teamId ? 'main' : ''}`}>
            <h3>Team {teamId}</h3>
            <div className="team-pokemon">
              {teams[teamId]?.length || 0} / 6
            </div>
            <button onClick={() => setMainTeam(teamId)}>
              {mainTeamId === teamId ? '★ Main Team' : 'Set as Main'}
            </button>
          </div>
        ))}
      </div>

      <div className="favorites-section">
        <h3>Favorite Pokémon ({favorites.length})</h3>
        <p>These Pokémon cannot be accidentally removed from teams.</p>
      </div>
    </div>
  );
}
