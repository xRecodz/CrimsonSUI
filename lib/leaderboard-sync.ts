import { loadLeaderboardEntries } from './quest-storage';

export async function syncLeaderboardToServer(
  wallet: string,
  xp: number,
  badges: number,
  questsCompleted: number,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, xp, badges, questsCompleted }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: body.error ?? res.statusText };
    }

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Network error',
    };
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
