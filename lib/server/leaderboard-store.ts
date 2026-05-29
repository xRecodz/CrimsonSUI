import { readJsonStore, writeJsonStore } from './json-store';

export type LeaderboardRow = {
  wallet: string;
  xp: number;
  badges: number;
  questsCompleted: number;
  updatedAt: string;
};

export type LeaderboardAggregates = {
  players: number;
  totalXp: number;
  totalQuestsCompleted: number;
  totalBadgesClaimed: number;
};

const STORE_KEY = 'crimson:leaderboard';

export async function readLeaderboardRows(): Promise<LeaderboardRow[]> {
  const rows = await readJsonStore<LeaderboardRow[]>(STORE_KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export function computeAggregates(rows: LeaderboardRow[]): LeaderboardAggregates {
  return rows.reduce(
    (acc, row) => ({
      players: acc.players + 1,
      totalXp: acc.totalXp + row.xp,
      totalQuestsCompleted: acc.totalQuestsCompleted + (row.questsCompleted ?? 0),
      totalBadgesClaimed: acc.totalBadgesClaimed + row.badges,
    }),
    {
      players: 0,
      totalXp: 0,
      totalQuestsCompleted: 0,
      totalBadgesClaimed: 0,
    },
  );
}

export async function upsertLeaderboardRow(
  wallet: string,
  xp: number,
  badges: number,
  questsCompleted: number,
): Promise<LeaderboardRow[]> {
  const key = wallet.toLowerCase();
  const rows = await readLeaderboardRows();
  const now = new Date().toISOString();
  const existingIndex = rows.findIndex((r) => r.wallet.toLowerCase() === key);

  if (existingIndex >= 0) {
    const prev = rows[existingIndex]!;
    rows[existingIndex] = {
      wallet: key,
      xp: Math.max(prev.xp, xp),
      badges: Math.max(prev.badges, badges),
      questsCompleted: Math.max(prev.questsCompleted ?? 0, questsCompleted),
      updatedAt: now,
    };
  } else {
    rows.push({ wallet: key, xp, badges, questsCompleted, updatedAt: now });
  }

  rows.sort((a, b) => b.xp - a.xp || b.badges - a.badges);

  await writeJsonStore(STORE_KEY, rows);

  return rows;
}
