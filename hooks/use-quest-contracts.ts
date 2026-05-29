'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import {
  DFQ_MINT_FEE,
  fromDfqUnits,
  suiContractsConfigured,
  toDfqUnits,
} from '@/lib/contracts/sui-config';
import { formatCrimsonMoveError } from '@/lib/contracts/sui-errors';
import {
  fetchDfqBalance,
  fetchDfqCoinIds,
  fetchFaucetCooldownRemainingMs,
  fetchStakedBalance,
} from '@/lib/contracts/sui-read';
import {
  buildClaimFaucetTx,
  buildMintBadgeTx,
  buildStakeTx,
} from '@/lib/contracts/sui-transactions';

export function useQuestContracts() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const configured = suiContractsConfigured();
  const address = account?.address;

  const [dfqBalance, setDfqBalance] = useState(0n);
  const [stakedBalance, setStakedBalance] = useState(0n);
  const [faucetCooldownMs, setFaucetCooldownMs] = useState(0);
  const [txHash, setTxHash] = useState<string | undefined>();

  const refreshBalances = useCallback(async () => {
    if (!address || !configured) {
      setDfqBalance(0n);
      setStakedBalance(0n);
      setFaucetCooldownMs(0);
      return { dfq: 0n, staked: 0n, cooldown: 0 };
    }
    const [dfq, staked, cooldown] = await Promise.all([
      fetchDfqBalance(client, address),
      fetchStakedBalance(client, address),
      fetchFaucetCooldownRemainingMs(client, address),
    ]);
    setDfqBalance(dfq);
    setStakedBalance(staked);
    setFaucetCooldownMs(cooldown);
    return { dfq, staked, cooldown };
  }, [address, client, configured]);

  useEffect(() => {
    void refreshBalances();
  }, [refreshBalances]);

  const {
    mutateAsync: signAndExecute,
    isPending,
    isSuccess,
    isError,
    reset,
  } = useSignAndExecuteTransaction();

  const runTx = useCallback(
    async (build: () => ReturnType<typeof buildClaimFaucetTx>) => {
      if (!address) throw new Error('Connect your Sui wallet first.');
      if (!configured) {
        throw new Error('Sui contracts are not deployed yet. Run: node scripts/deploy-sui.mjs');
      }
      reset();
      const tx = build();
      try {
        const result = await signAndExecute({ transaction: tx });
        const digest =
          'digest' in result && result.digest
            ? result.digest
            : undefined;
        setTxHash(digest);
        await refreshBalances();
        return digest;
      } catch (e) {
        throw new Error(formatCrimsonMoveError(e));
      }
    },
    [address, configured, refreshBalances, reset, signAndExecute],
  );

  const claimFaucet = useCallback(async () => {
    if (faucetCooldownMs > 0) {
      throw new Error(formatCrimsonMoveError('abort code: 1 claim_faucet'));
    }
    try {
      await runTx(() => buildClaimFaucetTx());
    } catch (e) {
      throw new Error(formatCrimsonMoveError(e));
    }
  }, [faucetCooldownMs, runTx]);

  const mintBadgeOnChain = useCallback(
    async (walrusUri: string) => {
      if (!address) throw new Error('Connect your Sui wallet first.');
      let coinIds: string[] = [];
      try {
        coinIds = await fetchDfqCoinIds(client, address);
      } catch (e) {
        throw new Error(formatCrimsonMoveError(e));
      }
      if (coinIds.length === 0) {
        throw new Error(
          `You need at least ${fromDfqUnits(DFQ_MINT_FEE)} DFQ. Claim the faucet first.`,
        );
      }
      let balance = dfqBalance;
      try {
        const refreshed = await refreshBalances();
        balance = refreshed.dfq;
      } catch (e) {
        throw new Error(
          e instanceof Error
            ? e.message
            : 'Could not read DFQ balance. Try again in a few seconds.',
        );
      }
      if (balance < DFQ_MINT_FEE) {
        throw new Error(
          `Insufficient DFQ (need ${fromDfqUnits(DFQ_MINT_FEE)}, have ${fromDfqUnits(balance)}). Claim the faucet first.`,
        );
      }
      await runTx(() => buildMintBadgeTx(walrusUri, coinIds));
    },
    [address, client, dfqBalance, refreshBalances, runTx],
  );

  const stakeOnChain = useCallback(
    async (amountHuman: number) => {
      if (!address) throw new Error('Connect your Sui wallet first.');
      const coinIds = await fetchDfqCoinIds(client, address);
      const needed = toDfqUnits(amountHuman);
      const balance = await fetchDfqBalance(client, address);
      if (balance < needed) {
        throw new Error(
          `Insufficient DFQ (need ${amountHuman}, have ${fromDfqUnits(balance)}).`,
        );
      }
      if (coinIds.length === 0) {
        throw new Error('No DFQ coins in wallet. Claim the faucet first.');
      }
      await runTx(() => buildStakeTx(amountHuman, coinIds));
    },
    [address, client, runTx],
  );

  return {
    configured,
    onTargetChain: Boolean(address),
    targetChain: { name: 'Sui' },
    dfqBalance,
    stakedBalance,
    mintFee: DFQ_MINT_FEE,
    faucetCooldownMs,
    canClaimFaucet: faucetCooldownMs <= 0,
    claimFaucet,
    mintBadgeOnChain,
    stakeOnChain,
    refreshBalances,
    isPending,
    isConfirming: isPending,
    isConfirmed: isSuccess && !isError,
    txHash: txHash as `0x${string}` | undefined,
  };
}
