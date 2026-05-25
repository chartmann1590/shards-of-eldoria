import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing, radius } from '../src/theme';
import { Button } from '../src/ui/Button';
import { StatBar } from '../src/ui/StatBar';
import { Panel } from '../src/ui/Panel';
import { initCombat, applyAction, executeEnemyTurn } from '../src/engine/combat';
import type { CombatState, CharacterStats, Enemy } from '../src/engine/types';
import { items as itemData } from '../src/data/items';
import { useGameStore } from '../src/engine/store';

function isCharacter(entity: CharacterStats | Enemy): entity is CharacterStats {
  return 'skills' in entity;
}

export default function BattleScreen() {
  const params = useLocalSearchParams();
  const party = useGameStore((s) => s.party);
  const inventory = useGameStore((s) => s.inventory);
  const addScore = useGameStore((s) => s.addScore);
  const addGold = useGameStore((s) => s.addGold);
  const updatePartyMember = useGameStore((s) => s.updatePartyMember);
  const addItem = useGameStore((s) => s.addItem);

  const [combat, setCombat] = useState<CombatState | null>(null);
  const [submenu, setSubmenu] = useState<'skills' | 'items' | null>(null);
  const [selectingTarget, setSelectingTarget] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    try {
      const enemyIds: string[] = JSON.parse(params.enemies as string);
      const initialState = initCombat(party, enemyIds);
      setCombat(initialState);
    } catch {
      router.back();
    }
  }, []);

  const currentCharacter = useMemo(() => {
    if (!combat || combat.phase !== 'player') return null;
    const entity = combat.turnOrder[combat.currentTurnIndex];
    return isCharacter(entity) ? entity : combat.party[0] ?? null;
  }, [combat]);

  const processEnemyTurns = useCallback((state: CombatState): CombatState => {
    let result = state;
    const alive = result.party.filter(p => p.isAlive);
    if (alive.length === 0) return result;
    for (let i = 0; i < result.enemies.length; i++) {
      if (result.enemies[i].hp > 0 && result.phase !== 'defeat' && result.phase !== 'victory') {
        result = executeEnemyTurn(result);
      }
    }
    return result;
  }, []);

  const handleAction = useCallback(
    (action: string, targetIndex?: number) => {
      if (!combat || processing) return;
      setProcessing(true);
      setSubmenu(null);
      setSelectingTarget(false);
      setPendingAction(null);

      let state: CombatState = {
        ...combat,
        selectedAction: action,
        selectedTarget: targetIndex ?? combat.selectedTarget,
      };

      let newState = applyAction(state, action, targetIndex ?? combat.selectedTarget);

      const enemiesAlive = newState.enemies.some((e) => e.hp > 0);
      if (enemiesAlive && newState.phase !== 'victory' && newState.phase !== 'defeat') {
        newState = processEnemyTurns(newState);
      }

      setCombat(newState);
      setProcessing(false);

      if (newState.phase === 'victory') {
        addScore(newState.battleRewards.exp);
        addGold(newState.battleRewards.gold);
        newState.battleRewards.items.forEach((inv) => addItem(inv.itemId, inv.quantity));
        newState.party.forEach((member, i) => updatePartyMember(i, member));
        setTimeout(() => router.back(), 1200);
      }
    },
    [combat, processing, addScore, addGold, updatePartyMember, addItem, processEnemyTurns],
  );

  const requestTargetSelection = useCallback((action: string) => {
    setPendingAction(action);
    setSelectingTarget(true);
  }, []);

  const selectTarget = useCallback(
    (targetIndex: number) => {
      if (pendingAction) {
        handleAction(pendingAction, targetIndex);
      }
    },
    [pendingAction, handleAction],
  );

  const cancelTargetSelection = useCallback(() => {
    setSelectingTarget(false);
    setPendingAction(null);
  }, []);

  if (!combat) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const isVictory = combat.phase === 'victory';
  const isDefeat = combat.phase === 'defeat';
  const isPlayerTurn = combat.phase === 'player' && !processing;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Panel style={styles.section}>
          <Text style={styles.sectionTitle}>Enemies</Text>
          {combat.enemies.map((enemy, i) => (
            <TouchableOpacity
              key={enemy.id}
              style={selectingTarget ? styles.targetable : styles.entityRow}
              onPress={() => selectingTarget && selectTarget(i)}
              disabled={!selectingTarget}
              activeOpacity={selectingTarget ? 0.5 : 1}
            >
              <View style={styles.enemyHeader}>
                <Text style={styles.entityName}>{enemy.name}</Text>
                {enemy.sprite ? (
                  <Text style={styles.spriteText}>{enemy.sprite}</Text>
                ) : null}
              </View>
              <StatBar
                value={enemy.hp}
                maxValue={enemy.maxHp}
                color={colors.hpRed}
                height={8}
                label={'HP'}
                showText
              />
            </TouchableOpacity>
          ))}
        </Panel>

        <Panel style={styles.logPanel}>
          <ScrollView style={styles.logScroll} nestedScrollEnabled>
            {combat.log.map((entry, i) => (
              <Text key={i} style={styles.logEntry}>
                {entry}
              </Text>
            ))}
          </ScrollView>
        </Panel>

        <Panel style={styles.section}>
          <Text style={styles.sectionTitle}>Party</Text>
          {combat.party.map((member, i) => (
            <View key={i} style={styles.entityRow}>
              <Text style={styles.entityName}>{member.name}</Text>
              <View style={styles.barsContainer}>
                <StatBar
                  value={member.hp}
                  maxValue={member.maxHp}
                  color={colors.hpRed}
                  height={6}
                  label={'HP'}
                  showText
                />
                <View style={styles.barSpacer} />
                <StatBar
                  value={member.mp}
                  maxValue={member.maxMp}
                  color={colors.mpBlue}
                  height={6}
                  label={'MP'}
                  showText
                />
              </View>
            </View>
          ))}
        </Panel>

        {isPlayerTurn && (
          <View style={styles.actionsContainer}>
            {selectingTarget ? (
              <View style={styles.submenu}>
                <Text style={styles.submenuLabel}>Select a target</Text>
                <Button
                  title="Cancel"
                  onPress={cancelTargetSelection}
                  variant="secondary"
                />
              </View>
            ) : submenu === 'skills' && currentCharacter ? (
              <View style={styles.submenu}>
                <Text style={styles.submenuLabel}>
                  {currentCharacter.name} — Skills
                </Text>
                {currentCharacter.skills.map((skill) => (
                  <Button
                    key={skill.id}
                    title={`${skill.name} (${skill.mpCost} MP)`}
                    onPress={() => requestTargetSelection(`skill_${skill.id}`)}
                    variant="secondary"
                    disabled={currentCharacter.mp < skill.mpCost}
                  />
                ))}
                <Button
                  title="Back"
                  onPress={() => setSubmenu(null)}
                  variant="secondary"
                />
              </View>
            ) : submenu === 'items' ? (
              <View style={styles.submenu}>
                <Text style={styles.submenuLabel}>Items</Text>
                {inventory.map((inv, i) => {
                  const item = itemData[inv.itemId];
                  return (
                    <Button
                      key={inv.itemId}
                      title={`${item?.name || inv.itemId} x${inv.quantity}`}
                      onPress={() => handleAction(`item_${inv.itemId}`)}
                      variant="secondary"
                    />
                  );
                })}
                {inventory.length === 0 && (
                  <Text style={styles.emptyText}>No items available</Text>
                )}
                <Button
                  title="Back"
                  onPress={() => setSubmenu(null)}
                  variant="secondary"
                />
              </View>
            ) : (
              <View style={styles.actionRow}>
                <Button
                  title="Attack"
                  onPress={() => requestTargetSelection('attack')}
                  variant="primary"
                />
                <Button
                  title="Skill"
                  onPress={() => setSubmenu('skills')}
                  variant="primary"
                />
                <Button
                  title="Item"
                  onPress={() => setSubmenu('items')}
                  variant="primary"
                />
                <Button
                  title="Defend"
                  onPress={() => handleAction('defend')}
                  variant="secondary"
                />
                <Button
                  title="Flee"
                  onPress={() => handleAction('flee')}
                  variant="secondary"
                />
              </View>
            )}
          </View>
        )}

        {isVictory && (
          <Panel style={styles.overlay}>
            <Text style={styles.overlayTitle}>VICTORY!</Text>
            <Text style={styles.rewardLine}>
              EXP: +{combat.battleRewards.exp}
            </Text>
            <Text style={styles.rewardLine}>
              Gold: +{combat.battleRewards.gold}
            </Text>
          </Panel>
        )}

        {isDefeat && (
          <Panel style={styles.overlay}>
            <Text style={[styles.overlayTitle, { color: colors.error }]}>
              GAME OVER
            </Text>
            <Button
              title="Return to Title"
              onPress={() => router.replace('/')}
              variant="primary"
            />
          </Panel>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.gutter,
    gap: spacing.vStack,
    paddingBottom: spacing.safeAreaBottom,
  },
  section: {},
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.primary,
    marginBottom: spacing.vStack,
  },
  entityRow: {
    marginBottom: spacing.vStack,
  },
  entityName: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
  enemyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  spriteText: {
    ...typography.bodyLg,
  },
  targetable: {
    marginBottom: spacing.vStack,
    borderWidth: 2,
    borderColor: colors.error,
    borderRadius: radius.md,
    padding: spacing.gutter,
    backgroundColor: colors.errorContainer,
  },
  barsContainer: {},
  barSpacer: {
    height: 4,
  },
  logPanel: {
    maxHeight: 160,
  },
  logScroll: {
    maxHeight: 120,
  },
  logEntry: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  actionsContainer: {
    marginTop: spacing.vStack,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gutter,
  },
  submenu: {
    gap: spacing.gutter,
  },
  submenuLabel: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.gutter,
  },
  emptyText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  overlay: {
    marginTop: spacing.vStack,
    alignItems: 'center',
    padding: spacing.panelPadding,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  overlayTitle: {
    ...typography.headlineLg,
    color: colors.expGreen,
    marginBottom: spacing.vStack,
  },
  rewardLine: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
});
