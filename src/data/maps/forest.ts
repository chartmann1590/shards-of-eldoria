import type { MapData } from '../../engine/types';

export const forestMap: MapData = {
  id: 'forest', name: 'Whispering Forest', width: 20, height: 15,
  encounterRate: 0.06, possibleEnemies: ['goblin', 'wolf'],
  npcs: [
    { id: 'lyra_npc', x: 5, y: 7, sprite: 'npc2_down', dialogue: 'lyra_recruit' },
  ],
  transitions: [
    { x: 10, y: 14, targetMap: 'town', targetX: 10, targetY: 1, direction: 'down' },
    { x: 19, y: 7, targetMap: 'crypt', targetX: 1, targetY: 7, direction: 'right' },
  ],
  events: [
    { id: 'boss_goblin_chief', x: 15, y: 3, type: 'boss', flag: 'goblin_chief_defeated', data: 'goblin_chief', once: true },
    { id: 'chest_forest_1', x: 3, y: 3, type: 'chest', flag: 'chest_forest_1', data: 'health_potion', once: true },
    { id: 'chest_forest_2', x: 17, y: 11, type: 'chest', flag: 'chest_forest_2', data: 'mana_potion', once: true },
    { id: 'shard_red', x: 15, y: 2, type: 'shard', flag: 'red_shard_found', data: 'red_shard', once: true },
    { id: 'recruit_lyra', x: 5, y: 7, type: 'recruit', flag: 'recruited_lyra', data: 'lyra', once: true },
  ],
  tiles: [
    ['tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','tree'],
    ['tree','grass_1','grass_2','dirt_path','grass_1','grass_1','tree','tree','grass_1','grass_2','grass_1','grass_1','tree','grass_1','grass_1','grass_1','tree','tree','tree','tree'],
    ['tree','grass_1','grass_1','dirt_path','grass_1','flower','grass_1','tree','grass_1','grass_1','bush','grass_1','grass_1','grass_1','flower','grass_1','grass_1','tree','grass_1','tree'],
    ['tree','dirt_path','dirt_path','dirt_path','grass_1','grass_1','grass_1','tree','grass_1','grass_1','grass_1','dirt_path','dirt_path','dirt_path','dirt_path','grass_1','grass_1','grass_1','tree','tree'],
    ['tree','grass_1','grass_1','dirt_path','grass_1','tree','grass_1','grass_1','grass_1','grass_1','grass_1','dirt_path','grass_1','grass_1','dirt_path','grass_1','tree','grass_1','grass_1','tree'],
    ['tree','grass_1','bush','grass_1','grass_1','tree','tree','grass_1','bush','grass_1','grass_1','dirt_path','grass_1','grass_1','dirt_path','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','tree','grass_1','grass_1','grass_1','dirt_path','dirt_path','grass_1','flower','dirt_path','grass_1','grass_1','bush','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','tree','grass_1','grass_1','dirt_path','grass_1','grass_1','dirt_path','dirt_path','dirt_path','grass_1','grass_1','grass_1','grass_1','dirt_path'],
    ['tree','bush','grass_1','grass_1','flower','grass_1','tree','grass_1','dirt_path','grass_1','grass_1','grass_1','grass_1','grass_1','dirt_path','grass_1','tree','grass_1','grass_1','grass_1'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','dirt_path','grass_1','grass_1','bush','grass_1','grass_1','grass_1','dirt_path','grass_1','grass_1','grass_1','flower','tree'],
    ['tree','grass_1','flower','grass_1','bush','grass_1','dirt_path','dirt_path','grass_1','grass_1','grass_1','grass_1','tree','grass_1','dirt_path','dirt_path','dirt_path','dirt_path','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','grass_1','dirt_path','grass_1','grass_1','flower','grass_1','grass_1','tree','grass_1','grass_1','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','bush','grass_1','grass_1','dirt_path','grass_1','grass_1','grass_1','grass_1','bush','tree','tree','grass_1','grass_1','bush','grass_1','grass_1','tree'],
    ['tree','grass_1','grass_1','grass_1','grass_1','dirt_path','dirt_path','grass_1','grass_1','grass_1','grass_1','grass_1','tree','tree','grass_1','grass_1','grass_1','grass_1','grass_1','tree'],
    ['tree','tree','tree','tree','tree','tree','tree','tree','tree','tree','grass_1','tree','tree','tree','tree','tree','tree','tree','tree','tree'],
  ],
};
