import type { MapData } from '../../engine/types';

export const townMap: MapData = {
  id: 'town', name: 'Town of Aerwyn', width: 20, height: 15,
  encounterRate: 0, possibleEnemies: [],
  npcs: [
    { id: 'king', x: 10, y: 3, sprite: 'king', dialogue: 'king_quest' },
    { id: 'shopkeeper', x: 4, y: 7, sprite: 'shopkeeper', dialogue: 'shop' },
    { id: 'villager_1', x: 14, y: 9, sprite: 'npc1_down', dialogue: 'tutorial' },
    { id: 'villager_2', x: 8, y: 11, sprite: 'npc2_down', dialogue: 'forest_hint' },
  ],
  transitions: [
    { x: 10, y: 0, targetMap: 'forest', targetX: 10, targetY: 13, direction: 'up' },
  ],
  tiles: [
    ['tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','grass_1','tree','tree','tree','tree','tree','tree','tree','tree','tree'],
    ['tree','grass_1','grass_1','grass_1','stone_wall','stone_wall','stone_wall','tree','grass_1','grass_1','grass_1','grass_1','grass_1','tree','stone_wall','stone_wall','stone_wall','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','stone_wall','fortress_floor','fortress_floor','door_open','dirt_path','grass_1','grass_1','grass_1','dirt_path','door_open','fortress_floor','fortress_floor','stone_wall','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','stone_wall','fortress_floor','fortress_floor','fortress_floor','dirt_path','grass_1','flower','grass_1','dirt_path','fortress_floor','fortress_floor','fortress_floor','stone_wall','grass_1','grass_1','tree'],
    ['tree','grass_1','flower','grass_1','stone_wall','fortress_floor','fortress_floor','fortress_floor','dirt_path','stone_path','stone_path','stone_path','dirt_path','fortress_floor','fortress_floor','fortress_floor','stone_wall','grass_1','bush','tree'],
    ['tree','grass_1','grass_1','grass_1','stone_wall','stone_wall','door_open','stone_wall','dirt_path','grass_1','grass_1','grass_1','dirt_path','stone_wall','door_open','stone_wall','stone_wall','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','dirt_path','grass_1','dirt_path','grass_1','grass_1','grass_1','dirt_path','grass_1','dirt_path','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','stone_wall','stone_path','stone_path','stone_path','stone_path','stone_path','stone_path','stone_path','stone_path','stone_wall','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','grass_1','bush','grass_1','grass_1','stone_wall','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','stone_wall','grass_1','grass_1','bush','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','stone_path','stone_path','stone_path','stone_path','stone_path','stone_path','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','dirt_path','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','grass_1','tree','tree','tree','tree','tree','tree','tree','tree','tree'],
  ],
};
