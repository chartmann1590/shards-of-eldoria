---
name: Eldorian Shard
colors:
  surface: '#071033'
  surface-dim: '#071033'
  surface-bright: '#2f375b'
  surface-container-lowest: '#030a2e'
  surface-container-low: '#10193c'
  surface-container: '#151d40'
  surface-container-high: '#1f284b'
  surface-container-highest: '#2a3357'
  on-surface: '#dde1ff'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#dde1ff'
  inverse-on-surface: '#262e52'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#b9c3ff'
  on-secondary: '#1f2c63'
  secondary-container: '#37437b'
  on-secondary-container: '#a6b2f1'
  tertiary: '#dccdb0'
  on-tertiary: '#38301b'
  tertiary-container: '#bfb296'
  on-tertiary-container: '#4e442f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b9c3ff'
  on-secondary-fixed: '#06154d'
  on-secondary-fixed-variant: '#37437b'
  tertiary-fixed: '#f0e1c3'
  tertiary-fixed-dim: '#d3c5a8'
  on-tertiary-fixed: '#221b08'
  on-tertiary-fixed-variant: '#4f4630'
  background: '#071033'
  on-background: '#dde1ff'
  surface-variant: '#2a3357'
typography:
  headline-lg:
    fontFamily: anybody
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: 0.05em
  headline-md:
    fontFamily: anybody
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  stat-lg:
    fontFamily: jetbrainsMono
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  stat-sm:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  safe-area-top: 44px
  safe-area-bottom: 34px
  gutter: 16px
  v-stack: 12px
  panel-padding: 16px
  rivet-size: 4px
---

## Brand & Style
The design system for this mobile RPG bridges the gap between nostalgic 16-bit JRPG aesthetics and modern mobile clarity. The brand personality is epic, adventurous, and structured, evoking the feeling of a tactile "tactical console" within a smartphone.

The style is a **Modern-Retro Hybrid**. It utilizes high-contrast, flat surfaces with pixel-precise accents. While the layout adheres to modern mobile UX standards (safe areas, touch targets), the visual treatment employs "9-slice" panel logic, heavy borders, and "rivet" iconography to ground the experience in a classic fantasy gaming world. The UI should feel like a high-fidelity restoration of a legendary 90s title.

## Colors
This design system uses a deeply layered navy foundation to provide maximum contrast for golden interactive elements and parchment-toned readability.

- **Primary Gold (#D4AF37):** Reserved for borders, active states, and call-to-action fills.
- **Deep Navy (#0B1437):** The global background color, providing a "void" depth.
- **Panel Navy (#16235A):** The primary container surface.
- **Parchment (#F5E6C8):** The standard color for all body text and icons, ensuring high legibility against dark backgrounds.
- **State Colors:** Distinct hues for HP, MP, and EXP bars follow traditional JRPG color theory for instant recognition during fast-paced combat.

## Typography
The typography strategy balances character with utility. 

- **Headlines:** Use **Anybody** (as a high-impact alternative to pixel fonts) with tight tracking and heavy weights to simulate blocky, impactful headers.
- **Body:** **Inter** provides the necessary legibility for long item descriptions and dialogue, rendered in Parchment color to reduce eye strain.
- **Stats & Numbers:** **JetBrains Mono** is used for all numerical data (HP/MP values, damage numbers). Its tabular figures ensure that numbers do not "jump" when values change rapidly during combat.

## Layout & Spacing
The layout is optimized for a 390x844 portrait orientation, common for modern mobile RPGs played one-handed or in "battle vertical" mode.

- **Grid:** A standard 16px gutter defines the safe horizontal margin.
- **Safe Areas:** Strict adherence to 44px top and 34px bottom margins to prevent UI clipping by the notch or home indicator.
- **Stacking:** Elements within panels follow a 12px vertical rhythm.
- **Touch Targets:** Despite the retro aesthetic, all buttons and interactive list items must maintain a minimum 44px height for accessibility.

## Elevation & Depth
In lieu of realistic shadows, depth is achieved through **Tonal Layering** and **9-Slice Borders**:

- **Layer 0 (Background):** Deep Navy (#0B1437).
- **Layer 1 (Panels):** Navy (#16235A) with a 2px Primary Gold border.
- **Layer 2 (Popups/Modals):** Lighter Navy (#1F3279) with a 2px Bright Gold border.
- **Inner Depth:** Each panel features a 1px inset "highlight" on the top and left edges in a slightly lighter navy, and a 1px "shadow" on the bottom and right edges to simulate a recessed or raised 9-slice look.
- **Rivets:** Corner accents are represented by 4px square "rivets" in Gold Bright (#FFD86B), placed exactly at the corners of main containers.

## Shapes
To maintain the "blocky" retro feel, roundedness is extremely restricted. 

- **Global Radius:** A 2px maximum radius is applied to panels and buttons, just enough to soften the digital edge without losing the geometric, 16-bit spirit.
- **Rivets:** Rivets are 0px (hard squares) to emphasize the pixel-art inspiration.
- **Progress Bars:** HP and MP bars are strictly rectangular (0px radius) to reflect classic bar-filling mechanics.

## Components
- **Panels:** The core container. Navy fill, 2px gold border, and 4px square rivets at each of the four exterior corners.
- **Primary Buttons:** Gold fill (#D4AF37) with Navy (#0B1437) bold text. 2px corner radius.
- **Secondary Buttons:** Navy fill with a 2px Gold border and Gold text.
- **The Cursor:** Selected items in a list are indicated by a Gold "▶" arrow to the left of the text, and a 2px Parchment underline extending across the width of the list item.
- **Input Fields:** Recessed Navy (#0B1437) boxes with a 1px Muted Parchment border.
- **Resource Bars:** 
    - **HP:** Red fill with a darker red background.
    - **MP:** Sapphire blue fill with a darker blue background.
    - **EXP:** Emerald green fill, significantly thinner (4px height) than HP/MP bars.
- **Chips/Badges:** Small rectangular boxes with a 1px Gold border, used for elemental types (Fire, Water, etc.) or status effects.