/**
 * Combat Engine - Turn-based battle system for Pokémon Auralis
 * Supports PvE, Raids, PvP, Gyms, and Dungeons
 */

const STAB_MULTIPLIER = 1.5;
const CRIT_MULTIPLIER = 1.5;
const MOVE_ACCURACY_RANGE = [0.85, 1.0];
const RANDOM_DAMAGE_RANGE = [0.85, 1.0];

// Type effectiveness chart (simplified)
const typeEffectiveness = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { water: 0.5, grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, ice: 2 },
  grass: { water: 2, grass: 0.5, poison: 0.5, ground: 2, rock: 2, bug: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, dragon: 2, ground: 2 },
  fighting: { normal: 2, flying: 0.5, poison: 0.5, rock: 2, bug: 0.5, ghost: 0, dark: 2, steel: 2, psychic: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 2 },
  ground: { fire: 2, grass: 0.5, poison: 2, rock: 2, water: 0.5, electric: 2, ice: 0.5 },
  flying: { fighting: 2, bug: 2, grass: 2, ground: 0, electric: 0.5, rock: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0 },
  bug: { grass: 2, psychic: 2, dark: 2, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fire: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, normal: 0.5, poison: 0.5, ground: 0.5 },
  ghost: { ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2 },
  dark: { ghost: 2, dark: 0.5, fighting: 0.5 },
  steel: { fire: 0.5, grass: 0.5, ice: 2, normal: 2, rock: 2, bug: 2, steel: 0.5, grass: 0.5, psychic: 2, flying: 2, rock: 2, fairy: 2, dragon: 2, steel: 0.5 },
  fairy: { fighting: 2, bug: 2, dark: 2, poison: 0.5, steel: 0.5 },
};

class CombatEngine {
  /**
   * Calculate type effectiveness multiplier
   */
  static getTypeEffectiveness(attackType, defenderType) {
    const effectiveness = typeEffectiveness[attackType.toLowerCase()];
    if (!effectiveness) return 1;
    return effectiveness[defenderType.toLowerCase()] || 1;
  }

  /**
   * Calculate stat value (HP, ATK, DEF, SPA, SPD, SPE)
   */
  static calculateStat(baseValue, level, iv, ev) {
    if (baseValue === 0) return 1; // Special case for moves with no base

    const calculation = Math.floor(
      ((2 * baseValue + iv + Math.floor(ev / 4)) * level) / 100 + level + 5
    );

    return Math.max(1, calculation);
  }

  /**
   * Calculate HP value (different formula)
   */
  static calculateHP(baseHp, level, iv, ev) {
    if (baseHp === 0) return 1;
    return Math.floor(((2 * baseHp + iv + Math.floor(ev / 4)) * level) / 100 + level + 5);
  }

  /**
   * Calculate actual combat stats for a Pokemon
   */
  static getStats(pokemon, pokedexEntry) {
    const stats = {};
    const baseStats = pokedexEntry.baseStats;

    stats.hp = this.calculateHP(baseStats.hp, pokemon.level, pokemon.ivs.hp, pokemon.evs.hp);
    stats.atk = this.calculateStat(baseStats.atk, pokemon.level, pokemon.ivs.atk, pokemon.evs.atk);
    stats.def = this.calculateStat(baseStats.def, pokemon.level, pokemon.ivs.def, pokemon.evs.def);
    stats.spa = this.calculateStat(baseStats.spa, pokemon.level, pokemon.ivs.spa, pokemon.evs.spa);
    stats.spd = this.calculateStat(baseStats.spd, pokemon.level, pokemon.ivs.spd, pokemon.evs.spd);
    stats.spe = this.calculateStat(baseStats.spe, pokemon.level, pokemon.ivs.spe, pokemon.evs.spe);

    // Apply stat stage modifications
    if (pokemon.statStages) {
      stats.atk *= this._getStageMultiplier(pokemon.statStages.atk || 0);
      stats.def *= this._getStageMultiplier(pokemon.statStages.def || 0);
      stats.spa *= this._getStageMultiplier(pokemon.statStages.spa || 0);
      stats.spd *= this._getStageMultiplier(pokemon.statStages.spd || 0);
      stats.spe *= this._getStageMultiplier(pokemon.statStages.spe || 0);
    }

    return stats;
  }

