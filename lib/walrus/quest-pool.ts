import type { QuestPoolQuestion } from '@/lib/quest-engine';
import { readJsonFromWalrus } from './client';
import poolFallback from '@/data/quest-pool.json';

export type QuestPool = {
  version: number;
  name: string;
  questions: QuestPoolQuestion[];
  walrusBlobId?: string;
};

export async function fetchQuestPoolFromWalrus(
  blobId?: string,
): Promise<QuestPool> {
  const id = blobId ?? process.env.NEXT_PUBLIC_QUEST_POOL_BLOB_ID;
  if (!id) {
    return poolFallback as QuestPool;
  }

  try {
    const pool = await readJsonFromWalrus<QuestPool>(id);
    return { ...pool, walrusBlobId: id };
  } catch {
    return poolFallback as QuestPool;
  }
}

export function getQuestPoolSourceLabel(blobId?: string): string {
  const id = blobId ?? process.env.NEXT_PUBLIC_QUEST_POOL_BLOB_ID;
  return id ? `walrus://${id}` : 'bundled';
}
