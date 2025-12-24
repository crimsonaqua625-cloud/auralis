import React from 'react';
import '../styles/Home.css';

const Home = ({ user, onNavigate, onLogout }) => {
  const menuItems = [
    { id: 'pokedex', label: 'POKÉDEX', icon: '📖' },
    { id: 'pokemon', label: 'POKÉMON', icon: '⚪' },
    { id: 'bag', label: 'BAG', icon: '🎒' },
    { id: 'league', label: 'LEAGUE CARD', icon: '🏆' },
    { id: 'save', label: 'SAVE', icon: '💾' },
    { id: 'map', label: 'TOWN MAP', icon: '🗺️' },
    { id: 'camp', label: 'POKÉMON CAMP', icon: '⛺' },
    { id: 'mystery', label: 'MYSTERY GIFT', icon: '🎁' },
    { id: 'vs', label: 'VS', icon: '⚔️' },
    { id: 'options', label: 'OPTIONS', icon: '⚙️' },
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="header-content">
          <h1 className="game-title">AURALIS</h1>
          <div className="player-info">
            <p className="player-name">{user?.username || 'Player'}</p>
            <p className="player-level">Lv. {user?.level || 1}</p>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout}>✕</button>
      </div>

      <div className="home-main">
        <div className="menu-grid">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="menu-button"
              onClick={() => onNavigate(item.id)}
              title={item.label}
            >
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-label">{item.label}</div>
            </button>
          ))}
        </div>

        <div className="status-bar">
          <div className="money-info">
            <span className="money-icon">💰</span>
            <span className="money-value">${user?.currency || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