  /**
   * Get multiplier for stat stages (-6 to +6)
   */
  static _getStageMultiplier(stage) {
    const stages = {
      '-6': 0.25,
      '-5': 0.2857,
      '-4': 0.333,
      '-3': 0.4,
      '-2': 0.5,
      '-1': 0.667,
      '0': 1,
      '1': 1.5,
      '2': 2,
      '3': 2.5,
      '4': 3,
      '5': 3.5,
      '6': 4,
    };
    return stages[stage] || 1;
  }

  /**
   * Calculate damage using official Pokémon formula
   */
  static calculateDamage(attacker, defender, move, attackerStats, defenderStats) {
    const level = attacker.level;
    const power = move.power || 0;

    if (power === 0) return 0; // Status move

    const isPhysical = move.category === 'physical';
    const attackStat = isPhysical ? attackerStats.atk : attackerStats.spa;
    const defenseStat = isPhysical ? defenderStats.def : defenderStats.spd;

    // Base formula
    let damage =
      (((2 * level) / 5 + 2) * power * (attackStat / defenseStat)) / 50 + 2;

    // STAB (Same Type Attack Bonus)
    if (attacker.types.includes(move.type)) {
      damage *= STAB_MULTIPLIER;
    }

    // Type effectiveness
    const typeEffectiveness = this.getTypeEffectiveness(move.type, defender.types[0]);
    const typeEffectiveness2 = defender.types[1]
      ? this.getTypeEffectiveness(move.type, defender.types[1])
      : 1;
    damage *= typeEffectiveness * typeEffectiveness2;

    // Critical hit
    if (Math.random() < 0.0625) {
      // Gen 8: 1/16 chance (simplified)
      damage *= CRIT_MULTIPLIER;
    }

    // Weather effects
    if (this._weatherBoosts(move.type)) {
      damage *= this._getWeatherMultiplier(move.type);
    }

    // Held item effects
    if (attacker.heldItem) {
      damage *= this._getHeldItemMultiplier(attacker.heldItem, move.type, isPhysical);
    }

    // Ability effects (simplified)
    if (attacker.ability) {
      damage *= this._getAbilityMultiplier(attacker.ability);
    }

    // Random variance (85%-100%)
    const randomFactor = Math.random() * (RANDOM_DAMAGE_RANGE[1] - RANDOM_DAMAGE_RANGE[0]) + RANDOM_DAMAGE_RANGE[0];
    damage *= randomFactor;

    return Math.max(1, Math.floor(damage));
  }

  /**
   * Check if move accuracy hits
   */
  static checkAccuracy(move, attacker, defender) {
    const baseAccuracy = move.accuracy || 100;
    if (baseAccuracy === 0) return true; // Guaranteed hit

    // Apply accuracy/evasion stages
    const accuracyMultiplier = 1; // Simplified; should apply attacker.accuracyStage
    const evasionMultiplier = 1; // Simplified; should apply defender.evasionStage

    const finalAccuracy = (baseAccuracy / 100) * accuracyMultiplier * evasionMultiplier;
    return Math.random() < finalAccuracy;
  }

  /**
   * Apply status effects
   */
  static applyStatusEffect(effect, target) {
    if (!effect.status) return;

    const statusList = ['burn', 'poison', 'badly_poisoned', 'paralysis', 'sleep', 'freeze'];
    if (!statusList.includes(effect.status)) return;

    target.status = effect.status;

    if (effect.status === 'sleep') {
      target.sleepTurns = Math.floor(Math.random() * 3) + 1; // 1-3 turns
    }
  }

  /**
   * Apply stat stage changes
   */
  static applyStatChange(effect, target) {
    if (!effect.stat) return;

    target.statStages = target.statStages || {};
    target.statStages[effect.stat] = Math.max(-6, Math.min(6, (target.statStages[effect.stat] || 0) + effect.change));
  }

