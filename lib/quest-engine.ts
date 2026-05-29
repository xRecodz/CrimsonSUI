import type { BonusQuest, DailyQuest, WeeklyQuest } from './quest-types';
import poolFallback from '@/data/quest-pool.json';

export type QuestPoolQuestion = {
  type: 'vote' | 'quiz';
  title: string;
  question: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
};

export const DAILY_XP = 100;
export const WEEKLY_XP = 500;
/** Minimum bonus XP (at min stake); see `calculateBonusXp` in bonus-xp.ts for scaling. */
export const BONUS_XP = 1000;

/** Max daily quests per wallet per UTC day (capped by pool size on generate) */
export const DAILY_QUESTS_PER_DAY = 15;

function shuffleOptions<T extends { id: string }>(
  options: T[],
  seed: string,
): T[] {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = hashString(`${seed}-opt-${i}`) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function resolveDailyQuestCount(poolSize: number): number {
  return Math.min(DAILY_QUESTS_PER_DAY, Math.max(poolSize, 1));
}

const FALLBACK_QUESTIONS = poolFallback.questions as QuestPoolQuestion[];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getWeekKey(date = new Date()): string {
  const d = new Date(date);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

/** @deprecated Use Pinata upload — local fallback only when API unavailable */
export function buildIpfsCid(seed: string): string {
  const hash = hashString(seed).toString(16).padStart(16, '0');
  return `bafyquest${hash.slice(0, 32)}`;
}

export function getQuestDateKey(questId: string): string | null {
  const m = questId.match(/^daily-(\d{4}-\d{2}-\d{2})-/);
  return m?.[1] ?? null;
}

export function generateDailyQuestsFromPool(
  wallet: string,
  questions: QuestPoolQuestion[] = FALLBACK_QUESTIONS,
  dateKey = getDateKey(),
  count?: number,
): DailyQuest[] {
  const walletLower = wallet.toLowerCase();
  const usedIndices = new Set<number>();
  const quests: DailyQuest[] = [];
  const questCount = count ?? resolveDailyQuestCount(questions.length);

  for (let slot = 0; slot < questCount; slot++) {
    const seed = `${walletLower}-${dateKey}-slot-${slot}`;
    let index = hashString(seed) % questions.length;
    let guard = 0;
    while (usedIndices.has(index) && guard < questions.length) {
      index = (index + 1) % questions.length;
      guard++;
    }
    usedIndices.add(index);

    const template = questions[index]!;
    const questId = `daily-${dateKey}-slot-${slot}-${hashString(seed).toString(36)}`;
    const shuffledOptions = shuffleOptions(template.options, `${seed}-options`);

    const metadata = {
      name: `Crimson Daily — ${template.title}`,
      description: template.question,
      wallet: walletLower,
      dateKey,
      slot,
      category: 'daily',
      type: template.type,
      questId,
    };

    quests.push({
      id: questId,
      type: template.type,
      title: template.title,
      question: template.question,
      options: shuffledOptions,
      correctOptionId: template.correctOptionId,
      xpReward: DAILY_XP,
      dateKey,
      slot,
      walletSeed: seed,
      ipfsMetadataUri: `ipfs://${buildIpfsCid(JSON.stringify(metadata))}`,
    });
  }

  return quests;
}

/** @deprecated Use generateDailyQuestsFromPool */
export function generateDailyQuest(
  wallet: string,
  dateKey = getDateKey(),
): DailyQuest {
  return generateDailyQuestsFromPool(wallet, FALLBACK_QUESTIONS, dateKey, 1)[0]!;
}

export const WEEKLY_QUEST: WeeklyQuest = {
  id: 'weekly-nft-badge',
  title: 'Weekly Badge',
  description:
    'Complete 5 daily quests this week to unlock your weekly badge. Mint a QuestBadge on Sui; metadata is stored on Walrus.',
  requiredDailyCount: 5,
  xpReward: WEEKLY_XP,
  badgeName: 'Crimson Pioneer Badge',
  badgeTokenUri: 'walrus://badge-metadata',
  mintFeeDfq: 50,
};

export const BONUS_QUEST: BonusQuest = {
  id: 'bonus-staking-hidden',
  title: 'Hidden Staking Quest',
  description:
    'Endgame quest: stake on-chain after your badge. More stake = more Bonus XP — farm dailies & weekly first, then push leaderboard here.',
  xpReward: BONUS_XP,
  requiredStakeAmount: 10,
  stakeTokenSymbol: 'DFQ',
};

export function countDailyCompletionsToday(
  completedQuestIds: string[],
  dateKey = getDateKey(),
): number {
  return completedQuestIds.filter(
    (questId) => getQuestDateKey(questId) === dateKey,
  ).length;
}

export function countDailyCompletionsThisWeek(
  completedQuestIds: string[],
  weekKey = getWeekKey(),
): number {
  const weekStart = new Date(weekKey);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  return completedQuestIds.filter((questId) => {
    const dateKey = getQuestDateKey(questId);
    if (!dateKey) return false;
    const d = new Date(`${dateKey}T00:00:00.000Z`);
    return d >= weekStart && d < weekEnd;
  }).length;
}

export function isQuestCompleted(
  completedQuestIds: string[],
  questId: string,
): boolean {
  return completedQuestIds.includes(questId);
}

export function isQuestAttempted(
  attemptedQuestIds: string[],
  questId: string,
): boolean {
  return attemptedQuestIds.includes(questId);
}

/** Legacy: one quest per calendar day */
export function isDailyCompletedToday(
  completedDates: string[],
  dateKey = getDateKey(),
): boolean {
  return completedDates.includes(dateKey);
}

export function isDailyAttemptedToday(
  attemptedDates: string[],
  dateKey = getDateKey(),
): boolean {
  return attemptedDates.includes(dateKey);
}

export function getTotalXp(progress: {
  totalXp: number;
  bonusXp: number;
}): number {
  return progress.totalXp + progress.bonusXp;
}

export function countQuestsCompleted(progress: {
  dailyCompletedQuestIds: string[];
  weeklyCompleted: boolean;
  bonusCompleted: boolean;
}): number {
  return (
    progress.dailyCompletedQuestIds.length +
    (progress.weeklyCompleted ? 1 : 0) +
    (progress.bonusCompleted ? 1 : 0)
  );
}
