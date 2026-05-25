import type { Enemy } from '../engine/types';

export const enemies: Record<string, Enemy> = {
  goblin: {
    id: 'goblin', name: 'Goblin', hp: 30, maxHp: 30, atk: 8, def: 4, spd: 5,
    exp: 15, gold: 8, sprite: 'goblin_idle', isBoss: false, skills: [],
  },
  wolf: {
    id: 'wolf', name: 'Wolf', hp: 25, maxHp: 25, atk: 10, def: 3, spd: 8,
    exp: 12, gold: 5, sprite: 'wolf_idle', isBoss: false, skills: [],
  },
  skeleton: {
    id: 'skeleton', name: 'Skeleton', hp: 40, maxHp: 40, atk: 12, def: 8, spd: 4,
    exp: 20, gold: 12, sprite: 'skeleton_idle', isBoss: false, skills: [],
  },
  wraith: {
    id: 'wraith', name: 'Wraith', hp: 50, maxHp: 50, atk: 15, def: 5, spd: 9,
    exp: 30, gold: 20, sprite: 'wraith_idle', isBoss: false, skills: [],
  },
  goblin_chief: {
    id: 'goblin_chief', name: 'Goblin Chief', hp: 80, maxHp: 80, atk: 14, def: 10, spd: 6,
    exp: 50, gold: 30, sprite: 'goblin_idle', isBoss: true,
    skills: [{ id: 'war_cry', name: 'War Cry', mpCost: 0, power: 8, type: 'physical', target: 'all', description: 'A fearsome battle cry.' }],
  },
  wraith_lord: {
    id: 'wraith_lord', name: 'Wraith Lord', hp: 100, maxHp: 100, atk: 16, def: 8, spd: 11,
    exp: 55, gold: 35, sprite: 'wraith_idle', isBoss: true,
    skills: [{ id: 'shadow_bolt', name: 'Shadow Bolt', mpCost: 0, power: 10, type: 'magic', target: 'single', description: 'A bolt of dark energy.' }],
  },
  fortress_captain: {
    id: 'fortress_captain', name: 'Fortress Captain', hp: 120, maxHp: 120, atk: 18, def: 14, spd: 7,
    exp: 60, gold: 40, sprite: 'captain_idle', isBoss: true,
    skills: [{ id: 'dark_slash', name: 'Dark Slash', mpCost: 0, power: 10, type: 'physical', target: 'single', description: 'A shadow-infused slash.' }],
  },
  malgrith: {
    id: 'malgrith', name: 'Malgrith', hp: 250, maxHp: 250, atk: 25, def: 18, spd: 10,
    exp: 200, gold: 100, sprite: 'malgrith_idle', isBoss: true,
    skills: [
      { id: 'shadow_strike', name: 'Shadow Strike', mpCost: 0, power: 15, type: 'physical', target: 'single', description: 'A devastating shadow attack.' },
      { id: 'dark_nova', name: 'Dark Nova', mpCost: 0, power: 12, type: 'magic', target: 'all', description: 'Dark energy engulfs all enemies.' },
    ],
  },
};
