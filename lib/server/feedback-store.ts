import { readJsonStore, writeJsonStore } from './json-store';

export type FeedbackEntry = {
  id: string;
  wallet?: string;
  displayName: string;
  rating: number;
  message: string;
  createdAt: string;
};

const STORE_KEY = 'crimson:feedback';

export async function readFeedback(): Promise<FeedbackEntry[]> {
  const rows = await readJsonStore<FeedbackEntry[]>(STORE_KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export async function addFeedback(
  entry: Omit<FeedbackEntry, 'id' | 'createdAt'>,
): Promise<FeedbackEntry[]> {
  const rows = await readFeedback();
  const row: FeedbackEntry = {
    ...entry,
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  rows.unshift(row);
  await writeJsonStore(STORE_KEY, rows);
  return rows;
}

export function summarizeFeedback(rows: FeedbackEntry[]) {
  if (rows.length === 0) {
    return { count: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  let sum = 0;
  for (const row of rows) {
    const r = Math.min(5, Math.max(1, Math.round(row.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[r]++;
    sum += r;
  }
  return {
    count: rows.length,
    average: Math.round((sum / rows.length) * 10) / 10,
    distribution,
  };
}
