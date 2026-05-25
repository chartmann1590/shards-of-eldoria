import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';

type Direction = 'up' | 'down' | 'left' | 'right';

interface DPadProps {
  onMove: (direction: Direction) => void;
  onA?: () => void;
  onB?: () => void;
}

const BTN_SIZE = 44;

const arrowSymbols: Record<Direction, string> = {
  up: '\u25B2',
  down: '\u25BC',
  left: '\u25C0',
  right: '\u25B6',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.gutter * 2,
    paddingVertical: spacing.gutter,
    paddingBottom: spacing.safeAreaBottom + spacing.gutter,
  },
  dpadGrid: {
    width: BTN_SIZE * 3,
    height: BTN_SIZE * 3,
  },
  row: {
    flexDirection: 'row',
  },
  dirBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    backgroundColor: colors.surfaceContainer,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.outlineVariant,
  },
  arrowText: {
    ...typography.bodyMd,
    color: colors.primaryContainer,
    fontSize: 18,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  abBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  abLabel: {
    ...typography.headlineMd,
    color: colors.primaryContainer,
    fontWeight: '800',
  },
});

export function DPad({ onMove, onA, onB }: DPadProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dpadGrid}>
        <View style={styles.row}>
          <View style={styles.centerBtn} />
          <TouchableOpacity
            style={styles.dirBtn}
            onPress={() => onMove('up')}
            activeOpacity={0.6}
          >
            <Text style={styles.arrowText}>{arrowSymbols.up}</Text>
          </TouchableOpacity>
          <View style={styles.centerBtn} />
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dirBtn}
            onPress={() => onMove('left')}
            activeOpacity={0.6}
          >
            <Text style={styles.arrowText}>{arrowSymbols.left}</Text>
          </TouchableOpacity>
          <View style={styles.centerBtn} />
          <TouchableOpacity
            style={styles.dirBtn}
            onPress={() => onMove('right')}
            activeOpacity={0.6}
          >
            <Text style={styles.arrowText}>{arrowSymbols.right}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <View style={styles.centerBtn} />
          <TouchableOpacity
            style={styles.dirBtn}
            onPress={() => onMove('down')}
            activeOpacity={0.6}
          >
            <Text style={styles.arrowText}>{arrowSymbols.down}</Text>
          </TouchableOpacity>
          <View style={styles.centerBtn} />
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.abBtn, { marginBottom: 20 }]}
          onPress={onB}
          activeOpacity={0.6}
        >
          <Text style={styles.abLabel}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.abBtn}
          onPress={onA}
          activeOpacity={0.6}
        >
          <Text style={styles.abLabel}>A</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
