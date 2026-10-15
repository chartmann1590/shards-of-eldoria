import { View, Image, StyleSheet, FlatList } from 'react-native';
import { Sprite } from './Sprite';
import { colors } from '../theme';

interface TileMapProps {
  tiles: string[][];
  playerX: number;
  playerY: number;
  width?: number;
  height?: number;
}

const TILE_SIZE = 48;
const VIEWPORT_W = 11;
const VIEWPORT_H = 9;

const TILE_REGISTRY: Record<string, any> = {
  grass_1: require('../../assets/tiles/grass_1.png'),
  grass_2: require('../../assets/tiles/grass_2.png'),
  grass_3: require('../../assets/tiles/grass_3.png'),
  dirt_path: require('../../assets/tiles/dirt_path.png'),
  stone_path: require('../../assets/tiles/stone_path.png'),
  stone_wall: require('../../assets/tiles/stone_wall.png'),
  brick_wall: require('../../assets/tiles/brick_wall.png'),
  water_1: require('../../assets/tiles/water_1.png'),
  water_2: require('../../assets/tiles/water_2.png'),
  tree: require('../../assets/tiles/tree.png'),
  bush: require('../../assets/tiles/bush.png'),
  flower: require('../../assets/tiles/flower.png'),
  door_closed: require('../../assets/tiles/door_closed.png'),
  door_open: require('../../assets/tiles/door_open.png'),
  chest_closed: require('../../assets/tiles/chest_closed.png'),
  chest_open: require('../../assets/tiles/chest_open.png'),
  dungeon_stone: require('../../assets/tiles/dungeon_stone.png'),
  fortress_floor: require('../../assets/tiles/fortress_floor.png'),
  torch_1: require('../../assets/tiles/torch_1.png'),
  torch_2: require('../../assets/tiles/torch_2.png'),
  stairs_up: require('../../assets/tiles/stairs_up.png'),
  stairs_down: require('../../assets/tiles/stairs_down.png'),
};

function getTileImage(tileType: string): any {
  return TILE_REGISTRY[tileType] || TILE_REGISTRY.grass_1;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  void: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: colors.surfaceContainerLowest,
  },
  playerOverlay: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function TileMap({
  tiles,
  playerX,
  playerY,
  width = VIEWPORT_W,
  height = VIEWPORT_H,
}: TileMapProps) {
  const halfW = Math.floor(width / 2);
  const halfH = Math.floor(height / 2);
  const mapH = tiles.length;
  const mapW = mapH > 0 ? tiles[0].length : 0;

  const rows: { key: string; tiles: { type: string | null; isPlayer: boolean }[] }[] = [];

  for (let vy = 0; vy < height; vy++) {
    const my = playerY - halfH + vy;
    const rowTiles: { type: string | null; isPlayer: boolean }[] = [];
    for (let vx = 0; vx < width; vx++) {
      const mx = playerX - halfW + vx;
      if (my >= 0 && my < mapH && mx >= 0 && mx < mapW) {
        rowTiles.push({
          type: tiles[my][mx],
          isPlayer: mx === playerX && my === playerY,
        });
      } else {
        rowTiles.push({ type: null, isPlayer: false });
      }
    }
    rows.push({ key: `row-${vy}`, tiles: rowTiles });
  }

  const renderRow = ({ item }: { item: { key: string; tiles: { type: string | null; isPlayer: boolean }[] } }) => (
    <View style={styles.row}>
      {item.tiles.map((tile, i) => (
        <View key={`${item.key}-tile-${i}`} style={styles.tile}>
          {tile.type === null ? (
            <View style={styles.void} />
          ) : (
            <Image
              source={getTileImage(tile.type)}
              style={styles.tile}
              resizeMode="stretch"
            />
          )}
          {tile.isPlayer && (
            <View style={[StyleSheet.absoluteFill, styles.playerOverlay]}>
              <Sprite sprite="hero" width={TILE_SIZE} height={TILE_SIZE} />
            </View>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.key}
        renderItem={renderRow}
        scrollEnabled={false}
      />
    </View>
  );
}
