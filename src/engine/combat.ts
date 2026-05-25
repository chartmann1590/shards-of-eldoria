import { produce } from 'immer';
import type { CharacterStats, Enemy, Skill, CombatState } from './types';
import { enemies as enemyData } from '../data/enemies';

export function rollTurnOrder(
  party: CharacterStats[],
  enemies: Enemy[],
): (CharacterStats | Enemy)[] {
  const all: (CharacterStats | Enemy)[] = [
    ...party.filter((p) => p.isAlive),
    ...enemies.filter((e) => e.hp > 0),
  ];
  return all.sort((a, b) => b.spd - a.spd);
}

export function calculateDamage(
  attacker: { atk: number },
  skill: Skill | null,
  defender: { def: number },
): number {
  const variance = Math.floor(Math.random() * 5) - 2;
  const base = attacker.atk + (skill ? skill.power : 0) - defender.def + variance;
  return Math.max(1, base);
}

export function applyAction(
  state: CombatState,
  action: string,
  targetIndex: number,
): CombatState {
  return produce(state, (draft) => {
    const currentActor = draft.turnOrder[draft.currentTurnIndex];

    if (!currentActor) return;

    if ('skills' in currentActor && 'isAlive' in currentActor) {
      const actor = currentActor as CharacterStats;
      if (!actor.isAlive) return;

      if (action === 'attack') {
        const target = draft.enemies[targetIndex];
        if (!target || target.hp <= 0) return;

        const dmg = calculateDamage(actor, null, target);
        target.hp = Math.max(0, target.hp - dmg);
        draft.log.push(actor.name + ' attacks ' + target.name + ' for ' + dmg + ' damage!');

        if (target.hp <= 0) {
          draft.log.push(target.name + ' was defeated!');
        }
      } else if (action.startsWith('skill_')) {
        const skillId = action.replace('skill_', '');
        const skill = actor.skills.find((s) => s.id === skillId);
        if (!skill || actor.mp < skill.mpCost) return;

        actor.mp -= skill.mpCost;

        if (skill.type === 'heal') {
          if (skill.target === 'self') {
            const healAmt = skill.power;
            actor.hp = Math.min(actor.maxHp, actor.hp + healAmt);
            draft.log.push(actor.name + ' uses ' + skill.name + ' and heals for ' + healAmt + ' HP!');
          } else {
            const target = draft.party[targetIndex];
            if (!target || !target.isAlive) return;
            const healAmt = skill.power;
            target.hp = Math.min(target.maxHp, target.hp + healAmt);
            draft.log.push(actor.name + ' uses ' + skill.name + ' on ' + target.name + ' for ' + healAmt + ' HP!');
          }
        } else if (skill.target === 'all') {
          for (const enemy of draft.enemies) {
            if (enemy.hp <= 0) continue;
            const dmg = calculateDamage(actor, skill, enemy);
            enemy.hp = Math.max(0, enemy.hp - dmg);
            draft.log.push(actor.name + ' uses ' + skill.name + ' on ' + enemy.name + ' for ' + dmg + ' damage!');
            if (enemy.hp <= 0) {
              draft.log.push(enemy.name + ' was defeated!');
            }
          }
        } else {
          const target = draft.enemies[targetIndex];
          if (!target || target.hp <= 0) return;
          const dmg = calculateDamage(actor, skill, target);
          target.hp = Math.max(0, target.hp - dmg);
          draft.log.push(actor.name + ' uses ' + skill.name + ' on ' + target.name + ' for ' + dmg + ' damage!');
          if (target.hp <= 0) {
            draft.log.push(target.name + ' was defeated!');
          }
        }
      } else if (action === 'defend') {
        draft.log.push(actor.name + ' takes a defensive stance!');
      }
    }

    const endStatus = checkBattleEnd(draft as CombatState);
    if (endStatus === 'victory') {
      (draft as CombatState).phase = 'victory';
      const rewards = generateBattleRewards(draft.enemies);
      draft.battleRewards.exp = rewards.exp;
      draft.battleRewards.gold = rewards.gold;
    } else if (endStatus === 'defeat') {
      (draft as CombatState).phase = 'defeat';
    } else {
      draft.currentTurnIndex += 1;
      if (draft.currentTurnIndex >= draft.turnOrder.length) {
        draft.currentTurnIndex = 0;
      }
      const nextActor = draft.turnOrder[draft.currentTurnIndex];
      if (nextActor && 'isBoss' in nextActor) {
        draft.phase = 'enemy';
      } else {
        draft.phase = 'player';
      }
    }

    draft.selectedAction = null;
    draft.selectedTarget = -1;
  });
}

