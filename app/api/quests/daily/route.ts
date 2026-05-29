import { NextResponse } from 'next/server';
import {
  fetchQuestPoolFromWalrus,
  getQuestPoolSourceLabel,
  type QuestPool,
} from '@/lib/walrus/quest-pool';
import {
  generateDailyQuestsFromPool,
  resolveDailyQuestCount,
} from '@/lib/quest-engine';
import poolFallback from '@/data/quest-pool.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');
  const dateKey = searchParams.get('dateKey') ?? undefined;

  if (!wallet) {
    return NextResponse.json({ error: 'wallet query required' }, { status: 400 });
  }

  let pool: QuestPool = poolFallback as QuestPool;
  const poolBlobId = process.env.NEXT_PUBLIC_QUEST_POOL_BLOB_ID;

  if (poolBlobId) {
    try {
      pool = await fetchQuestPoolFromWalrus(poolBlobId);
    } catch {
      // fallback to bundled JSON
    }
  }

  const questsPerDay = resolveDailyQuestCount(pool.questions.length);
  const quests = generateDailyQuestsFromPool(
    wallet,
    pool.questions,
    dateKey,
    questsPerDay,
  );

  return NextResponse.json({
    quests,
    poolSource: getQuestPoolSourceLabel(poolBlobId),
    questsPerDay,
    walrusBlobId: poolBlobId ?? null,
  });
}
