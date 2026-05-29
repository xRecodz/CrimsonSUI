import {
  BONUS_QUEST,
  DAILY_QUESTS_PER_DAY,
  DAILY_XP,
  WEEKLY_QUEST,
} from '@/lib/quest-engine';
import poolFallback from '@/data/quest-pool.json';
import { BADGE_REGISTRY_ID, suiContractsConfigured } from '@/lib/contracts/sui-config';
import { createTatumSuiClient } from '@/lib/sui/client';
import { getActiveNetwork, getNetworkLabel, getPublicSuiRpcUrl } from '@/lib/sui/network';
import { JsonRpcHTTPTransport, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';

export type PlatformStats = {
  badgesMinted: number;
  badgesMintedLive: boolean;
  questPoolSize: number;
  dailyQuestsPerDay: number;
  maxDailyXp: number;
  weeklyXpReward: number;
  bonusXpReward: number;
  chain: string;
};

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const poolSize = poolFallback.questions.length;
  const base: PlatformStats = {
    badgesMinted: 0,
    badgesMintedLive: false,
    questPoolSize: poolSize,
    dailyQuestsPerDay: DAILY_QUESTS_PER_DAY,
    maxDailyXp: DAILY_QUESTS_PER_DAY * DAILY_XP,
    weeklyXpReward: WEEKLY_QUEST.xpReward,
    bonusXpReward: BONUS_QUEST.xpReward,
    chain: getNetworkLabel(getActiveNetwork()),
  };

  if (!suiContractsConfigured() || !BADGE_REGISTRY_ID) return base;

  const readRegistry = async (client: SuiJsonRpcClient) => {
    const obj = await client.getObject({
      id: BADGE_REGISTRY_ID,
      options: { showContent: true },
    });

    const content: any = (obj as any)?.data?.content;
    const nextIdRaw = content?.dataType === 'moveObject' ? content?.fields?.next_badge_id : undefined;
    const nextId = typeof nextIdRaw === 'string' || typeof nextIdRaw === 'number' ? Number(nextIdRaw) : NaN;
    if (!Number.isFinite(nextId) || nextId < 0) throw new Error('Could not read BadgeRegistry.next_badge_id');
    return nextId;
  };

  try {
    const client = createTatumSuiClient(getActiveNetwork());
    const minted = await readRegistry(client);
    return { ...base, badgesMinted: minted, badgesMintedLive: true };
  } catch {
    try {
      const client = new SuiJsonRpcClient({
        network: getActiveNetwork(),
        transport: new JsonRpcHTTPTransport({ url: getPublicSuiRpcUrl(getActiveNetwork()) }),
      });
      const minted = await readRegistry(client);
      return { ...base, badgesMinted: minted, badgesMintedLive: true };
    } catch {
      return base;
    }
  }
}
