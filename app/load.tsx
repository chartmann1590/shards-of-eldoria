import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listSlots, loadFromSlot } from '../src/engine/save';
import { useGameStore } from '../src/engine/store';
import { Panel } from '../src/ui/Panel';
import { Button } from '../src/ui/Button';
import { colors, typography, spacing } from '../src/theme';

interface SlotInfo {
  slot: number;
  chapter: string;
  level: number;
  playTime: number;
}

export default function LoadScreen() {
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loading, setLoading] = useState<number | null>(null);

  useEffect(() => {
    listSlots().then((data) => {
      const mapped: SlotInfo[] = data.map((s, i) =>
        s ? { slot: i, chapter: s.chapter, level: s.level, playTime: s.playTime }
          : { slot: i, chapter: '', level: 0, playTime: 0 },
      );
      setSlots(mapped);
    });
  }, []);

  const handleLoad = async (slotIndex: number) => {
    if (!slots[slotIndex] || !slots[slotIndex].chapter) return;
    setLoading(slotIndex);
    const state = await loadFromSlot(slotIndex);
    if (state) {
      useGameStore.getState().loadState(state);
      router.replace('/game');
    }
    setLoading(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2190'} BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LOAD GAME</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.slotList}>
        {slots.map((slot, idx) => (
          <TouchableOpacity key={idx} onPress={() => handleLoad(idx)} disabled={!slot.chapter}>
            <Panel style={{ padding: spacing.panelPadding, opacity: slot.chapter ? 1 : 0.5 }}>
              {loading === idx ? (
                <ActivityIndicator color={colors.primary} />
              ) : slot.chapter ? (
                <View>
                  <Text style={styles.slotLabel}>Slot {idx + 1}</Text>
                  <Text style={styles.slotChapter}>{slot.chapter}</Text>
                  <View style={styles.slotMeta}>
                    <Text style={styles.slotMetaText}>Level: {slot.level}</Text>
                    <Text style={styles.slotMetaText}>Time: {Math.floor(slot.playTime / 60)}m</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyText}>EMPTY</Text>
              )}
            </Panel>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Button title="BACK" onPress={() => router.back()} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.gutter, paddingVertical: 8,
    backgroundColor: colors.surfaceContainer, borderBottomWidth: 2,
    borderBottomColor: colors.primaryContainer,
  },
  backButton: { paddingVertical: 8 },
  backText: { ...typography.bodyMd, color: colors.primary },
  headerTitle: { ...typography.headlineMd, color: colors.primary },
  slotList: { flex: 1, padding: spacing.gutter, gap: spacing.vStack },
  slotPanel: { padding: spacing.panelPadding },
  emptySlot: { opacity: 0.5 },
  slotLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant, marginBottom: 4 },
  slotChapter: { ...typography.bodyLg, color: colors.onSurface, marginBottom: 4 },
  slotMeta: { flexDirection: 'row', gap: spacing.gutter },
  slotMetaText: { ...typography.statSm, color: colors.onSurfaceVariant },
  emptyText: { ...typography.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', paddingVertical: 12 },
  footer: { padding: spacing.gutter },
});
