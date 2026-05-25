import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import { Panel } from './Panel';
import { StatBar } from './StatBar';
import { Button } from './Button';
import { Sprite } from './Sprite';

export interface CombatActor {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  sprite: string;
  isEnemy?: boolean;
}

export interface CombatState {
  actors: CombatActor[];
  partyIds: string[];
  enemyIds: string[];
  currentTurnId: string;
  phase: 'selectAction' | 'selectTarget' | 'animating' | 'victory' | 'defeat';
  log: string[];
}

interface BattleSceneProps {
  combatState: CombatState;
  onAction: (action: string) => void;
  onTargetSelect: (targetId: string) => void;
}

const ACTIONS = ['Attack', 'Skill', 'Item', 'Defend', 'Flee'] as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  enemyArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enemyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: spacing.vStack,
  },
  enemyCard: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  enemyName: {
    ...typography.bodySm,
    color: colors.onSurface,
    marginTop: 4,
  },
  partyArea: {
    padding: spacing.gutter,
  },
  partyMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  partyName: {
    ...typography.bodyMd,
    color: colors.onSurface,
    width: 80,
  },
  bars: {
    flex: 1,
    marginLeft: 8,
  },
  actionsArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.gutter,
  },
  targetItem: {
    paddingHorizontal: spacing.gutter,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  logArea: {
    maxHeight: 80,
    paddingHorizontal: spacing.gutter,
    paddingVertical: 4,
  },
  logText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  phaseLabel: {
    ...typography.labelCaps,
    color: colors.primaryContainer,
    textAlign: 'center',
    paddingVertical: 4,
  },
  victoryText: {
    ...typography.headlineLg,
    color: colors.primaryContainer,
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export function BattleScene({
  combatState,
  onAction,
  onTargetSelect,
}: BattleSceneProps) {
  const {
    actors,
    partyIds,
    enemyIds,
    currentTurnId,
    phase,
    log,
  } = combatState;

  const enemies = actors.filter((a) => a.isEnemy && a.hp > 0);
  const party = actors.filter((a) => !a.isEnemy);

  return (
    <View style={styles.container}>
      <View style={styles.enemyArea}>
        <View style={styles.enemyRow}>
          {enemies.map((enemy) => (
            <View key={enemy.id} style={styles.enemyCard}>
              <Sprite sprite={enemy.sprite} width={64} height={64} />
              <Text style={styles.enemyName}>{enemy.name}</Text>
              <StatBar
                value={enemy.hp}
                maxValue={enemy.maxHp}
                color={colors.hpRed}
                showText
              />
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.logArea}>
        {log.map((entry, i) => (
          <Text key={i} style={styles.logText}>
            {entry}
          </Text>
        ))}
      </ScrollView>

      <Panel style={styles.partyArea}>
        {party.map((member) => (
          <View key={member.id} style={styles.partyMemberRow}>
            <Text style={styles.partyName}>{member.name}</Text>
            <View style={styles.bars}>
              <StatBar
                value={member.hp}
                maxValue={member.maxHp}
                color={colors.hpRed}
                label="HP"
                showText
                height={5}
              />
              <StatBar
                value={member.mp}
                maxValue={member.maxMp}
                color={colors.mpBlue}
                label="MP"
                showText
                height={5}
              />
            </View>
          </View>
        ))}
      </Panel>

      {phase === 'selectAction' && (
        <View style={styles.actionsArea}>
          {ACTIONS.map((action) => (
            <Button
              key={action}
              title={action}
              variant="secondary"
              onPress={() => onAction(action.toLowerCase())}
            />
          ))}
        </View>
      )}

      {phase === 'selectTarget' && (
        <Panel>
          <Text style={styles.phaseLabel}>SELECT TARGET</Text>
          {enemies.map((enemy) => (
            <View key={enemy.id} style={styles.targetItem}>
              <Button
                title={`${enemy.name} - ${enemy.hp}/${enemy.maxHp}`}
                variant="secondary"
                onPress={() => onTargetSelect(enemy.id)}
              />
            </View>
          ))}
        </Panel>
      )}

      {phase === 'victory' && (
        <Text style={styles.victoryText}>VICTORY!</Text>
      )}

      {phase === 'defeat' && (
        <Text style={[styles.victoryText, { color: colors.error }]}>
          DEFEAT...
        </Text>
      )}
    </View>
  );
}
