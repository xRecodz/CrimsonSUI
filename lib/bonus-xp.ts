import { BONUS_QUEST } from './quest-engine';

/** Bonus XP at exactly the minimum stake (e.g. 10 DFQ). */
export const BONUS_XP_BASE = 1000;

/** Default XP per 1 DFQ staked above the minimum (until cap). */
export const DEFAULT_BONUS_XP_PER_DFQ = 50;

/** Default max DFQ counted toward scaling (prevents unbounded XP). */
export const DEFAULT_BONUS_STAKE_XP_CAP_DFQ = 1000;

function envPositiveInt(key: string, fallback: number): number {
  const v = Number(process.env[key]);
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : fallback;
}

export function getBonusXpPerDfqAboveMin(): number {
  return envPositiveInt('NEXT_PUBLIC_BONUS_XP_PER_DFQ', DEFAULT_BONUS_XP_PER_DFQ);
}

export function getBonusStakeXpCapDfq(): number {
  return envPositiveInt(
    'NEXT_PUBLIC_BONUS_STAKE_XP_CAP',
    DEFAULT_BONUS_STAKE_XP_CAP_DFQ,
  );
}

/**
 * Scales Bonus XP with stake: base at minimum, +rate per DFQ above min (capped).
 * Example (defaults): 10 DFQ → 1,000 XP; 100 DFQ → 5,500 XP; 1,000 DFQ → 50,500 XP (capped).
 */
export function calculateBonusXp(stakeAmount: number): number {
  const minStake = BONUS_QUEST.requiredStakeAmount;
  if (!Number.isFinite(stakeAmount) || stakeAmount < minStake) return 0;

  const cap = getBonusStakeXpCapDfq();
  const countedStake = Math.min(stakeAmount, cap);
  const extraDfq = Math.max(0, countedStake - minStake);
  const rate = getBonusXpPerDfqAboveMin();

  return BONUS_XP_BASE + Math.floor(extraDfq * rate);
}

export function getBonusXpBreakdown(stakeAmount: number) {
  const minStake = BONUS_QUEST.requiredStakeAmount;
  const cap = getBonusStakeXpCapDfq();
  const rate = getBonusXpPerDfqAboveMin();
  const countedStake = Math.min(Math.max(stakeAmount, 0), cap);
  const extraDfq = Math.max(0, countedStake - minStake);
  const scaledXp = Math.floor(extraDfq * rate);
  const totalXp = stakeAmount >= minStake ? BONUS_XP_BASE + scaledXp : 0;

  return {
    minStake,
    cap,
    rate,
    countedStake,
    extraDfq,
    baseXp: BONUS_XP_BASE,
    scaledXp,
    totalXp,
    hitCap: stakeAmount > cap,
  };
}
