# Adventure Game — Complete Build Plan

## Context

`H:\adventure-game\` is an empty directory. The user wants a **complete, shippable fantasy turn-based RPG** built with **React Native + Expo**, with:

- Protagonist, antagonist, full story, enemies, scoring, stats, party, save/load
- All sprites generated programmatically (no external art assets)
- Standalone **debug APK** (Android) + **unsigned IPA** (iOS, sideloadable with free Apple ID)
- GitHub repo created, committed, and pushed (gh CLI is authed as `chartmann1590`)
- Sideloading instructions for iOS without a paid Apple developer account

This first version must be ship-ready and self-contained. The user plans to expand it over time, so the architecture must be extensible (data-driven content, modular systems).

**Game concept:** *Shards of Eldoria* — a knight (Sir Kael) sets out to recover three shattered crystal shards stolen by the Shadow Lord Malgrith. The player explores an overworld, a forest, and a fortress dungeon; recruits two companions; fights random encounters + scripted bosses; and concludes with a final confrontation. One complete chapter in v1.

**Target platforms unchanged:** React Native + Expo, shipping to **both Android and iOS** as one codebase. The Stitch designs below are *visual references only* — we still build native screens with React Native components.

---

## Design source — Google Stitch output

The user generated UI designs in Google Stitch and extracted the zip to `H:\adventure-game\stitch_shards_of_eldoria_ui_design\`. This folder is the **visual source of truth** for every screen. It contains:

```
stitch_shards_of_eldoria_ui_design/
├── eldorian_shard/DESIGN.md      # Design system: colors, typography, spacing, components
├── title_screen/                 → app/index.tsx
├── save_slot_picker/             → app/load.tsx (and save flow)
├── overworld_screen/             → app/game.tsx
├── dialogue_overlay/             → src/ui/DialogueBox.tsx (overlay, not a route)
├── battle_screen/                → app/battle.tsx
├── pause_menu/                   → app/menu.tsx
├── party_stats_screen/           → src/ui/StatsTab.tsx (tab inside menu)
├── inventory_screen/             → src/ui/InventoryTab.tsx (tab inside menu)
└── victory_screen/               → app/ending.tsx
```

Each subfolder has `code.html` (Tailwind+HTML mockup) and `screen.png` (rendered preview). **The HTML is web code, not React Native** — we treat it as a markup blueprint and port the layout, color usage, spacing, and typography into RN components. Where Stitch uses Material Symbols Outlined icons, we substitute the equivalent glyphs from `@expo/vector-icons` (MaterialIcons / MaterialCommunityIcons sets).

### Design tokens (lifted verbatim from `eldorian_shard/DESIGN.md`)

These tokens go into `src/theme.ts` as the single source of styling. Replaces the looser palette I sketched earlier.

```ts
// src/theme.ts
export const colors = {
  // surfaces (MD3-style tokens from Stitch)
  background: '#071033',
  surface: '#071033',
  surfaceContainerLowest: '#030a2e',
  surfaceContainerLow: '#10193c',
  surfaceContainer: '#151d40',
  surfaceContainerHigh: '#1f284b',
  surfaceContainerHighest: '#2a3357',
  surfaceBright: '#2f375b',
  surfaceVariant: '#2a3357',
  // brand
  primary: '#f2ca50',          // gold bright
  primaryContainer: '#d4af37', // gold accent
  onPrimary: '#3c2f00',
  // text
  onSurface: '#dde1ff',        // parchment-blue text
  onSurfaceVariant: '#d0c5af', // parchment muted
  outline: '#99907c',
  outlineVariant: '#4d4635',
  // semantic / game state
  hpRed: '#C5364A',
  mpBlue: '#2E6BE6',
  expGreen: '#2BB673',
  error: '#ffb4ab',
  errorContainer: '#93000a',
} as const;

export const typography = {
  headlineLg: { fontFamily: 'Anybody_800ExtraBold', fontSize: 24, lineHeight: 32, letterSpacing: 1.2 },
  headlineMd: { fontFamily: 'Anybody_700Bold',      fontSize: 18, lineHeight: 24, letterSpacing: 0.9 },
  bodyLg:     { fontFamily: 'Inter_400Regular',     fontSize: 16, lineHeight: 24 },
  bodyMd:     { fontFamily: 'Inter_400Regular',     fontSize: 14, lineHeight: 20 },
  statLg:     { fontFamily: 'JetBrainsMono_700Bold',   fontSize: 18, lineHeight: 24 },
  statSm:     { fontFamily: 'JetBrainsMono_500Medium', fontSize: 12, lineHeight: 16 },
  labelCaps:  { fontFamily: 'Inter_700Bold', fontSize: 11, lineHeight: 16, letterSpacing: 1.1, textTransform: 'uppercase' },
} as const;

