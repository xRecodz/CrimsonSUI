import { promises as fs } from 'fs';
import path from 'path';

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

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE = path.join(DATA_DIR, 'leaderboard.json');

export async function readLeaderboardRows(): Promise<LeaderboardRow[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw) as LeaderboardRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), 'utf8');

  return rows;
}
