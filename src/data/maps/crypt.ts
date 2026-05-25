import type { MapData } from '../../engine/types';

export const cryptMap: MapData = {
  id: 'crypt', name: 'Old Crypt', width: 20, height: 15,
  encounterRate: 0.07, possibleEnemies: ['skeleton', 'wraith'],
  transitions: [
    { x: 0, y: 7, targetMap: 'forest', targetX: 18, targetY: 7, direction: 'left' },
    { x: 10, y: 0, targetMap: 'fortress', targetX: 10, targetY: 13, direction: 'up' },
  ],
  events: [
    { id: 'boss_wraith_lord', x: 10, y: 3, type: 'boss', flag: 'wraith_lord_defeated', data: 'wraith_lord', once: true },
    { id: 'chest_crypt_1', x: 3, y: 5, type: 'chest', flag: 'chest_crypt_1', data: 'health_potion', once: true },
    { id: 'shard_blue', x: 10, y: 2, type: 'shard', flag: 'blue_shard_found', data: 'blue_shard', once: true },
  ],
  tiles: [
    ['stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall'],
    ['stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','torch_1','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','torch_1','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['stone_wall','dungeon_stone','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['stone_wall','dungeon_stone','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall','dungeon_stone','stone_wall'],
    ['stone_wall','dungeon_stone','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone'],
    ['stone_wall','dungeon_stone','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','torch_1','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','torch_1','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['stone_wall','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','dungeon_stone','stone_wall'],
    ['stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','dungeon_stone','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall'],
    ['stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall','stone_wall'],
  ],
};
