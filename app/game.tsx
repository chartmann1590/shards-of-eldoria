import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/engine/store';
import { maps } from '../src/data/maps';
import { tryMove } from '../src/engine/movement';
import { dialogues } from '../src/data/dialogue';
import { TileMap } from '../src/ui/TileMap';
import { DPad } from '../src/ui/DPad';
import { DialogueBox } from '../src/ui/DialogueBox';
import { Panel } from '../src/ui/Panel';
import { colors, typography, spacing } from '../src/theme';
import { createLyra, createBrann } from '../src/data/party';
import type { Direction, DialogueNode } from '../src/engine/types';

export default function GameScreen() {
  const currentMap = useGameStore((s) => s.currentMap);
  const playerX = useGameStore((s) => s.playerX);
  const playerY = useGameStore((s) => s.playerY);
  const playerDirection = useGameStore((s) => s.playerDirection);
  const gold = useGameStore((s) => s.gold);
  const flags = useGameStore((s) => s.flags);
  const store = useGameStore.getState();

  const [dialogueActive, setDialogueActive] = useState(false);
  const [dialogueTree, setDialogueTree] = useState<DialogueNode[] | null>(null);
  const [dialogueNode, setDialogueNode] = useState<DialogueNode | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const moveLockRef = useRef(false);

  const mapData = maps[currentMap];

  useEffect(() => {
    if (!mapData) {
      router.replace('/');
    }
  }, [mapData]);

  const showMessage = useCallback((msg: string, duration = 1500) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);

  const startDialogue = useCallback((dialogueId: string) => {
    const tree = dialogues[dialogueId];
    if (!tree || tree.length === 0) return;
    setDialogueTree(tree);
    setDialogueNode(tree[0]);
    setDialogueActive(true);
  }, []);

  const advanceDialogue = useCallback((choiceIdx?: number) => {
    if (!dialogueNode || !dialogueTree) {
      setDialogueActive(false);
      return;
    }

    let nextId: string | null = null;
    if (dialogueNode.choices && choiceIdx !== undefined) {
      nextId = dialogueNode.choices[choiceIdx]?.nextId ?? null;
    } else {
      nextId = dialogueNode.nextId ?? null;
    }

    if (!nextId) {
      if (dialogueNode.action) {
        handleDialogueAction(dialogueNode.action);
      }
      setDialogueActive(false);
      setDialogueTree(null);
      setDialogueNode(null);
      return;
    }

    const nextNode = dialogueTree.find((n) => n.id === nextId);
    if (nextNode) {
      if (dialogueNode.action) {
        handleDialogueAction(dialogueNode.action);
      }
      setDialogueNode(nextNode);
    } else {
      setDialogueActive(false);
      setDialogueTree(null);
      setDialogueNode(null);
    }
  }, [dialogueNode, dialogueTree]);

  const handleDialogueAction = useCallback((action: { type: string; data?: string }) => {
    const s = useGameStore.getState();
    if (action.type === 'setFlag' && action.data) {
      s.setFlag(action.data);
    } else if (action.type === 'recruit' && action.data) {
      let member;
      if (action.data === 'lyra') member = createLyra();
      else if (action.data === 'brann') member = createBrann();
      if (member) {
        s.addPartyMember(member);
        s.setFlag('recruited_' + action.data);
        showMessage(`${member.name} joined the party!`);
      }
    } else if (action.type === 'addItem' && action.data) {
      s.addItem(action.data);
    } else if (action.type === 'buyItem' && action.data) {
      const { items } = require('../src/data/items');
      const item = items[action.data];
      if (item && s.gold >= item.price) {
        s.spendGold(item.price);
        s.addItem(action.data);
        showMessage(`Bought ${item.name}!`);
      } else {
        showMessage('Not enough gold!');
      }
    }
  }, [showMessage]);

  const checkAdjacentNPC = useCallback(() => {
    if (!mapData?.npcs) return null;
    const dirOffsets: Record<string, [number, number]> = {
      up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0],
    };
    const dir = useGameStore.getState().playerDirection;
    const off = dirOffsets[dir];
    if (!off) return null;
    const nx = playerX + off[0];
    const ny = playerY + off[1];
    return mapData.npcs.find((npc) => npc.x === nx && npc.y === ny) || null;
  }, [mapData, playerX, playerY]);

  const handleAction = useCallback(() => {
    if (dialogueActive) {
      advanceDialogue();
      return;
    }
    const npc = checkAdjacentNPC();
    if (npc) {
      startDialogue(npc.dialogue);
    }
  }, [dialogueActive, advanceDialogue, checkAdjacentNPC, startDialogue]);

  const checkEvents = useCallback((x: number, y: number) => {
    if (!mapData?.events) return;
    for (const event of mapData.events) {
      if (event.x !== x || event.y !== y) continue;
      if (event.once && flags[event.flag || event.id]) continue;
      const s = useGameStore.getState();

      if (event.type === 'boss' && event.data) {
        s.setFlag(event.flag || event.id);
        router.navigate({
          pathname: '/battle',
          params: { enemies: JSON.stringify([event.data]) },
        });
        return;
      }

      if (event.type === 'chest' && event.data) {
        const { items } = require('../src/data/items');
        const item = items[event.data];
        s.addItem(event.data);
        s.setFlag(event.flag || event.id);
        s.addScore(100);
        showMessage(`Found ${item?.name || 'an item'}!`);
        return;
      }

      if (event.type === 'recruit' && event.data) {
        startDialogue(event.data + '_recruit');
        s.setFlag(event.flag || event.id);
        return;
      }

      if (event.type === 'shard') {
        s.addItem(event.data || 'red_shard');
        s.setFlag(event.flag || event.id);
        s.addScore(500);
        startDialogue('shard_' + (event.data || 'red').replace('_shard', ''));
        return;
      }

      if (event.type === 'dialogue' && event.data) {
        startDialogue(event.data);
        return;
      }
    }
  }, [mapData, flags, showMessage, startDialogue]);

  const handleMove = useCallback((direction: Direction) => {
    if (dialogueActive || moveLockRef.current || !mapData) return;

    const s = useGameStore.getState();
    s.setPosition(s.playerX, s.playerY, s.currentMap, direction);

    moveLockRef.current = true;
    setTimeout(() => { moveLockRef.current = false; }, 150);

    const result = tryMove(direction, playerX, playerY, mapData);

    if (!result.moved) return;

    s.setPosition(result.newX, result.newY, currentMap);

    if (result.transitionTo) {
      s.setPosition(
        result.transitionTo.targetX,
        result.transitionTo.targetY,
        result.transitionTo.targetMap,
      );
      return;
    }

    if (result.encounterTriggered && mapData.possibleEnemies.length > 0) {
      const enemyId = mapData.possibleEnemies[Math.floor(Math.random() * mapData.possibleEnemies.length)];
      router.navigate({
        pathname: '/battle',
        params: { enemies: JSON.stringify([enemyId]) },
      });
      return;
    }

    checkEvents(result.newX, result.newY);
  }, [dialogueActive, mapData, playerX, playerY, currentMap, checkEvents]);

  if (!mapData) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.mapName}>{mapData.name}</Text>
        <View style={styles.topRight}>
          <View style={styles.goldContainer}>
            <Text style={styles.goldIcon}>{'\u25CF'}</Text>
            <Text style={styles.goldText}>{gold}</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.navigate('/menu')}>
            <Text style={styles.menuIcon}>{'\u2630'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <TileMap
          tiles={mapData.tiles}
          playerX={playerX}
          playerY={playerY}
        />
      </View>

      {message && (
        <View style={styles.messageOverlay} pointerEvents="none">
          <Panel>
            <Text style={styles.messageText}>{message}</Text>
          </Panel>
        </View>
      )}

      <View style={styles.controls}>
        <DPad onMove={handleMove} onA={handleAction} />
      </View>

      {dialogueActive && dialogueNode && (
        <View style={styles.dialogueOverlay}>
          <DialogueBox
            visible={true}
            speaker={dialogueNode.speaker}
            text={dialogueNode.text}
            choices={dialogueNode.choices?.map((c, i) => ({ id: String(i), label: c.text }))}
            onAdvance={() => advanceDialogue()}
            onSelectChoice={(choiceId: string) => advanceDialogue(parseInt(choiceId, 10))}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.gutter, paddingVertical: 8,
    backgroundColor: colors.surfaceContainer, borderBottomWidth: 2,
    borderBottomColor: colors.primaryContainer,
  },
  mapName: { ...typography.headlineMd, color: colors.primary },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.gutter },
  goldContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  goldIcon: { color: colors.primary, fontSize: 14 },
  goldText: { ...typography.statSm, color: colors.primary },
  menuButton: { padding: 8 },
  menuIcon: { color: colors.onSurface, fontSize: 22 },
  mapContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  controls: { paddingVertical: spacing.gutter, alignItems: 'center' },
  messageOverlay: {
    position: 'absolute', top: '45%', left: '50%',
    transform: [{ translateX: -150 }], width: 300, zIndex: 10,
  },
  messageText: {
    ...typography.bodyMd, color: colors.onSurface, textAlign: 'center', paddingVertical: 8,
  },
  dialogueOverlay: {
    position: 'absolute', bottom: 160, left: spacing.gutter, right: spacing.gutter, zIndex: 20,
  },
});
