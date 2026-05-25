import type { MapData } from '../../engine/types';
import { townMap } from './town';
import { forestMap } from './forest';
import { cryptMap } from './crypt';
import { fortressMap } from './fortress';

export { townMap } from './town';
export { forestMap } from './forest';
export { cryptMap } from './crypt';
export { fortressMap } from './fortress';

export const maps: Record<string, MapData> = {
  town: townMap,
  forest: forestMap,
  crypt: cryptMap,
  fortress: fortressMap,
};
