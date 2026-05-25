export const SCORE_EVENTS = {
  ENEMY_DEFEATED: 10,
  BOSS_DEFEATED: 50,
  GOLD_PER_POINT: 5,
  SECRET_CHEST: 100,
  SHARD_FOUND: 500,
} as const;

export function calculateTotalScore(
  enemiesDefeated: number,
  bossesDefeated: number,
  goldEarned: number,
  chestsOpened: number,
  shardsFound: number,
): number {
  return (
    enemiesDefeated * SCORE_EVENTS.ENEMY_DEFEATED +
    bossesDefeated * SCORE_EVENTS.BOSS_DEFEATED +
    Math.floor(goldEarned / SCORE_EVENTS.GOLD_PER_POINT) +
    chestsOpened * SCORE_EVENTS.SECRET_CHEST +
    shardsFound * SCORE_EVENTS.SHARD_FOUND
  );
}
