import type { DialogueNode } from './types';

const dialogues: Record<string, DialogueNode[]> = {};

export function startDialogue(dialogueId: string): DialogueNode {
  const nodes = dialogues[dialogueId];
  if (!nodes || nodes.length === 0) {
    return {
      id: 'error',
      speaker: 'System',
      text: '...',
      nextId: null,
    };
  }
  return nodes[0];
}

export function advanceDialogue(
  currentId: string,
  dialogueId: string,
  choiceIndex?: number,
): DialogueNode | null {
  const nodes = dialogues[dialogueId];
  if (!nodes) return null;

  const currentNode = nodes.find((n) => n.id === currentId);
  if (!currentNode) return null;

  let nextId: string | null | undefined;

  if (currentNode.choices && choiceIndex !== undefined && choiceIndex < currentNode.choices.length) {
    nextId = currentNode.choices[choiceIndex].nextId;
  } else {
    nextId = currentNode.nextId;
  }

  if (nextId === null || nextId === undefined) return null;

  return nodes.find((n) => n.id === nextId) ?? null;
}

export function getNode(
  dialogueId: string,
  nodeId: string,
): DialogueNode | undefined {
  const nodes = dialogues[dialogueId];
  if (!nodes) return undefined;
  return nodes.find((n) => n.id === nodeId);
}
