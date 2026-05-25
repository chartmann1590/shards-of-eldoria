import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/engine/store';
import { saveToSlot } from '../src/engine/save';
import { Panel } from '../src/ui/Panel';
import { Button } from '../src/ui/Button';
import { StatBar } from '../src/ui/StatBar';
import { colors, typography, spacing } from '../src/theme';
import { getChapter, getNextObjective } from '../src/data/story';
import { items as itemData } from '../src/data/items';

type Tab = 'stats' | 'party' | 'items';

export default function MenuScreen() {
  const [selectedTab, setSelectedTab] = useState<Tab>('stats');
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const party = useGameStore((s) => s.party);
  const inventory = useGameStore((s) => s.inventory);
  const gold = useGameStore((s) => s.gold);
  const score = useGameStore((s) => s.score);
  const flags = useGameStore((s) => s.flags);

  const handleSave = async () => {
    const state = useGameStore.getState();
    await saveToSlot(0, state);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(null), 1500);
  };

  const handleUseItem = (itemId: string) => {
    const targetIdx = party.findIndex((p) => p.isAlive);
    if (targetIdx >= 0) {
      useGameStore.getState().useItem(itemId, targetIdx);
      setSelectedItem(null);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'stats', label: 'STATS' },
    { key: 'party', label: 'PARTY' },
    { key: 'items', label: 'ITEMS' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MENU</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>{'\u2715'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'stats' && (
          <Panel>
            <Text style={styles.sectionTitle}>{getChapter(flags)}</Text>
            <Text style={styles.objective}>{getNextObjective(flags)}</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{score}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Gold</Text>
              <Text style={styles.statValue}>{gold}</Text>
            </View>
          </Panel>
        )}

        {selectedTab === 'party' && (
          <View style={styles.partyList}>
            {party.map((member, i) => (
              <Panel key={member.id} style={styles.memberPanel}>
                <Text style={styles.memberName}>{member.name} (Lv. {member.level})</Text>
                <StatBar value={member.hp} maxValue={member.maxHp} color={colors.hpRed} label={'HP'} showText />
                <View style={{ height: 4 }} />
                <StatBar value={member.mp} maxValue={member.maxMp} color={colors.mpBlue} label={'MP'} showText />
                <View style={{ height: 4 }} />
                <StatBar value={member.exp} maxValue={member.expToNext} color={colors.expGreen} label={'EXP'} />
                <View style={styles.statsGrid}>
                  <Text style={styles.statSmall}>ATK: {member.atk}</Text>
                  <Text style={styles.statSmall}>DEF: {member.def}</Text>
                  <Text style={styles.statSmall}>SPD: {member.spd}</Text>
                </View>
                <View style={styles.skillsRow}>
                  {member.skills.map((sk) => (
                    <View key={sk.id} style={styles.skillChip}>
                      <Text style={styles.skillText}>{sk.name}</Text>
                    </View>
                  ))}
                </View>
              </Panel>
            ))}
          </View>
        )}

        {selectedTab === 'items' && (
          <Panel>
            {inventory.length === 0 && (
              <Text style={styles.emptyText}>No items</Text>
            )}
            {inventory.map((inv) => {
              const item = itemData[inv.itemId];
              const isSelected = selectedItem === inv.itemId;
              return (
                <TouchableOpacity
                  key={inv.itemId}
                  onPress={() => setSelectedItem(isSelected ? null : inv.itemId)}
                  style={styles.itemRow}
                >
                  <Text style={styles.itemName}>
                    {item?.name || inv.itemId} x{inv.quantity}
                  </Text>
                  {isSelected && (
                    <View style={styles.itemDetail}>
                      <Text style={styles.itemDesc}>{item?.description}</Text>
                      {item?.type === 'consumable' && (
                        <Button title="Use" onPress={() => handleUseItem(inv.itemId)} variant="primary" />
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </Panel>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {saveMsg && <Text style={styles.saveMsg}>{saveMsg}</Text>}
        <View style={styles.footerButtons}>
          <Button title="SAVE" onPress={handleSave} variant="primary" />
          <View style={{ width: 12 }} />
          <Button title="LOAD" onPress={() => router.navigate('/load')} variant="secondary" />
        </View>
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
  headerTitle: { ...typography.headlineMd, color: colors.primary },
  closeButton: { padding: 8 },
  closeText: { color: colors.onSurface, fontSize: 20 },
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.surfaceContainerLow,
    borderBottomWidth: 1, borderBottomColor: colors.primaryContainer,
  },
  tab: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  activeTabText: { color: colors.primary },
  content: { flex: 1, padding: spacing.gutter },
  sectionTitle: { ...typography.headlineMd, color: colors.primary, marginBottom: 8 },
  objective: { ...typography.bodyMd, color: colors.onSurface, marginBottom: 16 },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 4, borderTopWidth: 1, borderTopColor: colors.surfaceContainerHighest,
  },
  statLabel: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  statValue: { ...typography.statSm, color: colors.primary },
  partyList: { gap: spacing.vStack },
  memberPanel: { padding: spacing.panelPadding },
  memberName: { ...typography.headlineMd, color: colors.onSurface, marginBottom: 8 },
  statsGrid: { flexDirection: 'row', gap: spacing.gutter, marginTop: 8 },
  statSmall: { ...typography.statSm, color: colors.onSurfaceVariant },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 },
  skillChip: {
    backgroundColor: colors.surfaceContainerHigh, borderWidth: 1,
    borderColor: colors.primaryContainer, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2,
  },
  skillText: { ...typography.labelCaps, color: colors.primary, fontSize: 10 },
  emptyText: { ...typography.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', paddingVertical: 20 },
  itemRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.surfaceContainerHighest },
  itemName: { ...typography.bodyLg, color: colors.onSurface },
  itemDetail: { marginTop: 8, gap: 8 },
  itemDesc: { ...typography.bodySm, color: colors.onSurfaceVariant, marginBottom: 4 },
  footer: { padding: spacing.gutter },
  saveMsg: { ...typography.bodySm, color: colors.expGreen, textAlign: 'center', marginBottom: 8 },
  footerButtons: { flexDirection: 'row', justifyContent: 'center' },
});
