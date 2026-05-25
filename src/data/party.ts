import type { CharacterStats } from '../engine/types';

export function createKael(): CharacterStats {
  return {
    name: 'Sir Kael', id: 'sir_kael', level: 1,
    hp: 80, maxHp: 80, mp: 20, maxMp: 20,
    atk: 10, def: 8, spd: 7, exp: 0, expToNext: 50,
    skills: [
      { id: 'slash', name: 'Slash', mpCost: 0, power: 5, type: 'physical', target: 'single', description: 'A basic sword slash.' },
    ],
    isAlive: true,
  };
}

export function createLyra(): CharacterStats {
  return {
    name: 'Lyra', id: 'lyra', level: 3,
    hp: 50, maxHp: 50, mp: 40, maxMp: 40,
    atk: 6, def: 4, spd: 8, exp: 0, expToNext: 450,
    skills: [
      { id: 'staff_strike', name: 'Staff Strike', mpCost: 0, power: 3, type: 'physical', target: 'single', description: 'A quick staff jab.' },
      { id: 'fireball', name: 'Fireball', mpCost: 8, power: 12, type: 'magic', target: 'all', description: 'Engulfs enemies in flame.' },
    ],
    isAlive: true,
  };
}

export function createBrann(): CharacterStats {
  return {
    name: 'Brann', id: 'brann', level: 2,
    hp: 60, maxHp: 60, mp: 35, maxMp: 35,
    atk: 5, def: 6, spd: 5, exp: 0, expToNext: 200,
    skills: [
      { id: 'mace_swing', name: 'Mace Swing', mpCost: 0, power: 4, type: 'physical', target: 'single', description: 'A solid mace swing.' },
      { id: 'heal', name: 'Heal', mpCost: 6, power: 25, type: 'heal', target: 'self', description: 'Restores 25 HP.' },
    ],
    isAlive: true,
  };
}
