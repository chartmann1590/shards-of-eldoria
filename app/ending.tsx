import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, typography, spacing, radius } from '../src/theme';
import { Button } from '../src/ui/Button';
import { Panel } from '../src/ui/Panel';
import { useGameStore } from '../src/engine/store';

export default function EndingScreen() {
  const score = useGameStore((s) => s.score);
  const flags = useGameStore((s) => s.flags);

  const flagsSet = flags
    ? Object.entries(flags).filter(([, v]) => v)
    : [];
  const shardsFound = flagsSet.filter(([k]) => k.startsWith('shard_')).length;
  const bossesDefeated = flagsSet.filter(([k]) => k.startsWith('boss_')).length;
  const totalFlags = flagsSet.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>VICTORY</Text>

        <View style={styles.divider} />

        <Text style={styles.story}>
          The Shards of Eldoria have been reunited. The darkness that threatened
          to consume the realm has been vanquished, and peace returns to the
          land. Your courage and determination have saved Eldoria from eternal
          shadow.
        </Text>

        <Panel style={styles.scorePanel}>
          <Text style={styles.scoreTitle}>Final Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Shards Found</Text>
            <Text style={styles.breakdownValue}>{shardsFound}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Bosses Defeated</Text>
            <Text style={styles.breakdownValue}>{bossesDefeated}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Achievements</Text>
            <Text style={styles.breakdownValue}>{totalFlags}</Text>
          </View>
        </Panel>

        <Text style={styles.endTitle}>THE END</Text>

        <Text style={styles.teaser}>
          But legends whisper of new adventures on the horizon... The world of
          Eldoria holds many more secrets yet to be discovered.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="TITLE SCREEN"
            variant="primary"
            onPress={() => router.replace('/')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.gutter,
    paddingTop: spacing.safeAreaTop,
    paddingBottom: spacing.safeAreaBottom,
    alignItems: 'center',
    gap: spacing.vStack,
  },
  title: {
    ...typography.headlineLg,
    color: colors.primary,
    textAlign: 'center',
  },
  divider: {
    width: '60%',
    height: 2,
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
  },
  story: {
    ...typography.bodyLg,
    color: colors.onSurface,
    textAlign: 'center',
    lineHeight: 28,
  },
  scorePanel: {
    width: '100%',
    alignItems: 'center',
  },
  scoreTitle: {
    ...typography.headlineMd,
    color: colors.primary,
    marginBottom: spacing.vStack,
  },
  scoreValue: {
    ...typography.statLg,
    color: colors.expGreen,
    marginBottom: spacing.vStack,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.gutter,
  },
  breakdownLabel: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  breakdownValue: {
    ...typography.statSm,
    color: colors.onSurface,
  },
  endTitle: {
    ...typography.headlineLg,
    color: colors.primary,
    marginTop: spacing.vStack,
  },
  teaser: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: spacing.vStack,
    width: '100%',
    alignItems: 'center',
  },
});
