# Shards of Eldoria

A fantasy turn-based RPG built with React Native + Expo. Play as Sir Kael on a quest to recover three stolen Crystal Shards from the Shadow Lord Malgrith.

## Quick Start

```bash
npm install
npx expo start
```

Open in Expo Go on your phone (Android or iOS) to play.

## Story

The Shadow Lord Malgrith has stolen the three Crystal Shards that protect the Kingdom of Eldoria. Sir Kael is dispatched by King Aldric to recover them. Journey through the Whispering Forest, brave the Old Crypt, and storm Malgrith's Fortress in this one-chapter adventure.

**Chapter 1: The Stolen Shards** (~30-60 min playtime)

### Party Members
- **Sir Kael** — Knight, balanced stats, Slash skill
- **Lyra** — Mage, joins in Whispering Forest, Fireball spell
- **Brann** — Healer, joins at Forest Shrine, Heal ability

### Enemies
Goblins, Wolves, Skeletons, Wraiths, Fortress Captains, Goblin Chief, Wraith Lord, and the final boss Malgrith.

## Building

### Android APK
```bash
npx eas-cli build --platform android --profile preview-android --non-interactive
```
Download the APK, transfer to device, enable "Install from unknown sources", tap to install.

### iOS (sideload with free Apple ID)

#### Option A — AltStore (recommended)
1. Install **AltServer** on your PC from altstore.io
2. Install **iTunes** (from Apple, not Microsoft Store) + **iCloud for Windows**
3. Connect iPhone via USB, trust the computer
4. AltServer tray icon → "Install AltStore" → select iPhone → enter free Apple ID
5. On iPhone: Settings → General → VPN & Device Management → trust developer profile
6. Open AltStore, tap "+", select the IPA
7. App installs. **Re-open AltStore every 7 days** to refresh signature

#### Option B — Sideloadly
1. Install from sideloadly.io
2. Connect iPhone, drag IPA in, enter free Apple ID, click "Start"

#### EAS Build
```bash
npx eas-cli build --platform ios --profile preview-ios-unsigned --non-interactive
```

**Free Apple ID limitations:** 7-day cert expiry, max 3 sideloaded apps. Game uses none of the restricted entitlements.

## Controls
- **D-pad** — Move on overworld/dungeon maps
- **A button** — Interact with NPCs and objects
- **B button** — Open pause menu (same as menu button in top bar)

## Save System
- 3 save slots stored locally on device
- Save anywhere from the pause menu
- Auto-save not implemented (manual save recommended)

## Project Structure
```
app/              — Expo Router screens (title, game, battle, menu, ending)
src/engine/       — Game logic (store, combat, movement, dialogue, save, score)
src/data/         — All content (maps, enemies, items, party, dialogue trees, story)
src/ui/           — Reusable UI components (Panel, Button, StatBar, TileMap, etc.)
src/theme.ts      — Design tokens (colors, typography, spacing)
assets/           — Generated pixel art sprites, tiles, audio, app icons
scripts/          — Asset generation scripts (run once, output committed)
```

## Adding Content
- New dungeon: Add map JSON in `src/data/maps/`, add dialogue in `src/data/dialogue/`, add story flag in `src/data/story.ts`
- New enemy: Add entry in `src/data/enemies.ts`
- New items: Add entry in `src/data/items.ts`
- New character: Add creator function in `src/data/party.ts`

## Tech Stack
- Expo SDK 56 (React Native)
- TypeScript (strict)
- Expo Router v4 (file-based routing)
- Zustand + Immer (state management)
- All sprites generated programmatically (no external art assets)

## Roadmap
- Chapter 2+ content
- Localization
- Accessibility (screen reader, color-blind modes)
- Custom pixel font
- Cloud save sync
