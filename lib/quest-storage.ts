import type { UserQuestProgress } from './quest-types';
import { getTotalXp, countQuestsCompleted } from './quest-engine';
import { syncLeaderboardToServer } from './leaderboard-sync';
import { isWalrusBlobId } from '@/lib/walrus/proof';

const PROGRESS_KEY = 'defi-quest-progress';
const LEADERBOARD_KEY = 'defi-quest-leaderboard';

export function getDefaultProgress(wallet: string): UserQuestProgress {
  return {
    wallet: wallet.toLowerCase(),
    totalXp: 0,
    bonusXp: 0,
    badgeCount: 0,
    nftBadgeMinted: false,
    dailyCompletedDates: [],
    dailyAttemptedDates: [],
    dailyCompletedQuestIds: [],
    dailyAttemptedQuestIds: [],
    weeklyCompleted: false,
    bonusCompleted: false,
    stakingCompleted: false,
    ipfsProofCids: [],
    walrusProofs: [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadProgress(wallet: string): UserQuestProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress(wallet);
  }

  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const all: Record<string, UserQuestProgress> = raw ? JSON.parse(raw) : {};
    const key = wallet.toLowerCase();
    return migrateProgress(all[key] ?? getDefaultProgress(wallet));
  } catch {
    return getDefaultProgress(wallet);
  }
}

export function saveProgress(progress: UserQuestProgress): UserQuestProgress {
  if (typeof window === 'undefined') return progress;

  const key = progress.wallet.toLowerCase();
  const updated: UserQuestProgress = {
    ...progress,
    wallet: key,
    updatedAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const all: Record<string, UserQuestProgress> = raw ? JSON.parse(raw) : {};
    all[key] = updated;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    syncLeaderboardLocal(updated);
    void syncLeaderboardToServer(
      updated.wallet,
      getTotalXp(updated),
      updated.badgeCount,
      countQuestsCompleted(updated),
    );
  } catch {
    // ignore storage errors
  }

  return updated;
}

function syncLeaderboardLocal(progress: UserQuestProgress): void {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    const entries: Record<
      string,
      { wallet: string; xp: number; badges: number }
    > = raw ? JSON.parse(raw) : {};

    entries[progress.wallet] = {
      wallet: progress.wallet,
      xp: getTotalXp(progress),
      badges: progress.badgeCount,
      questsCompleted: countQuestsCompleted(progress),
    };

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function loadLeaderboardEntries(): {
  wallet: string;
  xp: number;
  badges: number;
  questsCompleted?: number;
}[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    const entries: Record<
      string,
      { wallet: string; xp: number; badges: number }
    > = raw ? JSON.parse(raw) : {};
    return Object.values(entries).sort((a, b) => b.xp - a.xp);
  } catch {
    return [];
  }
}

function migrateProgress(progress: UserQuestProgress): UserQuestProgress {
  const walrusProofs =
    progress.walrusProofs ??
    progress.ipfsProofCids
      .filter(isWalrusBlobId)
      .map((blobId) => ({
        blobId,
        storedAt: progress.updatedAt,
      }));

  return {
    ...progress,
    dailyCompletedQuestIds: progress.dailyCompletedQuestIds ?? [],
    dailyAttemptedQuestIds: progress.dailyAttemptedQuestIds ?? [],
    dailyCompletedDates: progress.dailyCompletedDates ?? [],
    dailyAttemptedDates: progress.dailyAttemptedDates ?? [],
    bonusStakeAmount: progress.bonusStakeAmount,
    walrusProofs,
  };
}

export async function uploadQuestProofToWalrus(
  wallet: string,
  quest: Record<string, unknown>,
  label?: string,
): Promise<{
  blobId: string;
  uri: string;
  gatewayUrl: string;
  suiObjectId?: string;
} | null> {
  try {
    const res = await fetch('/api/walrus/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, quest, label }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** @deprecated Use uploadQuestProofToWalrus */
export const uploadQuestProofToPinata = uploadQuestProofToWalrus;

export function buildQuestMetadataPayload(
  wallet: string,
  quest: Record<string, unknown>,
) {
  return {
    name: 'Crimson',
    description: 'Gamified DeFi onboarding quest metadata',
    wallet,
    timestamp: new Date().toISOString(),
    quest,
    storage: 'walrus',
  };
}
