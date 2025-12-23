/**
 * Pokéapi Data Seeder
 * Fetches and caches Pokémon data for offline use
 */

const axios = require('axios');
const Pokedex = require('./models/Pokedex');
const Move = require('./models/Move');
const mongoose = require('mongoose');
require('dotenv').config();

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const REGION_RANGES = {
  1: { start: 1, end: 151 }, // Kanto
  2: { start: 152, end: 251 }, // Johto
  3: { start: 252, end: 386 }, // Hoenn
  4: { start: 387, end: 493 }, // Sinnoh
  5: { start: 494, end: 649 }, // Unova
  6: { start: 650, end: 721 }, // Kalos
  7: { start: 722, end: 809 }, // Alola
  8: { start: 810, end: 905 }, // Galar
};

class PokeapiSeeder {
  static async connectDb() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auralis', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  }

  static async fetchPokemonData(speciesId) {
    try {
      const response = await axios.get(`${POKEAPI_BASE}/pokemon-species/${speciesId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch Pokémon #${speciesId}:`, error.message);
      return null;
    }
  }

  static async fetchPokemonStats(speciesId) {
    try {
      const response = await axios.get(`${POKEAPI_BASE}/pokemon/${speciesId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch stats for #${speciesId}:`, error.message);
      return null;
    }
  }

  static async seedPokedex(regions = [1, 2]) {
    console.log('🌱 Starting Pokédex seeding...');

    for (const regionId of regions) {
      const range = REGION_RANGES[regionId];
      if (!range) {
        console.error(`Invalid region: ${regionId}`);
        continue;
      }

      console.log(`\n📍 Seeding Region ${regionId} (${range.start}-${range.end})...`);

      for (let speciesId = range.start; speciesId <= range.end; speciesId++) {
        const existingEntry = await Pokedex.findOne({ speciesId });
        if (existingEntry) {
          console.log(`⏭️  Skipping #${speciesId} (already cached)`);
          continue;
        }

        const speciesData = await this.fetchPokemonData(speciesId);
        const statsData = await this.fetchPokemonStats(speciesId);

        if (!speciesData || !statsData) continue;

        const entry = new Pokedex({
          speciesId,
          name: speciesData.name.charAt(0).toUpperCase() + speciesData.name.slice(1),
          types: statsData.types.map((t) => t.type.name),
          baseStats: {
            hp: statsData.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0,
            atk: statsData.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0,
            def: statsData.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0,
            spa: statsData.stats.find((s) => s.stat.name === 'special-attack')?.base_stat || 0,
            spd: statsData.stats.find((s) => s.stat.name === 'special-defense')?.base_stat || 0,
            spe: statsData.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0,
          },
          abilities: statsData.abilities.map((a) => a.ability.name),
          height: statsData.height,
          weight: statsData.weight,
          region: regionId,
          generation: speciesData.generation?.url ? parseInt(speciesData.generation.url.match(/\d+/)[0]) : 1,
        });

        // Fetch evolution data
        const evolutionChain = speciesData.evolution_chain;
        if (evolutionChain) {
          try {
            const evoResponse = await axios.get(evolutionChain.url);
            entry.evolutions = this._parseEvolutions(evoResponse.data.chain);
          } catch (error) {
            console.error(`Failed to fetch evolutions for #${speciesId}`);
          }
        }

        // Fetch move data
        entry.learnableMovesAndLevels = statsData.moves
          .filter((m) => m.version_group_details.some((v) => v.move_learn_method.name === 'level-up'))
          .map((m) => ({
            move: m.move.name,
            level: m.version_group_details.find((v) => v.move_learn_method.name === 'level-up')?.level_learned_at || 0,
            method: 'level-up',
          }))
          .slice(0, 20); // Limit to 20 moves per Pokémon

        await entry.save();
        console.log(`✅ Cached #${speciesId} ${entry.name}`);
      }
    }

    console.log('\n✨ Pokédex seeding complete!');
  }

  static _parseEvolutions(chain, evolutions = []) {
    if (chain.evolves_to.length === 0) return evolutions;

    chain.evolves_to.forEach((evo) => {
      evolutions.push({
        speciesId: parseInt(evo.species.url.match(/\d+/)[0]),
        method: evo.evolution_details[0]?.trigger?.name || 'unknown',
        requirement: evo.evolution_details[0]?.min_level || null,
      });

      this._parseEvolutions(evo, evolutions);
    });

    return evolutions;
  }

  static async seedMoves(limit = 100) {
    console.log('🎯 Seeding moves...');

    try {
      const response = await axios.get(`${POKEAPI_BASE}/move?limit=${limit}`);
      const moves = response.data.results;

      for (const moveRef of moves) {
        const existingMove = await Move.findOne({ name: moveRef.name });
        if (existingMove) continue;

        const moveData = await axios.get(moveRef.url);

        const move = new Move({
          name: moveData.data.name,
          type: moveData.data.type.name,
          category: moveData.data.damage_class.name,
          power: moveData.data.power,
          accuracy: moveData.data.accuracy,
          priority: moveData.data.priority,
          pp: moveData.data.pp,
          description: moveData.data.effect_entries[0]?.effect || 'Unknown',
        });

        await move.save();
        console.log(`✅ Cached move: ${move.name}`);
      }

      console.log('✨ Move seeding complete!');
    } catch (error) {
      console.error('Failed to seed moves:', error.message);
    }
  }

  static async seedAll() {
    try {
      await this.connectDb();
      await this.seedPokedex([1, 2]); // Region 1 & 2 for Phase 1
      await this.seedMoves(200);
      console.log('\n🎉 All seeding complete!');
    } catch (error) {
      console.error('Seeding failed:', error);
    } finally {
      await mongoose.disconnect();
    }
  }
}

// Run seeder if executed directly
if (require.main === module) {
  PokeapiSeeder.seedAll();
}

module.exports = PokeapiSeeder;
