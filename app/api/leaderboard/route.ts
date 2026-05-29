import { NextResponse } from 'next/server';
import {
  computeAggregates,
  readLeaderboardRows,
  upsertLeaderboardRow,
} from '@/lib/server/leaderboard-store';
import { fetchPlatformStats } from '@/lib/platform-stats';
import { hasVercelKv } from '@/lib/server/data-dir';
import { WEEKLY_QUEST } from '@/lib/quest-engine';
import type { LeaderboardEntry } from '@/lib/quest-types';

export const runtime = 'nodejs';

function toEntries(
  rows: Awaited<ReturnType<typeof readLeaderboardRows>>,
  currentWallet?: string,
): LeaderboardEntry[] {
  return rows.map((row, index) => ({
    rank: index + 1,
    wallet: row.wallet,
    xp: row.xp,
    badges: row.badges,
    isYou:
      !!currentWallet &&
      row.wallet.toLowerCase() === currentWallet.toLowerCase(),
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet') ?? undefined;
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100);

  const rows = await readLeaderboardRows();
  const aggregates = computeAggregates(
    rows.map((r) => ({
      ...r,
      questsCompleted: r.questsCompleted ?? 0,
    })),
  );
  const platform = await fetchPlatformStats();
  const onchainBadges = platform.badgesMintedLive
    ? platform.badgesMinted
    : aggregates.totalBadgesClaimed;

  const entries = toEntries(rows, wallet).slice(0, limit);

  return NextResponse.json({
    entries,
    total: rows.length,
    aggregates: {
      ...aggregates,
      onchainBadgesMinted: onchainBadges,
      dfqMintFeesEst: onchainBadges * WEEKLY_QUEST.mintFeeDfq,
    },
    source: hasVercelKv() ? 'kv' : 'file',
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      wallet?: string;
      xp?: number;
      badges?: number;
      questsCompleted?: number;
    };

    if (!body.wallet || typeof body.xp !== 'number') {
      return NextResponse.json(
        { error: 'wallet and xp are required' },
        { status: 400 },
      );
    }

    const wallet = body.wallet.toLowerCase();
    // Sui addresses are 32 bytes (0x + 64 hex). Accept legacy 20-byte format too for old data.
    if (!/^0x[a-f0-9]{40}$/.test(wallet) && !/^0x[a-f0-9]{64}$/.test(wallet)) {
      return NextResponse.json({ error: 'invalid wallet' }, { status: 400 });
    }

    const rows = await upsertLeaderboardRow(
      wallet,
      Math.max(0, Math.floor(body.xp)),
      Math.max(0, Math.floor(body.badges ?? 0)),
      Math.max(0, Math.floor(body.questsCompleted ?? 0)),
    );

    const entry = toEntries(rows, wallet).find(
      (e) => e.wallet.toLowerCase() === wallet,
    );

    return NextResponse.json({ ok: true, entry, total: rows.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