export function executeEnemyTurn(state: CombatState): CombatState {
  return produce(state, (draft) => {
    const enemy = draft.turnOrder[draft.currentTurnIndex] as Enemy;
    if (!enemy || enemy.hp <= 0) return;

    const aliveParty = draft.party.filter((p) => p.isAlive);
    if (aliveParty.length === 0) return;

    let targetIdx: number;
    if (enemy.isBoss) {
      const sortedByHp = [...aliveParty].sort((a, b) => a.hp - b.hp);
      const weakest = sortedByHp[0];
      targetIdx = draft.party.findIndex((p) => p.id === weakest.id);
    } else {
      targetIdx = draft.party.findIndex(
        (p) => p.id === aliveParty[Math.floor(Math.random() * aliveParty.length)].id,
      );
    }

    const target = draft.party[targetIdx];
    if (!target || !target.isAlive) return;

    const skill =
      enemy.skills.length > 0 && Math.random() < 0.4
        ? enemy.skills[Math.floor(Math.random() * enemy.skills.length)]
        : null;

    const dmg = calculateDamage(enemy, skill, target);
    target.hp = Math.max(0, target.hp - dmg);

    if (skill) {
      draft.log.push(enemy.name + ' uses ' + skill.name + ' on ' + target.name + ' for ' + dmg + ' damage!');
    } else {
      draft.log.push(enemy.name + ' attacks ' + target.name + ' for ' + dmg + ' damage!');
    }

    if (target.hp <= 0) {
      target.isAlive = false;
      draft.log.push(target.name + ' has fallen!');
    }

    const endStatus = checkBattleEnd(draft as CombatState);
    if (endStatus === 'victory') {
      (draft as CombatState).phase = 'victory';
      const rewards = generateBattleRewards(draft.enemies);
      draft.battleRewards.exp = rewards.exp;
      draft.battleRewards.gold = rewards.gold;
    } else if (endStatus === 'defeat') {
      (draft as CombatState).phase = 'defeat';
    } else {
      draft.currentTurnIndex += 1;
      if (draft.currentTurnIndex >= draft.turnOrder.length) {
        draft.currentTurnIndex = 0;
      }
      const nextActor = draft.turnOrder[draft.currentTurnIndex];
      if (nextActor && 'isBoss' in nextActor) {
        draft.phase = 'enemy';
      } else {
        draft.phase = 'player';
      }
    }
  });
}

export function checkBattleEnd(state: CombatState): 'ongoing' | 'victory' | 'defeat' {
  const allPartyDead = state.party.every((p) => !p.isAlive);
  if (allPartyDead) return 'defeat';

  const allEnemiesDead = state.enemies.every((e) => e.hp <= 0);
  if (allEnemiesDead) return 'victory';

  return 'ongoing';
}

export function generateBattleRewards(
  enemies: Enemy[],
): { exp: number; gold: number } {
  let exp = 0;
  let gold = 0;
  for (const e of enemies) {
    exp += e.exp;
    gold += e.gold;
  }
  return { exp, gold };
}

export function initCombat(
  party: CharacterStats[],
  enemyIds: string[],
): CombatState {
  const resolvedEnemies: Enemy[] = enemyIds
    .map((id) => enemyData[id])
    .filter((e): e is Enemy => e !== undefined);

  const turnOrder = rollTurnOrder(party, resolvedEnemies);

  return {
    party: structuredClone(party),
    enemies: resolvedEnemies.map((e) => ({ ...e })),
    turnOrder,
    currentTurnIndex: 0,
    log: ['Battle begins!'],
    phase: turnOrder[0] && 'isBoss' in turnOrder[0] ? 'enemy' : 'player',
    selectedAction: null,
    selectedTarget: -1,
    battleRewards: { exp: 0, gold: 0, items: [] },
  };
}

export function checkLevelUp(member: CharacterStats): CharacterStats {
  return produce(member, (draft) => {
    while (draft.exp >= draft.expToNext) {
      draft.exp -= draft.expToNext;
      draft.level += 1;
      draft.maxHp += 10;
      draft.maxMp += 5;
      draft.atk += 2;
      draft.def += 1;
      draft.spd += 1;
      draft.hp = draft.maxHp;
      draft.mp = draft.maxMp;
      draft.expToNext = draft.level * draft.level * 50;
    }
  });
}
