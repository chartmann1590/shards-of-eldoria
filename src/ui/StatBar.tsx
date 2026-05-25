import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface StatBarProps {
  value: number;
  maxValue: number;
  color: string;
  height?: number;
  label?: string;
  showText?: boolean;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  label: {
    ...typography.bodySm,
    color: colors.onSurface,
  },
  valueText: {
    ...typography.statSm,
    color: colors.onSurface,
  },
  track: {
    backgroundColor: colors.surfaceContainerHighest,
    height: 4,
    borderRadius: 0,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 0,
  },
});

export function StatBar({
  value,
  maxValue,
  color,
  height = 4,
  label,
  showText = false,
}: StatBarProps) {
  const pct = maxValue > 0 ? Math.min(Math.max(value / maxValue, 0), 1) : 0;

  return (
    <View style={styles.container}>
      {(label || showText) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showText && (
            <Text style={styles.valueText}>
              {value}/{maxValue}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[styles.fill, { backgroundColor: color, width: `${pct * 100}%`, height }]}
        />
      </View>
    </View>
  );
}
