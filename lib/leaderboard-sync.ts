import { loadLeaderboardEntries } from './quest-storage';

export async function syncLeaderboardToServer(
  wallet: string,
  xp: number,
  badges: number,
  questsCompleted: number,
): Promise<void> {
  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, xp, badges, questsCompleted }),
    });
  } catch {
    // keep local cache only
  }
}

export async function pushLocalLeaderboardToServer(): Promise<void> {
  const local = loadLeaderboardEntries();
  await Promise.all(
    local.map((e) =>
      syncLeaderboardToServer(
        e.wallet,
        e.xp,
        e.badges,
        e.questsCompleted ?? 0,
      ),
    ),
  );
}
