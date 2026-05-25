import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/engine/store';
import { colors, typography, spacing } from '../src/theme';

export default function TitleScreen() {
  const handleNewGame = () => {
    useGameStore.getState().initNewGame();
    router.replace('/game');
  };

  const handleContinue = () => {
    router.navigate('/load');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.subtitle}>SHARDS OF</Text>
          <Text style={styles.title}>ELDORIA</Text>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDiamond} />
            <View style={styles.dividerLine} />
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNewGame} activeOpacity={0.7}>
            <Text style={styles.primaryButtonText}>NEW GAME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleContinue} activeOpacity={0.7}>
            <Text style={styles.secondaryButtonText}>CONTINUE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Text style={styles.secondaryButtonText}>SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footer}>v1.0 — Chapter I</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  subtitle: {
    ...typography.headlineMd,
    color: colors.primary,
    letterSpacing: 6,
    opacity: 0.9,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Anybody_800ExtraBold',
    fontSize: 36,
    lineHeight: 44,
    color: colors.secondary,
    letterSpacing: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    width: 240,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primary,
  },
  dividerDiamond: {
    width: 12,
    height: 12,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
    marginHorizontal: 8,
    transform: [{ rotate: '45deg' }],
  },
  buttons: {
    width: '100%',
    gap: spacing.vStack,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: colors.primaryContainer,
    borderWidth: 2,
    borderColor: colors.secondary,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  primaryButtonText: {
    ...typography.headlineMd,
    color: colors.onPrimary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  secondaryButtonText: {
    ...typography.headlineMd,
    color: colors.primaryContainer,
  },
  footer: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingBottom: spacing.safeAreaBottom,
    opacity: 0.7,
    letterSpacing: 2,
  },
});