  /**
   * Process turn damage from status effects
   */
  static processTurnDamage(pokemon) {
    let damage = 0;

    if (pokemon.status === 'burn') {
      damage = Math.floor(pokemon.hp / 8);
    } else if (pokemon.status === 'poison') {
      damage = Math.floor(pokemon.hp / 8);
    } else if (pokemon.status === 'badly_poisoned') {
      damage = Math.floor(pokemon.hp / 8) * (pokemon.badPoisonCounter || 1);
    }

    return damage;
  }

  /**
   * Check turn order by priority and speed
   */
  static determineTurnOrder(attacker, defender, attackerMove, defenderMove) {
    const attackerPriority = attackerMove.priority || 0;
    const defenderPriority = defenderMove.priority || 0;

    if (attackerPriority !== defenderPriority) {
      return attackerPriority > defenderPriority ? 'attacker' : 'defender';
    }

    // Same priority: speed check
    return attacker.speed >= defender.speed ? 'attacker' : 'defender';
  }

  // ====== HELPER METHODS ======

  static _weatherBoosts(moveType) {
    // Check if current weather boosts this move type
    // Placeholder: implement actual weather logic
    return false;
  }

  static _getWeatherMultiplier(moveType) {
    // Return weather-based multiplier
    return 1.5;
  }

  static _getHeldItemMultiplier(item, moveType, isPhysical) {
    // Simplified held item bonuses
    const itemBonuses = {
      'assault vest': 1.1,
      'choice specs': 1.5,
      'choice band': 1.5,
      'life orb': 1.3,
    };
    return itemBonuses[item.toLowerCase()] || 1;
  }

  static _getAbilityMultiplier(ability) {
    const abilityBonuses = {
      adaptability: 2,
      technician: 1.5,
      moxie: 1.2,
    };
    return abilityBonuses[ability.toLowerCase()] || 1;
  }

  /**
   * Execute full turn of combat
   */
  static executeTurn(attacker, defender, attackerMove, defenderMove, context = {}) {
    const results = {
      attacker: { damage: 0, effects: [] },
      defender: { damage: 0, effects: [] },
      log: [],
    };

    const turnOrder = this.determineTurnOrder(attacker, defender, attackerMove, defenderMove);

    if (turnOrder === 'attacker') {
      // Attacker attacks first
      const damage = this._executeAttack(attacker, defender, attackerMove, results, context);

      if (defender.currentHp > 0) {
        // Defender attacks back
        this._executeAttack(defender, attacker, defenderMove, results, context);
      }
    } else {
      // Defender attacks first
      const damage = this._executeAttack(defender, attacker, defenderMove, results, context);

      if (attacker.currentHp > 0) {
        // Attacker attacks back
        this._executeAttack(attacker, defender, attackerMove, results, context);
      }
    }

    return results;
  }

  static _executeAttack(attacker, defender, move, results, context) {
    // Check accuracy
    if (!this.checkAccuracy(move, attacker, defender)) {
      results.log.push(`${attacker.nickname || attacker.name} used ${move.name}, but it missed!`);
      return 0;
    }

    // Calculate damage
    const attackerStats = this.getStats(attacker, context.pokedex?.[attacker.speciesId] || {});
    const defenderStats = this.getStats(defender, context.pokedex?.[defender.speciesId] || {});

    const damage = this.calculateDamage(attacker, defender, move, attackerStats, defenderStats);

    // Apply damage
    defender.currentHp = Math.max(0, defender.currentHp - damage);
    results.defender.damage += damage;
    results.log.push(`${attacker.nickname || attacker.name} used ${move.name}! It dealt ${damage} damage!`);

    // Apply effects
    if (move.effects) {
      move.effects.forEach((effect) => {
        if (Math.random() < (effect.chance || 1)) {
          if (effect.type === 'status') {
            this.applyStatusEffect(effect, defender);
            results.defender.effects.push(effect);
          } else if (effect.type === 'stat') {
            this.applyStatChange(effect, effect.target === 'self' ? attacker : defender);
            results[effect.target === 'self' ? 'attacker' : 'defender'].effects.push(effect);
          }
        }
      });
    }

    return damage;
  }
}

module.exports = CombatEngine;
