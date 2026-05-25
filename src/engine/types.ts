export type Direction = 'up' | 'down' | 'left' | 'right';

export type TileType =
  | 'grass_1' | 'grass_2' | 'grass_3'
  | 'stone_path' | 'dirt_path'
  | 'tree' | 'bush' | 'flower'
  | 'water_1' | 'water_2'
  | 'stone_wall' | 'brick_wall' | 'fortress_floor'
  | 'dungeon_stone' | 'torch_1' | 'torch_2'
  | 'door_closed' | 'door_open' | 'stairs_up' | 'stairs_down'
  | 'chest_closed' | 'chest_open'
  | 'npc' | 'shop' | 'inn' | 'king';

export interface CharacterStats {
  name: string;
  id: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  atk: number;
  def: number;
  spd: number;
  exp: number;
  expToNext: number;
  skills: Skill[];
  isAlive: boolean;
}

export interface Skill {
  id: string;
  name: string;
  mpCost: number;
  power: number;
  type: 'physical' | 'magic' | 'heal' | 'buff';
  target: 'single' | 'all' | 'self';
  description: string;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  spd: number;
  exp: number;
  gold: number;
  skills: Skill[];
  sprite: string;
  isBoss: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: 'consumable' | 'weapon' | 'armor' | 'key';
  description: string;
  effect?: { stat: string; value: number };
  sprite: string;
  price: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface MapData {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: string[][];
  encounterRate: number;
  possibleEnemies: string[];
  npcs?: NpcData[];
  transitions?: MapTransition[];
  events?: MapEvent[];
}

export interface NpcData {
  id: string;
  x: number;
  y: number;
  sprite: string;
  dialogue: string;
}

export interface MapTransition {
  x: number;
  y: number;
  targetMap: string;
  targetX: number;
  targetY: number;
  direction?: Direction;
}

export interface MapEvent {
  id: string;
  x: number;
  y: number;
  type: 'boss' | 'chest' | 'recruit' | 'dialogue' | 'shard';
  flag?: string;
  data?: string;
  once?: boolean;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices?: { text: string; nextId: string | null }[];
  nextId?: string | null;
  action?: { type: string; data?: string };
}

export interface GameState {
  party: CharacterStats[];
  inventory: InventoryItem[];
  gold: number;
  score: number;
  currentMap: string;
  playerX: number;
  playerY: number;
  playerDirection: Direction;
  flags: Record<string, boolean>;
  playTime: number;
  chapter: string;
  version: number;
}

export interface CombatState {
  party: CharacterStats[];
  enemies: Enemy[];
  turnOrder: (CharacterStats | Enemy)[];
  currentTurnIndex: number;
  log: string[];
  phase: 'player' | 'enemy' | 'victory' | 'defeat';
  selectedAction: string | null;
  selectedTarget: number;
  battleRewards: { exp: number; gold: number; items: InventoryItem[] };
}
