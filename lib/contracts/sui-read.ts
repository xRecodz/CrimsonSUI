import type { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import {
  CRIMSON_COIN_TYPE,
  CRIMSON_PACKAGE_ID,
  DFQ_FAUCET_COOLDOWN_MS,
  FAUCET_OBJECT_ID,
  STAKING_POOL_ID,
} from './sui-config';

export const QUEST_BADGE_TYPE = `${CRIMSON_PACKAGE_ID}::crimson::QuestBadge`;

/** Count QuestBadge NFT objects owned by `owner`. */
export async function fetchUserBadgeCount(
  client: SuiJsonRpcClient,
  owner: string,
): Promise<number> {
  let total = 0;
  let cursor: string | null | undefined = undefined;
  do {
    const page = await client.getOwnedObjects({
      owner,
      cursor: cursor ?? undefined,
      filter: { StructType: QUEST_BADGE_TYPE },
      options: { showContent: false },
    });
    total += page.data.length;
    cursor = page.hasNextPage ? page.nextCursor : null;
  } while (cursor);
  return total;
}

export async function fetchDfqCoinIds(
  client: SuiJsonRpcClient,
  owner: string,
): Promise<string[]> {
  const res = await client.getCoins({ owner, coinType: CRIMSON_COIN_TYPE });
  return res.data.map((c) => c.coinObjectId);
}

export async function fetchDfqBalance(
  client: SuiJsonRpcClient,
  owner: string,
): Promise<bigint> {
  const bal = await client.getBalance({ owner, coinType: CRIMSON_COIN_TYPE });
  return BigInt(bal.totalBalance);
}

/** Read staked DFQ for `owner` from the shared StakingPool stakes table. */
export async function fetchStakedBalance(
  client: SuiJsonRpcClient,
  owner: string,
): Promise<bigint> {
  try {
    const pool = await client.getObject({
      id: STAKING_POOL_ID,
      options: { showContent: true },
    });
    const stakesField = (pool.data?.content as { fields?: { stakes?: { fields?: { id?: { id?: string } } } } })
      ?.fields?.stakes?.fields?.id?.id;
    if (!stakesField) return 0n;

    const entry = await client.getDynamicFieldObject({
      parentId: stakesField,
      name: { type: 'address', value: owner },
    });
    const value = (entry.data?.content as { fields?: { value?: string } })?.fields?.value;
    return value ? BigInt(value) : 0n;
  } catch {
    return 0n;
  }
}

/** Last faucet claim timestamp (ms) for `owner`, or null if never claimed. */
export async function fetchFaucetLastClaimMs(
  client: SuiJsonRpcClient,
  owner: string,
): Promise<number | null> {
  try {
    const faucet = await client.getObject({
      id: FAUCET_OBJECT_ID,
      options: { showContent: true },
    });
    const tableId = (
      faucet.data?.content as {
        fields?: { last_claim?: { fields?: { id?: { id?: string } } } };
      }
    )?.fields?.last_claim?.fields?.id?.id;
    if (!tableId) return null;

    const entry = await client.getDynamicFieldObject({
      parentId: tableId,
      name: { type: 'address', value: owner },
    });
    const value = (entry.data?.content as { fields?: { value?: string } })?.fields?.value;
    return value != null ? Number(value) : null;
  } catch {
    return null;
  }
}

export async function fetchFaucetCooldownRemainingMs(
  client: SuiJsonRpcClient,
  owner: string,
): Promise<number> {
  const last = await fetchFaucetLastClaimMs(client, owner);
  if (last == null) return 0;
  const next = last + DFQ_FAUCET_COOLDOWN_MS;
  return Math.max(0, next - Date.now());
}
