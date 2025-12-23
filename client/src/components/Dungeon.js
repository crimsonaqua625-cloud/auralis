import React, { useState, useEffect } from 'react';

export default function DungeonView({ telegramId }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [telegramId]);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/dungeons/${telegramId}`);
      const data = await res.json();
      setProgress(data);
    } catch (error) {
      console.error('Failed to fetch dungeon progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const enterDungeon = async () => {
    try {
      await fetch(`/api/dungeons/${telegramId}/enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: 1 }),
      });
      fetchProgress();
    } catch (error) {
      console.error('Failed to enter dungeon:', error);
    }
  };

  const exitDungeon = async () => {
    try {
      await fetch(`/api/dungeons/${telegramId}/exit`, { method: 'POST' });
      fetchProgress();
    } catch (error) {
      console.error('Failed to exit dungeon:', error);
    }
  };

  const resetDungeon = async () => {
    if (window.confirm('Reset dungeon progress? This will cost an entry fee.')) {
      try {
        await fetch(`/api/dungeons/${telegramId}/reset`, { method: 'POST' });
        fetchProgress();
      } catch (error) {
        console.error('Failed to reset dungeon:', error);
      }
    }
  };

  if (loading) return <p>Loading dungeon...</p>;

  return (
    <div className="dungeon-view">
      <h1>Dungeon</h1>
      <p>The ultimate PvE challenge. 50 floors of progressively harder enemies.</p>

      <div className="dungeon-progress">
        <div className="floor-display">
          <h2>Floor {progress?.currentFloor || 1}</h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((progress?.currentFloor || 1) / 50) * 100}%` }}
            ></div>
          </div>
          <p>{progress?.currentFloor || 1} / 50</p>
        </div>

        <div className="save-point">
          <h3>Last Save: Floor {progress?.lastSaveFloor || 1}</h3>
          <p>If you faint, you'll restart from Floor {(progress?.lastSaveFloor || 1) + 1}</p>
        </div>

        <div className="dungeon-controls">
          {progress?.status === 'none' ? (
            <button onClick={enterDungeon} className="primary">
              Enter Dungeon
            </button>
          ) : progress?.status === 'in-progress' ? (
            <>
              <button onClick={exitDungeon}>Pause</button>
              <button onClick={() => console.log('Battle Floor')}>Battle</button>
            </>
          ) : (
            <>
              <button onClick={enterDungeon}>Resume</button>
              <button onClick={resetDungeon} className="danger">
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      <div className="boss-floors">
        <h3>Boss Checkpoints</h3>
        <ul>
          <li>🏯 Floor 10: Main Boss</li>
          <li>🏯 Floor 20: Main Boss</li>
          <li>⭐ Floor 25: Mid-Dungeon Apex (Checkpoint)</li>
          <li>🏯 Floor 30: Main Boss</li>
          <li>🏯 Floor 40: Main Boss</li>
          <li>⭐ Floor 50: Final Dungeon Apex (Endpoint)</li>
        </ul>
      </div>
    </div>
  );
}
