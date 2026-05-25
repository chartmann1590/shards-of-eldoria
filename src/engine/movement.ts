import type { Direction, MapData, MapTransition, MapEvent } from './types';

export const SOLID_TILES: string[] = [
  'tree',
  'stone_wall',
  'brick_wall',
  'water_1',
  'water_2',
  'chest_closed',
  'door_closed',
];

const DIR_OFFSETS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export function checkEncounter(rate: number): boolean {
  return Math.random() < rate;
}

export function tryMove(
  dir: Direction,
  x: number,
  y: number,
  map: MapData,
): {
  moved: boolean;
  newX: number;
  newY: number;
  encounterTriggered: boolean;
  transitionTo?: MapTransition;
  event?: MapEvent;
} {
  const offset = DIR_OFFSETS[dir];
  const newX = x + offset.dx;
  const newY = y + offset.dy;

  if (newX < 0 || newX >= map.width || newY < 0 || newY >= map.height) {
    return { moved: false, newX: x, newY: y, encounterTriggered: false };
  }

  const tile = map.tiles[newY][newX];
  if (SOLID_TILES.includes(tile)) {
    return { moved: false, newX: x, newY: y, encounterTriggered: false };
  }

  const transition = map.transitions?.find((t) => t.x === newX && t.y === newY);
  if (transition) {
    return {
      moved: true,
      newX,
      newY,
      encounterTriggered: false,
      transitionTo: transition,
    };
  }

  const event = map.events?.find((e) => e.x === newX && e.y === newY);

  let encounterTriggered = false;
  if (
    map.encounterRate > 0 &&
    map.possibleEnemies.length > 0 &&
    !event
  ) {
    encounterTriggered = checkEncounter(map.encounterRate);
  }

  return {
    moved: true,
    newX,
    newY,
    encounterTriggered,
    event,
  };
}
