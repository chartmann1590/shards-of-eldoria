export const STORY_FLAGS = {
  TUTORIAL_DONE: 'tutorial_done',
  GOT_QUEST: 'got_quest',
  RECRUITED_LYRA: 'recruited_lyra',
  RED_SHARD: 'red_shard_found',
  RECRUITED_BRANN: 'recruited_brann',
  BLUE_SHARD: 'blue_shard_found',
  GREEN_SHARD: 'green_shard_found',
  GOBLIN_CHIEF_DEFEATED: 'goblin_chief_defeated',
  WRAITH_LORD_DEFEATED: 'wraith_lord_defeated',
  MALGRITH_DEFEATED: 'malgrith_defeated',
  FINAL_BOSS_DEFEATED: 'final_boss_defeated',
} as const;

export function getChapter(flags: Record<string, boolean>): string {
  if (flags[STORY_FLAGS.MALGRITH_DEFEATED]) return 'The Kingdom Restored';
  if (flags[STORY_FLAGS.GREEN_SHARD]) return 'The Final Battle';
  if (flags[STORY_FLAGS.BLUE_SHARD]) return 'Storming the Fortress';
  if (flags[STORY_FLAGS.RED_SHARD]) return 'Into the Depths';
  if (flags[STORY_FLAGS.GOT_QUEST]) return 'The Stolen Shards';
  return 'The Stolen Shards';
}

export function getNextObjective(flags: Record<string, boolean>): string {
  if (flags[STORY_FLAGS.MALGRITH_DEFEATED]) return 'Return to the King with the Crystal Shards';
  if (flags[STORY_FLAGS.GREEN_SHARD]) return 'Defeat Malgrith in the throne room';
  if (flags[STORY_FLAGS.BLUE_SHARD]) return 'Enter Malgrith\'s Fortress and find the Green Shard';
  if (flags[STORY_FLAGS.RED_SHARD]) return 'Explore the Old Crypt to find the Blue Shard';
  if (flags[STORY_FLAGS.GOT_QUEST]) return 'Head north to the Whispering Forest';
  return 'Speak to the King in Aerwyn';
}
