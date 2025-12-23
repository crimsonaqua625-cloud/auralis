import React, { useState, useEffect } from 'react';

export default function PokemonCollection({ telegramId }) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetchPokemon();
  }, [telegramId]);

  const fetchPokemon = async () => {
    try {
      const res = await fetch(`/api/pokemon/user/${telegramId}`);
      const data = await res.json();
      setPokemon(data);
    } catch (error) {
      console.error('Failed to fetch Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHeal = async (pokemonId) => {
    try {
      await fetch(`/api/pokemon/${pokemonId}/heal`, { method: 'POST' });
      fetchPokemon();
    } catch (error) {
      console.error('Failed to heal Pokémon:', error);
    }
  };

  if (loading) return <p>Loading Pokémon...</p>;

  return (
    <div className="pokemon-collection">
      <h1>My Pokémon</h1>
      <div className="pokemon-list">
        {pokemon.map((poke) => (
          <div
            key={poke._id}
            className="pokemon-card"
            onClick={() => setSelectedPokemon(poke)}
          >
            <h3>{poke.nickname || `Pokémon #${poke.speciesId}`}</h3>
            <p>Level: {poke.level}</p>
            <p>HP: {poke.currentHp}</p>
            {poke.shiny && <span className="shiny-badge">✨ Shiny</span>}
          </div>
        ))}
      </div>

      {selectedPokemon && (
        <div className="pokemon-details">
          <h2>{selectedPokemon.nickname || `Pokémon #${selectedPokemon.speciesId}`}</h2>
          <p>Level: {selectedPokemon.level}</p>
          <p>Experience: {selectedPokemon.experience}</p>
          <p>HP: {selectedPokemon.currentHp}</p>
          <p>Nature: {selectedPokemon.nature}</p>
          <p>Gender: {selectedPokemon.gender}</p>
          <p>Ability: {selectedPokemon.ability}</p>

          <h3>Moves:</h3>
          <ul>
            {selectedPokemon.moves?.map((move, i) => (
              <li key={i}>{move}</li>
            ))}
          </ul>

          <button onClick={() => handleHeal(selectedPokemon._id)}>Heal</button>
          {selectedPokemon.readyToEvolve && (
            <button onClick={() => console.log('Evolve:', selectedPokemon._id)}>Evolve</button>
          )}
        </div>
      )}
    </div>
  );
}
