import type { DialogueNode } from '../../engine/types';

const kingQuest: DialogueNode[] = [
  { id: 'start', speaker: 'King Aldric', text: 'Sir Kael! The Shadow Lord Malgrith has stolen the three Crystal Shards that protect our kingdom.', nextId: 'quest2' },
  { id: 'quest2', speaker: 'King Aldric', text: 'Without them, Eldoria will fall into darkness. You must recover them before it is too late.', nextId: 'quest3' },
  { id: 'quest3', speaker: 'King Aldric', text: 'Seek the shards in the Whispering Forest, the Old Crypt, and Malgrith\'s Fortress. Take gold for supplies.', nextId: 'quest4' },
  { id: 'quest4', speaker: 'Sir Kael', text: 'I will not fail you, my King. I shall return with all three shards.', nextId: null, action: { type: 'setFlag', data: 'got_quest' } },
];

const shop: DialogueNode[] = [
  { id: 'start', speaker: 'Shopkeeper', text: 'Welcome to my shop! What can I get for you?', choices: [
    { text: 'Buy Health Potion (25g)', nextId: 'buy_hp' },
    { text: 'Buy Mana Potion (30g)', nextId: 'buy_mp' },
    { text: 'Leave', nextId: null },
  ]},
  { id: 'buy_hp', speaker: 'Shopkeeper', text: 'A wise choice for any adventurer!', nextId: null, action: { type: 'buyItem', data: 'health_potion' } },
  { id: 'buy_mp', speaker: 'Shopkeeper', text: 'Magic users always need these!', nextId: null, action: { type: 'buyItem', data: 'mana_potion' } },
];

const tutorial: DialogueNode[] = [
  { id: 'start', speaker: 'Villager', text: 'New adventurer, eh? Let me show you around. Use the D-pad to move around the map.', nextId: 'tut2' },
  { id: 'tut2', speaker: 'Villager', text: 'Press the A button to interact with people and objects. B button opens the menu.', nextId: 'tut3' },
  { id: 'tut3', speaker: 'Villager', text: 'Watch out in the forest - enemies lurk in the tall grass! You can save your progress from the menu.', nextId: null, action: { type: 'setFlag', data: 'tutorial_done' } },
];

const forestHint: DialogueNode[] = [
  { id: 'start', speaker: 'Traveler', text: 'I hear the Goblin Chief holds a Crystal Shard deep in the forest. Be careful - he\'s tougher than he looks!', nextId: null },
];

const lyraRecruit: DialogueNode[] = [
  { id: 'start', speaker: 'Lyra', text: 'You\'re heading after Malgrith? I\'ve been studying his dark magic for months.', nextId: 'lyra2' },
  { id: 'lyra2', speaker: 'Lyra', text: 'My fire magic could be useful against his shadow forces. Let me join you!', choices: [
    { text: 'Welcome aboard!', nextId: 'lyra_join' },
    { text: 'I work alone... fine, come along.', nextId: 'lyra_join' },
  ]},
  { id: 'lyra_join', speaker: 'Lyra', text: 'Excellent! Together, we\'ll stop Malgrith. My Fireball spell will make short work of his minions.', nextId: null, action: { type: 'recruit', data: 'lyra' } },
];

const brannRecruit: DialogueNode[] = [
  { id: 'start', speaker: 'Brann', text: 'The shrine\'s healing powers have protected this forest for centuries. But Malgrith\'s darkness grows stronger.', nextId: 'brann2' },
  { id: 'brann2', speaker: 'Brann', text: 'I can heal your wounds in battle. You\'ll need a healer if you\'re going to face the Shadow Lord.', nextId: 'brann3' },
  { id: 'brann3', speaker: 'Brann', text: 'Allow me to accompany you. My healing arts will keep your party standing.', nextId: null, action: { type: 'recruit', data: 'brann' } },
];

const wraithLordTaunt: DialogueNode[] = [
  { id: 'start', speaker: 'Wraith Lord', text: 'Foolish mortal... you dare enter my domain? The darkness shall consume you!', nextId: null },
];

const malgrithTaunt: DialogueNode[] = [
  { id: 'start', speaker: 'Malgrith', text: 'So, the legendary Sir Kael has come at last. Did you really think you could stop me?', nextId: 'mal2' },
  { id: 'mal2', speaker: 'Malgrith', text: 'The Crystal Shards belong to me now. With their power, I will reshape this world in shadow!', nextId: null },
];

const victory: DialogueNode[] = [
  { id: 'start', speaker: 'Narrator', text: 'With Malgrith defeated, the three Crystal Shards begin to glow with renewed power.', nextId: 'vic2' },
  { id: 'vic2', speaker: 'Narrator', text: 'Sir Kael returns to the Kingdom of Eldoria, the shards restored to their rightful place.', nextId: 'vic3' },
  { id: 'vic3', speaker: 'King Aldric', text: 'You have saved Eldoria, Sir Kael! The kingdom is in your debt. Peace has returned at last.', nextId: 'vic4' },
  { id: 'vic4', speaker: 'Narrator', text: 'But adventure never truly ends... The shards whisper of greater challenges yet to come.', nextId: null },
];

const shardRed: DialogueNode[] = [
  { id: 'start', speaker: 'Narrator', text: 'You found the Red Crystal Shard! One of three shards has been recovered.', nextId: null, action: { type: 'addItem', data: 'red_shard' } },
];

const shardBlue: DialogueNode[] = [
  { id: 'start', speaker: 'Narrator', text: 'You found the Blue Crystal Shard! Two shards recovered. One remains...', nextId: null, action: { type: 'addItem', data: 'blue_shard' } },
];

const shardGreen: DialogueNode[] = [
  { id: 'start', speaker: 'Narrator', text: 'You found the Green Crystal Shard! All three shards are recovered!', nextId: null, action: { type: 'addItem', data: 'green_shard' } },
];

export const dialogues: Record<string, DialogueNode[]> = {
  king_quest: kingQuest,
  shop,
  tutorial,
  forest_hint: forestHint,
  lyra_recruit: lyraRecruit,
  brann_recruit: brannRecruit,
  wraith_lord_taunt: wraithLordTaunt,
  malgrith_taunt: malgrithTaunt,
  victory,
  shard_red: shardRed,
  shard_blue: shardBlue,
  shard_green: shardGreen,
};