export const spacing = {
  safeAreaTop: 44,
  safeAreaBottom: 34,
  gutter: 16,
  vStack: 12,
  panelPadding: 16,
  rivetSize: 4,
} as const;

export const radius = { sm: 2, md: 4, lg: 6, xl: 12, full: 9999 } as const;
```

### Component conventions (from DESIGN.md)

- **Panel**: navy fill (`surfaceContainer`), 2px gold (`primaryContainer`) border, 4×4 gold-bright rivets at the four corners, 16px inner padding.
- **Primary button**: gold fill, navy text (`onPrimary`), 2px radius. Min 44pt tap height.
- **Secondary button**: navy fill, 2px gold border, gold text.
- **Cursor**: selected list items get a gold ▶ on the left + a 2px parchment underline.
- **Resource bars**: HP red, MP sapphire, EXP emerald (4px thinner). All strictly rectangular (0px radius).
- **Chips/badges**: small navy boxes with 1px gold border for elemental types / status effects.

---

## Tech stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | **Expo SDK 52** (managed workflow) | Required by user; supports Windows → cloud iOS builds via EAS |
| Language | **TypeScript (strict)** | Catches data-model bugs in a content-heavy game |
| Routing | **expo-router v4** (file-based) | Idiomatic Expo, clean nav between screens |
| State | **Zustand** + **immer** | Simpler than Redux, fine for single-player save state |
| Persistence | **@react-native-async-storage/async-storage** | Standard for save slots |
| Rendering | **Plain `<View>` grid + `<Image>` sprites** (no Skia/Canvas at runtime) | Sufficient for 16×16 tile rendering at low FPS; avoids native module complexity |
| Animation | **react-native-reanimated** (already bundled with Expo) | Sprite walk cycles, attack flashes, screen transitions |
| Sound | **expo-av** with simple generated WAV beeps | Optional but included; assets generated in same script as sprites |
| Build | **EAS Build** (cloud) | Only way to build iOS from Windows |
| Sprite gen | **Node.js script using `pngjs`** (pure JS, no native deps) | Avoids `node-canvas` install pain on Windows; deterministic pixel output |
| Fonts | **`@expo-google-fonts/anybody`, `/inter`, `/jetbrains-mono`** | Stitch design system uses these three exact families; expo-google-fonts loads them as native fonts on both Android and iOS |
| Icons | **`@expo/vector-icons`** (MaterialIcons + MaterialCommunityIcons) | Stitch mockups use Material Symbols; vector-icons gives the same glyph set bundled with Expo, works identically on Android and iOS |

Why not `react-native-game-engine` or `react-native-skia`: turn-based RPGs do not need a per-frame game loop or GPU canvas — the world only redraws on player action. Plain RN views keep the codebase approachable and the bundle small.

Why `pngjs` not `node-canvas`: `node-canvas` requires Cairo native libs that often fail to install cleanly on Windows. `pngjs` is pure JS and writes pixels directly to a buffer — perfect for procedural pixel art where we control every pixel anyway.

---

## Project structure

```
H:\adventure-game\
├── app/                          # expo-router screens
│   ├── _layout.tsx               # Root stack, font/asset preload
│   ├── index.tsx                 # Title screen (New / Continue / Settings)
│   ├── load.tsx                  # Save-slot picker
│   ├── game.tsx                  # Main overworld + dungeon view
│   ├── battle.tsx                # Turn-based combat screen
│   ├── menu.tsx                  # In-game pause: stats / party / inventory
│   └── ending.tsx                # Endgame cutscene
├── src/
│   ├── engine/
│   │   ├── store.ts              # Zustand store: save state, party, flags
│   │   ├── save.ts               # AsyncStorage wrapper, 3 slots, versioning
│   │   ├── combat.ts             # Damage formulas, turn order, AI
│   │   ├── movement.ts           # Tile-collision, encounter rolls
│   │   ├── dialogue.ts           # Branching dialogue runner
│   │   └── score.ts              # Score events (enemies, gold, secrets)
│   ├── data/                     # All content lives here (data-driven, easy to extend)
│   │   ├── maps/                 # Tile-grid JSON for overworld, forest, fortress
│   │   ├── enemies.ts            # Goblin, Wraith, Skeleton, Wolf, Captain, Malgrith
│   │   ├── items.ts              # Potions, weapons, armor, key items
│   │   ├── party.ts              # Kael, Lyra (mage), Brann (healer)
│   │   ├── skills.ts             # Slash, Fireball, Heal, Defend, Flee
│   │   ├── dialogue/             # Per-scene dialogue trees
│   │   └── story.ts              # Quest flags, scripted triggers
│   ├── ui/
│   │   ├── TileMap.tsx           # Grid renderer
│   │   ├── Sprite.tsx            # Animated sprite (walk cycle)
│   │   ├── DialogueBox.tsx       # Typewriter dialogue
│   │   ├── StatBar.tsx           # HP/MP/EXP bars
│   │   ├── Menu.tsx              # Reusable menu list
│   │   └── BattleScene.tsx       # Combat layout + animations
│   └── theme.ts                  # Colors, fonts, sizes
├── assets/
│   ├── sprites/                  # Generated PNGs (committed to repo)
│   ├── tiles/                    # Generated terrain PNGs
│   ├── ui/                       # Generated UI frames, icons
│   ├── audio/                    # Generated SFX WAVs (beep, hit, win, magic)
│   ├── icon.png                  # 1024×1024 app icon (generated)
│   ├── adaptive-icon.png         # Android adaptive
│   └── splash.png                # Splash screen
├── scripts/
│   ├── gen-sprites.ts            # Generates ALL sprites/tiles/UI as PNGs
│   ├── gen-audio.ts              # Generates simple WAV SFX
│   └── gen-icons.ts              # Generates app icon + splash + adaptive
├── eas.json                      # EAS Build profiles (debug APK + unsigned IPA)
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
├── README.md                     # Run instructions, sideload guide, controls
├── .gitignore
├── PLAN.md                       # this file
└── stitch_shards_of_eldoria_ui_design/   # Stitch UI mockups (visual reference only)
    ├── eldorian_shard/DESIGN.md          # design system: colors, type, spacing
    ├── title_screen/{code.html,screen.png}
    ├── save_slot_picker/{code.html,screen.png}
    ├── overworld_screen/{code.html,screen.png}
    ├── dialogue_overlay/{code.html,screen.png}
    ├── battle_screen/{code.html,screen.png}
    ├── pause_menu/{code.html,screen.png}
    ├── party_stats_screen/{code.html,screen.png}
    ├── inventory_screen/{code.html,screen.png}
    └── victory_screen/{code.html,screen.png}
