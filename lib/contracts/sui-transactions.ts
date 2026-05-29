import { Transaction } from '@mysten/sui/transactions';
import {
  BADGE_REGISTRY_ID,
  CRIMSON_PACKAGE_ID,
  FAUCET_OBJECT_ID,
  STAKING_POOL_ID,
  toDfqUnits,
} from './sui-config';

const CLOCK_OBJECT_ID = '0x6';

export function buildClaimFaucetTx(): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${CRIMSON_PACKAGE_ID}::crimson::claim_faucet`,
    arguments: [tx.object(FAUCET_OBJECT_ID), tx.object(CLOCK_OBJECT_ID)],
  });
  return tx;
}

function mergeDfqCoins(tx: Transaction, coinIds: string[]) {
  const primary = tx.object(coinIds[0]!);
  if (coinIds.length > 1) {
    tx.mergeCoins(
      primary,
      coinIds.slice(1).map((id) => tx.object(id)),
    );
  }
  return primary;
}

/** Mint badge; merges wallet DFQ coins then pays from the merged coin (≥ mint fee). */
export function buildMintBadgeTx(walrusUri: string, dfqCoinIds: string[]): Transaction {
  const tx = new Transaction();
  const payment = mergeDfqCoins(tx, dfqCoinIds);
  tx.moveCall({
    target: `${CRIMSON_PACKAGE_ID}::crimson::mint_badge`,
    arguments: [
      tx.object(BADGE_REGISTRY_ID),
      payment,
      tx.pure.vector('u8', Array.from(new TextEncoder().encode(walrusUri))),
    ],
  });
  return tx;
}

/** Stake a human-readable DFQ amount from wallet coins. */
export function buildStakeTx(amountHuman: number, dfqCoinIds: string[]): Transaction {
  const tx = new Transaction();
  const primary = mergeDfqCoins(tx, dfqCoinIds);
  const [stakeCoin] = tx.splitCoins(primary, [tx.pure.u64(toDfqUnits(amountHuman))]);
  tx.moveCall({
    target: `${CRIMSON_PACKAGE_ID}::crimson::stake`,
    arguments: [tx.object(STAKING_POOL_ID), stakeCoin],
  });
  return tx;
}

export function buildUnstakeTx(amountHuman: number): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${CRIMSON_PACKAGE_ID}::crimson::unstake`,
    arguments: [
      tx.object(STAKING_POOL_ID),
      tx.pure.u64(toDfqUnits(amountHuman)),
    ],
  });
  return tx;
}
