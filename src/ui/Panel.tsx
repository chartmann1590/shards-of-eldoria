import { View } from 'react-native';
import { colors, spacing, radius } from '../theme';
import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
}

const styles = {
  container: {
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    borderRadius: radius.md,
    padding: spacing.panelPadding,
  } as ViewStyle,
  rivet: {
    position: 'absolute' as const,
    width: spacing.rivetSize,
    height: spacing.rivetSize,
    borderRadius: spacing.rivetSize / 2,
    backgroundColor: colors.primaryContainer,
  } as ViewStyle,
};

export function Panel({ children, style, padding }: PanelProps) {
  const containerStyle = [
    styles.container,
    padding !== undefined ? { padding } : undefined,
    style,
  ];

  const r = spacing.panelPadding - spacing.rivetSize / 2;
  const rivetPositions: ViewStyle[] = [
    { top: r, left: r },
    { top: r, right: r },
    { bottom: r, left: r },
    { bottom: r, right: r },
  ];

  return (
    <View style={containerStyle}>
      {rivetPositions.map((pos, i) => (
        <View key={i} style={[styles.rivet, pos]} />
      ))}
      {children}
    </View>
  );
}
