import type { Item } from '../engine/types';

export const items: Record<string, Item> = {
  health_potion: {
    id: 'health_potion', name: 'Health Potion', type: 'consumable',
    description: 'Restores 30 HP.', effect: { stat: 'hp', value: 30 },
    sprite: 'potion', price: 25,
  },
  mana_potion: {
    id: 'mana_potion', name: 'Mana Potion', type: 'consumable',
    description: 'Restores 15 MP.', effect: { stat: 'mp', value: 15 },
    sprite: 'mana_potion', price: 30,
  },
  elixir: {
    id: 'elixir', name: 'Elixir', type: 'consumable',
    description: 'Fully restores HP and MP.', effect: { stat: 'hp', value: 999 },
    sprite: 'elixir', price: 200,
  },
  iron_sword: {
    id: 'iron_sword', name: 'Iron Sword', type: 'weapon',
    description: 'A sturdy iron sword. +5 ATK.', effect: { stat: 'atk', value: 5 },
    sprite: 'iron_sword', price: 100,
  },
  steel_sword: {
    id: 'steel_sword', name: 'Steel Sword', type: 'weapon',
    description: 'A fine steel sword. +10 ATK.', effect: { stat: 'atk', value: 10 },
    sprite: 'steel_sword', price: 250,
  },
  knight_sword: {
    id: 'knight_sword', name: 'Knight Sword', type: 'weapon',
    description: 'A masterwork blade. +18 ATK.', effect: { stat: 'atk', value: 18 },
    sprite: 'knight_sword', price: 500,
  },
  leather_armor: {
    id: 'leather_armor', name: 'Leather Armor', type: 'armor',
    description: 'Basic protection. +3 DEF.', effect: { stat: 'def', value: 3 },
    sprite: 'leather_armor', price: 80,
  },
  chainmail: {
    id: 'chainmail', name: 'Chainmail', type: 'armor',
    description: 'Linked chain armor. +8 DEF.', effect: { stat: 'def', value: 8 },
    sprite: 'chainmail', price: 200,
  },
  plate_armor: {
    id: 'plate_armor', name: 'Plate Armor', type: 'armor',
    description: 'Heavy plate armor. +15 DEF.', effect: { stat: 'def', value: 15 },
    sprite: 'plate_armor', price: 450,
  },
  red_shard: {
    id: 'red_shard', name: 'Red Crystal Shard', type: 'key',
    description: 'One of the three Crystal Shards of Eldoria.', sprite: 'red_shard', price: 0,
  },
  blue_shard: {
    id: 'blue_shard', name: 'Blue Crystal Shard', type: 'key',
    description: 'One of the three Crystal Shards of Eldoria.', sprite: 'blue_shard', price: 0,
  },
  green_shard: {
    id: 'green_shard', name: 'Green Crystal Shard', type: 'key',
    description: 'One of the three Crystal Shards of Eldoria.', sprite: 'green_shard', price: 0,
  },
};
