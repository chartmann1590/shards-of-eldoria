import { View, Image, StyleSheet, FlatList } from 'react-native';
import { Sprite } from './Sprite';

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

function getTileImage(tileType: string): any {
  const tiles: Record<string, any> = {
    grass_1: require('../../assets/tiles/grass_1.png'),
    grass_2: require('../../assets/tiles/grass_2.png'),
    grass_3: require('../../assets/tiles/grass_3.png'),
    dirt_1: require('../../assets/tiles/dirt_1.png'),
    dirt_2: require('../../assets/tiles/dirt_2.png'),
    stone_1: require('../../assets/tiles/stone_1.png'),
    stone_2: require('../../assets/tiles/stone_2.png'),
    water_1: require('../../assets/tiles/water_1.png'),
    water_2: require('../../assets/tiles/water_2.png'),
    wall_top: require('../../assets/tiles/wall_top.png'),
    wall_front: require('../../assets/tiles/wall_front.png'),
    tree_1: require('../../assets/tiles/tree_1.png'),
    tree_2: require('../../assets/tiles/tree_2.png'),
    path_1: require('../../assets/tiles/path_1.png'),
    path_2: require('../../assets/tiles/path_2.png'),
    sand_1: require('../../assets/tiles/sand_1.png'),
    lava_1: require('../../assets/tiles/lava_1.png'),
    snow_1: require('../../assets/tiles/snow_1.png'),
    bridge_1: require('../../assets/tiles/bridge_1.png'),
    stairs_down: require('../../assets/tiles/stairs_down.png'),
    stairs_up: require('../../assets/tiles/stairs_up.png'),
    floor_1: require('../../assets/tiles/floor_1.png'),
    floor_2: require('../../assets/tiles/floor_2.png'),
    void: require('../../assets/tiles/void.png'),
  };
  return tiles[tileType] || tiles.grass_1;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
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

  const rows: { key: string; tiles: { type: string; isPlayer: boolean }[] }[] = [];

  for (let vy = 0; vy < height; vy++) {
    const my = playerY - halfH + vy;
    const rowTiles: { type: string; isPlayer: boolean }[] = [];
    for (let vx = 0; vx < width; vx++) {
      const mx = playerX - halfW + vx;
      if (my >= 0 && my < mapH && mx >= 0 && mx < mapW) {
        rowTiles.push({
          type: tiles[my][mx],
          isPlayer: mx === playerX && my === playerY,
        });
      } else {
        rowTiles.push({ type: 'void', isPlayer: false });
      }
    }
    rows.push({ key: `row-${vy}`, tiles: rowTiles });
  }

  const renderRow = ({ item }: { item: { key: string; tiles: { type: string; isPlayer: boolean }[] } }) => (
    <View style={styles.row}>
      {item.tiles.map((tile, i) => (
        <View key={`${item.key}-tile-${i}`} style={styles.tile}>
          <Image
            source={getTileImage(tile.type)}
            style={styles.tile}
            resizeMode="stretch"
          />
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
