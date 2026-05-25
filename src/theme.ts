export const colors = {
  background: '#071033',
  surface: '#071033',
  surfaceContainerLowest: '#030a2e',
  surfaceContainerLow: '#10193c',
  surfaceContainer: '#151d40',
  surfaceContainerHigh: '#1f284b',
  surfaceContainerHighest: '#2a3357',
  surfaceBright: '#2f375b',
  surfaceVariant: '#2a3357',
  primary: '#f2ca50',
  primaryContainer: '#d4af37',
  onPrimary: '#3c2f00',
  onSurface: '#dde1ff',
  onSurfaceVariant: '#d0c5af',
  outline: '#99907c',
  outlineVariant: '#4d4635',
  hpRed: '#C5364A',
  mpBlue: '#2E6BE6',
  expGreen: '#2BB673',
  error: '#ffb4ab',
  errorContainer: '#93000a',
  secondary: '#b9c3ff',
  secondaryContainer: '#37437b',
  onSecondary: '#1f2c63',
  onSecondaryContainer: '#a6b2f1',
  tertiary: '#dccdb0',
  tertiaryContainer: '#bfb296',
  onTertiary: '#38301b',
  inverseSurface: '#dde1ff',
  inverseOnSurface: '#262e52',
  inversePrimary: '#735c00',
} as const;

export const typography = {
  headlineLg: { fontFamily: 'Anybody_800ExtraBold', fontSize: 24, lineHeight: 32, letterSpacing: 1.2 },
  headlineMd: { fontFamily: 'Anybody_700Bold', fontSize: 18, lineHeight: 24, letterSpacing: 0.9 },
  bodyLg: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24 },
  bodyMd: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  bodySm: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16 },
  statLg: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 18, lineHeight: 24 },
  statSm: { fontFamily: 'JetBrainsMono_500Medium', fontSize: 12, lineHeight: 16 },
  labelCaps: { fontFamily: 'Inter_700Bold', fontSize: 11, lineHeight: 16, letterSpacing: 1.1 },
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

export type ColorKey = keyof typeof colors;
