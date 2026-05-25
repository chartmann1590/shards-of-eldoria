import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import type { TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
  textStyle?: TextStyle;
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.gutter,
    paddingVertical: 10,
  },
  primary: {
    backgroundColor: colors.primaryContainer,
  },
  secondary: {
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
  },
  primaryText: {
    ...typography.bodyMd,
    color: colors.surfaceContainer,
    fontWeight: '700',
  },
  secondaryText: {
    ...typography.bodyMd,
    color: colors.primaryContainer,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.4,
  },
});

export function Button({
  title,
  onPress,
  variant = 'primary',
  style,
  disabled = false,
  textStyle,
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          isPrimary ? styles.primaryText : styles.secondaryText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
