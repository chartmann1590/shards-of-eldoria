import { Image, StyleSheet } from 'react-native';
import type { ImageStyle } from 'react-native';

interface SpriteProps {
  sprite: string;
  width?: number;
  height?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const SPRITE_SCALE = 4;
const BASE_SIZE = 16;

function getSpriteSource(name: string): any {
  const sprites: Record<string, any> = {
    hero: require('../../assets/sprites/hero.png'),
    hero_up: require('../../assets/sprites/hero_up.png'),
    hero_down: require('../../assets/sprites/hero_down.png'),
    hero_left: require('../../assets/sprites/hero_left.png'),
    hero_right: require('../../assets/sprites/hero_right.png'),
    npc_merchant: require('../../assets/sprites/npc_merchant.png'),
    npc_elder: require('../../assets/sprites/npc_elder.png'),
    npc_guard: require('../../assets/sprites/npc_guard.png'),
    slime: require('../../assets/sprites/slime.png'),
    goblin: require('../../assets/sprites/goblin.png'),
    skeleton: require('../../assets/sprites/skeleton.png'),
    wolf: require('../../assets/sprites/wolf.png'),
    bat: require('../../assets/sprites/bat.png'),
    chest: require('../../assets/sprites/chest.png'),
    door: require('../../assets/sprites/door.png'),
  };
  return sprites[name] || sprites.hero;
}

export function Sprite({
  sprite,
  width = BASE_SIZE * SPRITE_SCALE,
  height = BASE_SIZE * SPRITE_SCALE,
  direction,
}: SpriteProps) {
  const spriteName = direction ? `${sprite}_${direction}` : sprite;
  const source = getSpriteSource(spriteName);

  const flipStyle: ImageStyle =
    direction === 'left' ? { transform: [{ scaleX: -1 }] } : {};

  return (
    <Image
      source={source}
      style={[{ width, height }, flipStyle]}
      resizeMode="contain"
    />
  );
}
