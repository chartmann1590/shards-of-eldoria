import { Image, View, StyleSheet } from 'react-native';
import type { ImageStyle } from 'react-native';

interface SpriteProps {
  sprite: string;
  width?: number;
  height?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const SPRITE_SCALE = 4;
const BASE_SIZE = 16;

const SPRITES: Record<string, any> = {
  // Protagonist & companions (8-direction walk frames available)
  kael_down: require('../../assets/sprites/characters/kael_down_1.png'),
  kael_up: require('../../assets/sprites/characters/kael_up_1.png'),
  kael_left: require('../../assets/sprites/characters/kael_left_1.png'),
  kael_right: require('../../assets/sprites/characters/kael_right_1.png'),
  lyra_down: require('../../assets/sprites/characters/lyra_down_1.png'),
  lyra_up: require('../../assets/sprites/characters/lyra_up_1.png'),
  lyra_left: require('../../assets/sprites/characters/lyra_left_1.png'),
  lyra_right: require('../../assets/sprites/characters/lyra_right_1.png'),
  brann_down: require('../../assets/sprites/characters/brann_down_1.png'),
  brann_up: require('../../assets/sprites/characters/brann_up_1.png'),
  brann_left: require('../../assets/sprites/characters/brann_left_1.png'),
  brann_right: require('../../assets/sprites/characters/brann_right_1.png'),

  // NPCs (single frames)
  king: require('../../assets/sprites/characters/king.png'),
  shopkeeper: require('../../assets/sprites/characters/shopkeeper.png'),
  villager1: require('../../assets/sprites/characters/villager1.png'),
  villager2: require('../../assets/sprites/characters/villager2.png'),
  villager3: require('../../assets/sprites/characters/villager3.png'),

  // Enemies — both idle and attack frames exist; default to idle
  goblin_idle: require('../../assets/sprites/enemies/goblin_idle.png'),
  goblin_attack: require('../../assets/sprites/enemies/goblin_attack.png'),
  wolf_idle: require('../../assets/sprites/enemies/wolf_idle.png'),
  wolf_attack: require('../../assets/sprites/enemies/wolf_attack.png'),
  skeleton_idle: require('../../assets/sprites/enemies/skeleton_idle.png'),
  skeleton_attack: require('../../assets/sprites/enemies/skeleton_attack.png'),
  wraith_idle: require('../../assets/sprites/enemies/wraith_idle.png'),
  wraith_attack: require('../../assets/sprites/enemies/wraith_attack.png'),
  captain_idle: require('../../assets/sprites/enemies/captain_idle.png'),
  captain_attack: require('../../assets/sprites/enemies/captain_attack.png'),
  malgrith_idle: require('../../assets/sprites/enemies/malgrith_idle.png'),
  malgrith_attack: require('../../assets/sprites/enemies/malgrith_attack.png'),
};

// Aliases for legacy sprite identifiers used in maps/data files.
const ALIASES: Record<string, string> = {
  hero: 'kael_down',
  kael: 'kael_down',
  lyra: 'lyra_down',
  brann: 'brann_down',
  npc1_down: 'villager1',
  npc2_down: 'villager2',
  npc3_down: 'villager3',
};

function resolveSprite(name: string, direction?: SpriteProps['direction']): any {
  if (direction) {
    const base = ALIASES[name] ?? name;
    const baseRoot = base.replace(/_(up|down|left|right)$/, '');
    const candidate = `${baseRoot}_${direction}`;
    if (SPRITES[candidate]) return SPRITES[candidate];
  }
  if (SPRITES[name]) return SPRITES[name];
  const aliased = ALIASES[name];
  if (aliased && SPRITES[aliased]) return SPRITES[aliased];
  return null;
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: 'transparent' },
});

export function Sprite({
  sprite,
  width = BASE_SIZE * SPRITE_SCALE,
  height = BASE_SIZE * SPRITE_SCALE,
  direction,
}: SpriteProps) {
  const source = resolveSprite(sprite, direction);

  if (!source) {
    return <View style={[{ width, height }, styles.fallback]} />;
  }

  return (
    <Image
      source={source}
      style={{ width, height } as ImageStyle}
      resizeMode="contain"
    />
  );
}
