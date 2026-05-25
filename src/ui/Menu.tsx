import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
}

interface MenuProps {
  items: MenuItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingVertical: 10,
    minHeight: 44,
  },
  selectedItem: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  cursor: {
    ...typography.bodyMd,
    color: colors.primaryContainer,
    width: 20,
    fontSize: 14,
  },
  cursorHidden: {
    opacity: 0,
  },
  label: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
  },
  selectedLabel: {
    color: colors.primaryContainer,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primaryContainer,
    fontWeight: '700',
  },
  icon: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginRight: 8,
    fontSize: 16,
  },
});

export function Menu({ items, selectedIndex, onSelect }: MenuProps) {
  return (
    <View>
      {items.map((item, index) => {
        const isSelected = index === selectedIndex;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelect(index)}
            style={[styles.item, isSelected && styles.selectedItem]}
            activeOpacity={0.6}
          >
            <Text style={[styles.cursor, !isSelected && styles.cursorHidden]}>
              {'▶'}
            </Text>
            {item.icon && <Text style={styles.icon}>{item.icon}</Text>}
            <Text style={[styles.label, isSelected && styles.selectedLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
