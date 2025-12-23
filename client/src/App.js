import React, { useState, useEffect } from 'react';
import './App.css';
import Pokedex from './components/Pokedex';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Try to get user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (username) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="loading">Loading Auralis...</div>;
  }

  return (
    <div className="App">
      {user ? (
        <Pokedex user={user} onLogout={handleLogout} />
      ) : (
        <div className="login-screen">
          <h1>🎮 Auralis</h1>
          <p>Pokémon Game</p>
          <LoginForm onLogin={handleLogin} error={error} />
        </div>
      )}
    </div>
  );
}

function LoginForm({ onLogin, error }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <button type="submit">Play Game</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default App;
