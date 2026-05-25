import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameState, CharacterStats, InventoryItem, Direction, Item } from './types';
import { items as itemData } from '../data/items';

const initialState: GameState = {
  party: [],
  inventory: [],
  gold: 100,
  score: 0,
  currentMap: 'town',
  playerX: 8,
  playerY: 8,
  playerDirection: 'down' as Direction,
  flags: {},
  playTime: 0,
  chapter: 'The Stolen Shards',
  version: 1,
};

interface GameStore extends GameState {
  initNewGame: () => void;
  addPartyMember: (member: CharacterStats) => void;
  updatePartyMember: (index: number, updates: Partial<CharacterStats>) => void;
  healParty: () => void;

  addItem: (itemId: string, qty?: number) => void;
  removeItem: (itemId: string, qty?: number) => void;
  useItem: (itemId: string, targetIndex: number) => void;
  hasItem: (itemId: string) => boolean;

  setPosition: (x: number, y: number, map: string, dir?: Direction) => void;
  setFlag: (flag: string, value?: boolean) => void;
  hasFlag: (flag: string) => boolean;

  addScore: (points: number) => void;

  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;

  loadState: (state: GameState) => void;
  resetGame: () => void;
  getState: () => GameState;
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...initialState,

    initNewGame: () => {
      set((state) => {
        const kael: CharacterStats = {
          name: 'Sir Kael',
          id: 'sir_kael',
          level: 1,
          hp: 80,
          maxHp: 80,
          mp: 20,
          maxMp: 20,
          atk: 10,
          def: 8,
          spd: 7,
          exp: 0,
          expToNext: 50,
          skills: [
            {
              id: 'slash',
              name: 'Slash',
              mpCost: 0,
              power: 5,
              type: 'physical',
              target: 'single',
              description: 'A basic sword slash.',
            },
          ],
          isAlive: true,
        };

        state.party = [kael];
        state.inventory = [];
        state.gold = 100;
        state.score = 0;
        state.currentMap = 'town';
        state.playerX = 8;
        state.playerY = 8;
        state.playerDirection = 'down';
        state.flags = {};
        state.playTime = 0;
        state.chapter = 'The Stolen Shards';
        state.version = 1;
      });
    },

    addPartyMember: (member: CharacterStats) => {
      set((state) => {
        state.party.push(member);
      });
    },

    updatePartyMember: (index: number, updates: Partial<CharacterStats>) => {
      set((state) => {
        if (state.party[index]) {
          Object.assign(state.party[index], updates);
        }
      });
    },

    healParty: () => {
      set((state) => {
        for (const member of state.party) {
          member.hp = member.maxHp;
          member.mp = member.maxMp;
          member.isAlive = true;
        }
      });
    },

    addItem: (itemId: string, qty: number = 1) => {
      set((state) => {
        const existing = state.inventory.find((i) => i.itemId === itemId);
        if (existing) {
          existing.quantity += qty;
        } else {
          state.inventory.push({ itemId, quantity: qty });
        }
      });
    },

    removeItem: (itemId: string, qty: number = 1) => {
      set((state) => {
        const existing = state.inventory.find((i) => i.itemId === itemId);
        if (existing) {
          existing.quantity -= qty;
          if (existing.quantity <= 0) {
            const idx = state.inventory.findIndex((i) => i.itemId === itemId);
            if (idx !== -1) {
              state.inventory.splice(idx, 1);
            }
          }
        }
      });
    },

    useItem: (itemId: string, targetIndex: number) => {
      const state = get();
      const item: Item | undefined = itemData[itemId];
      if (!item || item.type !== 'consumable' || !item.effect) return;

      const target = state.party[targetIndex];
      if (!target || !target.isAlive) return;

      const existing = state.inventory.find((i) => i.itemId === itemId);
      if (!existing || existing.quantity <= 0) return;

      set((s) => {
        const t = s.party[targetIndex];
        if (!t || !t.isAlive) return;

        if (item.effect!.stat === 'hp') {
          t.hp = Math.min(t.maxHp, t.hp + item.effect!.value);
        } else if (item.effect!.stat === 'mp') {
          t.mp = Math.min(t.maxMp, t.mp + item.effect!.value);
        } else if (item.effect!.stat === 'atk') {
          t.atk += item.effect!.value;
        } else if (item.effect!.stat === 'def') {
          t.def += item.effect!.value;
        }

        const inv = s.inventory.find((i) => i.itemId === itemId);
        if (inv) {
          inv.quantity -= 1;
          if (inv.quantity <= 0) {
            const idx = s.inventory.findIndex((i) => i.itemId === itemId);
            if (idx !== -1) {
              s.inventory.splice(idx, 1);
            }
          }
        }
      });
    },

    hasItem: (itemId: string) => {
      return get().inventory.some((i) => i.itemId === itemId && i.quantity > 0);
    },

    setPosition: (x: number, y: number, map: string, dir?: Direction) => {
      set((state) => {
        state.playerX = x;
        state.playerY = y;
        state.currentMap = map;
        if (dir !== undefined) {
          state.playerDirection = dir;
        }
      });
    },

    setFlag: (flag: string, value: boolean = true) => {
      set((state) => {
        state.flags[flag] = value;
      });
    },

    hasFlag: (flag: string) => {
      return !!get().flags[flag];
    },

    addScore: (points: number) => {
      set((state) => {
        state.score += points;
      });
    },

    addGold: (amount: number) => {
      set((state) => {
        state.gold += amount;
      });
    },

    spendGold: (amount: number) => {
      if (get().gold < amount) return false;
      set((state) => {
        state.gold -= amount;
      });
      return true;
    },

    loadState: (loaded: GameState) => {
      set((state) => {
        Object.assign(state, loaded);
      });
    },

    resetGame: () => {
      set((state) => {
        Object.assign(state, { ...initialState });
      });
    },

    getState: () => {
      return get() as GameState;
    },
  })),
);
