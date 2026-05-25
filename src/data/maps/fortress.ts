import type { MapData } from '../../engine/types';

export const fortressMap: MapData = {
  id: 'fortress', name: "Malgrith's Fortress", width: 20, height: 15,
  encounterRate: 0.07, possibleEnemies: ['skeleton', 'fortress_captain'],
  transitions: [
    { x: 10, y: 14, targetMap: 'crypt', targetX: 10, targetY: 1, direction: 'down' },
  ],
  events: [
    { id: 'chest_fortress_1', x: 3, y: 3, type: 'chest', flag: 'chest_fortress_1', data: 'steel_sword', once: true },
    { id: 'chest_fortress_2', x: 16, y: 5, type: 'chest', flag: 'chest_fortress_2', data: 'plate_armor', once: true },
    { id: 'shard_green', x: 15, y: 7, type: 'shard', flag: 'green_shard_found', data: 'green_shard', once: true },
    { id: 'boss_malgrith', x: 10, y: 3, type: 'boss', flag: 'malgrith_defeated', data: 'malgrith', once: true },
  ],
  tiles: [
    ['brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','torch_1','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','torch_1','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall','brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall','brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall','brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall','brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall','brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall','brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall','brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall','brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','torch_1','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','torch_1','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','fortress_floor','brick_wall'],
    ['brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','fortress_floor','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall'],
    ['brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall','brick_wall'],
  ],
};