```

Everything that is *content* (maps, enemies, dialogue) lives in `src/data/` as plain TS/JSON. Adding a new dungeon = adding one map JSON + dialogue file + a story flag. That's the extensibility hook for future expansion.

---

## Sprite & asset generation

**The hardest part of the project.** All *in-game* visual assets (characters, enemies, tiles, items) are produced by `scripts/gen-sprites.ts`, a Node.js script that uses `pngjs` to write pixels directly into PNG files. Output is committed to the repo so end users never need to run the script.

The *UI chrome* (panels, buttons, dialogue boxes, score sheets, menus) is **not** sprite-based — it's built with React Native `View`/`Text` components styled with the design tokens from `src/theme.ts`, following the Stitch mockups in `stitch_shards_of_eldoria_ui_design/`. Only the diegetic game world uses pixel-art PNGs.

### Sprite catalog (all 16×16 unless noted; 4× scale at render time → 64×64 on screen)

**Characters** — 4 directions × 2 frames each (walk cycle):
- Sir Kael (protagonist, blue armor, blond hair)
- Lyra (mage companion, purple robe)
- Brann (healer companion, green cloak)
- Malgrith (antagonist, 32×32, dark armor + red cape)
- Generic villagers ×3 (palette swaps)
- Shopkeeper, King, Innkeeper

**Enemies** — idle + attack frame:
- Goblin (small green)
- Wolf (gray, low to ground)
- Skeleton (bone white)
- Wraith (translucent purple, no legs)
- Fortress Captain (mini-boss, 24×24)
- Malgrith (final boss, 32×32, already above)

**Terrain tiles** (16×16, tileable):
- Grass (3 variants for natural look)
- Stone path, dirt path
- Tree, bush, flower
- Water (animated 2-frame)
- Stone wall, brick wall, fortress floor
- Dungeon stone, torch (animated 2-frame)
- Door (closed/open), stairs up/down
- Chest (closed/open)

**Items** (16×16 icons):
- Potion (red), Mana potion (blue), Elixir (gold)
- Iron sword, steel sword, knight sword
- Leather armor, chainmail, plate
- 3 crystal shards (red, blue, green — story keys)
- Gold coin

**UI**:
- Dialogue box frame (9-slice, gold trim on dark blue)
- Menu cursor (arrow)
- Heart/mana/EXP icons
- Battle action icons (Attack/Magic/Item/Run)

**App icon + splash**:
- `icon.png` 1024×1024 — Kael portrait on parchment background
- `adaptive-icon.png` 1024×1024 foreground (Android)
- `splash.png` with game logo on dark blue

### Sprite generation approach

The script defines a tiny palette-indexed DSL: each sprite is a string-art template (one char per pixel, mapped to a palette). Example:

```ts
const KAEL_DOWN_1 = [
  '....HHHH....',
  '...HFFFFH...',
  '...HFEFEH...',  // E = eye color
  '..HHFFFFHH..',
  '..AABBBBAA..',  // A = armor edge, B = armor
  '..ABBSSBBA..',  // S = sword grip
  '...BBBBBB...',
  '...BB..BB...',
  '...PP..PP...',  // P = pants/boots
];
const PALETTE_KAEL = { H:'#FFD699', F:'#FFE4B5', E:'#1E3A8A', A:'#3B5BD9', B:'#2746A8', S:'#8B5A2B', P:'#1F2937' };
```

This makes characters editable as ASCII art — extensible, diff-friendly, and the user can tweak them by hand later. All sprite definitions live in `scripts/sprites/*.ts`, loaded by `gen-sprites.ts` which writes each PNG via `pngjs`.

Walk cycles: two frames per direction with a 1-pixel leg shift. Battle attack frames: one extra "lunging" pose per character.

### Audio generation

`scripts/gen-audio.ts` uses pure JS to write WAV headers + PCM sine/square waves: tiny beep (menu nav), longer arpeggio (level up), descending tone (damage), ascending tone (heal), fanfare (victory). Each file <20KB. Totally optional — game runs silent if files missing.

---

## Game design

### Story (one chapter, ~30–60 min playtime)

1. **Opening** — Eldoria's three crystal shards stolen by Malgrith. King sends Sir Kael to recover them.
2. **Town of Aerwyn** — Tutorial. Buy potion, talk to NPCs, learn controls. Recruit **Lyra** (mage).
3. **Whispering Forest** — Random encounters (goblins, wolves). Recover **Red Shard** from a goblin chief mini-boss. Recruit **Brann** (healer) at forest shrine.
4. **Old Crypt** — Skeletons + wraiths. Recover **Blue Shard** from a wraith lord.
5. **Malgrith's Fortress** — Multi-floor dungeon. Skeletons, fortress captains. Recover **Green Shard** mid-dungeon. Final boss: **Malgrith**.
6. **Ending** — Cutscene: Kael returns crystals, kingdom restored. Score screen + "Continue your adventure soon..." (hook for v2).

### Stats system

Per character: `HP, MP, ATK, DEF, SPD, LVL, EXP`. Party-shared: `GOLD, SCORE`. EXP curve: `level² × 50`. Level-up grants +5 HP, +2 MP, +1 ATK/DEF, sometimes +1 SPD; unlocks new skill at levels 3/6/9.

### Combat

Classic JRPG menu turn-based. Turn order by SPD. Actions: **Attack** (basic), **Skill** (uses MP, e.g., Slash/Fireball/Heal/Shield), **Item** (consumable), **Defend** (½ damage taken next turn), **Flee** (only random encounters). Damage = `max(1, ATK + skill_power − target.DEF + random(-2..2))`. Enemy AI: weighted random — bosses prioritize low-HP party members.

### Encounters

Tile-walking on dungeon/forest tiles triggers a 6% per-step encounter roll. Overworld town/safe tiles have no encounters. Bosses are fixed scripted triggers, not random.

### Scoring

Score tracked across the run: +10 per enemy defeated, +50 per boss, +5 per gold (capped), +100 per secret chest, +500 per shard. Displayed on ending screen.

### Save/load

Three slots stored under keys `save_slot_0/1/2` in AsyncStorage. Each save is a JSON blob containing party state, position, inventory, story flags, score, and a `version` field for forward-compat. Save anywhere from the pause menu. Auto-save on chapter transitions.

---

## Core systems — implementation notes

- **`store.ts`** — single Zustand store with slices: `party`, `inventory`, `world` (current map + position), `flags` (story progress booleans), `score`, `settings`. Persisted via `save.ts`, not zustand-persist (we need slot control).
- **`save.ts`** — `saveToSlot(n)`, `loadFromSlot(n)`, `listSlots()` returns metadata (chapter name, playtime, level) for the load screen.
- **`combat.ts`** — pure functions: `rollTurnOrder`, `applyAction`, `checkBattleEnd`. Reducer-style so it's trivially unit-testable later.
- **`movement.ts`** — `tryMove(direction)` checks tile collision flags, advances position, returns `{moved, encounterTriggered, transitionTo}`.
- **`TileMap.tsx`** — renders a 11×9 window of tiles around the player (handles all current screens), uses `<Image>` with `resizeMode="contain"` and `style={{imageRendering:'pixelated'}}` equivalent via `fadeDuration={0}` + nearest-neighbor scaling. On RN, set `Image` with `defaultSource` and a `style` that disables filtering by upscaling integer multiples only.
- **Controls** — on-screen D-pad + action button (bottom of screen), styled per the Stitch `overworld_screen` mockup (gold-bordered navy buttons in a + pattern + A/B circles). Touch-optimized; no gestures needed.
- **UI primitives** — `Panel`, `Button`, `Cursor`, `StatBar`, `Chip`, `Rivet` components in `src/ui/` consume `src/theme.ts` tokens. Every Stitch screen maps to one expo-router screen file (see "Design source" section above); the build process for each screen is: open the Stitch `screen.png` for the visual target, scan `code.html` for layout structure and class hints, then re-implement in RN with our primitives.

---

## Build & shipping

### `eas.json` profiles

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "preview-android": {
      "android": { "buildType": "apk", "gradleCommand": ":app:assembleRelease" },
      "distribution": "internal"
    },
    "preview-ios-unsigned": {
      "ios": { "simulator": false, "credentialsSource": "local" },
      "distribution": "internal"
    }
  }
}
```

The iOS unsigned build is the tricky one. The workflow:

1. Create a `credentials.json` with placeholder/empty signing — EAS will produce an `.ipa` that has no Apple-issued embedded provisioning profile.
2. Run `npx eas-cli build --platform ios --profile preview-ios-unsigned --non-interactive` from Windows. The build runs on EAS's macOS workers.
3. Output is an `.ipa` downloadable from the build page URL.
4. End user runs the IPA through **AltStore** or **Sideloadly** on their PC, which re-signs it with a free Apple ID's 7-day cert and installs to a connected iPhone.

**Fallback if EAS refuses an unsigned build:** the README will document the alternate path of using a free Apple ID directly with EAS (Apple's free dev tier supports ad-hoc 7-day signing for up to 3 devices). The user provides their free Apple ID at build time and EAS signs with it. The IPA is then installable via Apple Configurator 2 or AltStore.

### Android debug APK

`npx eas-cli build --platform android --profile preview-android --non-interactive` → downloadable APK. Sideload by USB-transferring to device and tapping (after enabling "install from unknown sources").

### GitHub repo creation

```powershell
cd H:\adventure-game
git init
git add .
git commit -m "Initial commit: Shards of Eldoria adventure game"
gh repo create chartmann1590/shards-of-eldoria --public --source=. --remote=origin --push
```

`gh` is already authed as `chartmann1590`. Repo name `shards-of-eldoria` (confirmed public).

### README contents

- What the game is, screenshot
- How to run dev (`npm install && npx expo start`)
- How to build (`npx eas-cli build ...` commands)
- **iOS sideload guide**: AltStore install steps, free Apple ID flow, 7-day refresh caveat
- **Android install guide**: enable unknown sources, transfer APK, install
- Controls
- Save data location
- Roadmap / how to add a new dungeon

---

## iOS sideload instructions (excerpt for README)

### Option A — AltStore (recommended, free)

1. Install **AltServer** on a Windows PC from altstore.io.
2. Install **iTunes** (from Apple, not Microsoft Store) and **iCloud for Windows** — required dependencies.
3. Connect iPhone via USB, trust the computer.
4. In AltServer tray icon → "Install AltStore" → select your iPhone → enter a **free Apple ID** + app-specific password.
5. On iPhone, go to Settings → General → VPN & Device Management → trust the developer profile.
6. Open AltStore on the iPhone, tap "+" in the My Apps tab, select the downloaded `shards-of-eldoria.ipa`.
7. App installs. **Re-open AltStore every 7 days** while iPhone is on same Wi-Fi as your PC to refresh the signature (or AltServer can do it automatically in the background).

### Option B — Sideloadly (alternative)

1. Install **Sideloadly** from sideloadly.io.
2. Connect iPhone, drag the IPA in, enter free Apple ID, click "Start".
3. Trust developer profile in iPhone Settings as above.

### Limitations of free Apple ID

- App expires after **7 days** — must refresh
- Max **3 sideloaded apps** at a time per Apple ID
- Some entitlements (push, in-app purchase) unavailable — game uses none of these

---

## Verification (after build, before declaring done)

1. **Code health**: `npx tsc --noEmit` passes, `npx expo start` boots without errors.
2. **Sprite generation**: `npm run gen-assets` produces every PNG in `assets/` — check file count matches catalog.
3. **Game flow**: launch in Expo Go on user's phone (Android or iOS) and:
   - Title → New Game → tutorial dialogue → town movement
   - Walk into forest → trigger random encounter → win combat → return to overworld
   - Open pause menu → check stats, inventory, party
   - Save to slot 0 → kill app → reload → continue from slot 0
   - (Smoke only: full playthrough is for the user to enjoy.)
4. **Android APK**: download from EAS, install on a device or emulator, launch, reach the title screen.
5. **iOS IPA**: download from EAS, attempt sideload via AltStore on the user's setup. (User has to do this themselves since they own the iPhone + AltServer setup.)
6. **GitHub**: repo URL returned, push verified by `gh repo view`.

---

## Out of scope for v1 (explicit non-goals)

- Multiplayer / online features
- Save sync to cloud (local AsyncStorage only)
- In-app purchases
- More than one chapter — architecture supports it; content for chapters 2+ comes later
- Localization (English only)
- Accessibility (screen reader, color-blind modes) — flagged for v2
- High-resolution art / animations beyond 2-frame walk cycles
- Custom font (uses system font for v1; can swap to a pixel font later)

---

## Execution sequencing (when plan is approved)

1. `npm init` → install Expo, deps (incl. `@expo-google-fonts/anybody|inter|jetbrains-mono`, `@expo/vector-icons`), set up `app.json` + `tsconfig.json`.
2. Write `src/theme.ts` with the token block above. Wire font loading in `app/_layout.tsx` via `useFonts` from expo-google-fonts.
3. Write `scripts/gen-sprites.ts`, `gen-audio.ts`, `gen-icons.ts`; run them → in-game pixel assets land in `assets/`.
4. Build core engine: `store`, `save`, `combat`, `movement`.
5. Build UI primitives in `src/ui/`: `Panel`, `Button`, `Cursor`, `StatBar`, `Chip`, `Rivet`, `Sprite`, `TileMap`, `DialogueBox`, `Menu`, `BattleScene` — every primitive matches a recurring element from the Stitch mockups.
6. Wire screens (`index`, `load`, `game`, `battle`, `menu`, `ending`) via expo-router. For each screen, open the matching `stitch_shards_of_eldoria_ui_design/<screen>/screen.png` as the visual target and `code.html` as the layout reference; re-implement in RN.
7. Author content in `src/data/` — one map at a time, dialogue last.
8. Smoke-test in Expo Go on Android **and** iOS (single Expo Go build serves both platforms).
9. Write `eas.json`, kick off both EAS builds (`preview-android` APK + `preview-ios-unsigned` IPA) in parallel — one codebase, two artifacts.
10. While builds run: write README with sideload guide, init git, create GitHub repo, push.
11. Once builds finish: download artifacts, link them in README + final user-facing message.

Estimated execution effort: substantial — this is a multi-hour build even with everything planned out. The user explicitly opted into this scope. The Stitch designs accelerate the UI portion since the visual decisions are already locked.
