import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState } from './types';

export const SAVE_VERSION = 1;

export function getSlotKey(slot: number): string {
  return 'save_slot_' + slot;
}

export function getMetaKey(slot: number): string {
  return 'save_meta_' + slot;
}

export async function saveToSlot(slot: number, state: GameState): Promise<void> {
  const data = JSON.stringify({ ...state, version: SAVE_VERSION });
  await AsyncStorage.setItem(getSlotKey(slot), data);

  const meta = {
    chapter: state.chapter,
    level: state.party.length > 0 ? Math.max(...state.party.map((m) => m.level)) : 1,
    playTime: state.playTime,
  };
  await AsyncStorage.setItem(getMetaKey(slot), JSON.stringify(meta));
}

export async function loadFromSlot(slot: number): Promise<GameState | null> {
  const raw = await AsyncStorage.getItem(getSlotKey(slot));
  if (!raw) return null;

  try {
    const parsed: GameState = JSON.parse(raw);
    if (parsed.version !== SAVE_VERSION) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function deleteSlot(slot: number): Promise<void> {
  await AsyncStorage.multiRemove([getSlotKey(slot), getMetaKey(slot)]);
}

export async function listSlots(): Promise<
  Array<{ slot: number; chapter: string; level: number; playTime: number } | null>
> {
  const result: Array<{ slot: number; chapter: string; level: number; playTime: number } | null> = [];

  for (let i = 1; i <= 3; i++) {
    const raw = await AsyncStorage.getItem(getMetaKey(i));
    if (raw) {
      try {
        const meta = JSON.parse(raw);
        result.push({ slot: i, ...meta });
      } catch {
        result.push(null);
      }
    } else {
      result.push(null);
    }
  }

  return result;
}
