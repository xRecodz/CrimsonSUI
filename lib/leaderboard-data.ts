import type { LeaderboardEntry } from './quest-types';
import { loadLeaderboardEntries } from './quest-storage';

/** Client: fetch real leaderboard from server (no fake seed data). */
export async function fetchLeaderboard(
  currentWallet?: string,
  limit = 10,
): Promise<{
  entries: LeaderboardEntry[];
  total: number;
  aggregates?: {
    players: number;
    totalXp: number;
    totalQuestsCompleted: number;
    totalBadgesClaimed: number;
    onchainBadgesMinted: number;
    dfqMintFeesEst: number;
  };
}> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (currentWallet) params.set('wallet', currentWallet);

    const res = await fetch(`/api/leaderboard?${params}`);
    if (!res.ok) throw new Error('fetch failed');

    const data = (await res.json()) as {
      entries: LeaderboardEntry[];
      total: number;
      aggregates?: {
        players: number;
        totalXp: number;
        totalQuestsCompleted: number;
        totalBadgesClaimed: number;
        onchainBadgesMinted: number;
        dfqMintFeesEst: number;
      };
    };
    return {
      entries: data.entries ?? [],
      total: data.total ?? 0,
      aggregates: data.aggregates,
    };
  } catch {
    const entries = getLocalLeaderboardFallback(currentWallet, limit);
    return { entries, total: entries.length };
  }
}

/** Offline / API error fallback — this device only */
export function getLocalLeaderboardFallback(
  currentWallet?: string,
  limit = 10,
): LeaderboardEntry[] {
  const local = loadLeaderboardEntries();
  return local.slice(0, limit).map((entry, index) => ({
    rank: index + 1,
    wallet: entry.wallet,
    xp: entry.xp,
    badges: entry.badges,
    isYou:
      !!currentWallet &&
      entry.wallet.toLowerCase() === currentWallet.toLowerCase(),
  }));
}
