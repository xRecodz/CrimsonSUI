'use client';

import { useMemo, useState } from 'react';
import { formatCooldownRemaining } from '@/lib/contracts/sui-errors';
import { fromDfqUnits } from '@/lib/contracts/sui-config';
import { useQuestProgress } from '@/hooks/use-quest-progress';
import { useQuestContracts } from '@/hooks/use-quest-contracts';
import { WalletGate } from './wallet-gate';
import { ProgressStats } from './progress-stats';
import { DailyQuestPanel } from './daily-quest-panel';
import { WeeklyQuestPanel } from './weekly-quest-panel';
import { BonusQuestPanel } from './bonus-quest-panel';
import { DAILY_XP } from '@/lib/quest-engine';
import { QuestProgressPath } from './quest-progress-path';
import { PremiumCard, PremiumCardGrid } from '@/components/landing/premium-card';
import { getWalrusProofs, getProofForQuest } from '@/lib/walrus/proof';
import { WalrusProofViewer } from './walrus-proof-viewer';
import { SuiscanAccountLink, SuiscanTxLink } from '@/components/sui-explorer-link';
import { CRIMSON_PACKAGE_ID } from '@/lib/contracts/sui-config';
import { suiscanUrl } from '@/lib/sui/explorer';
import { SuiFaucetButton } from '@/components/quests/sui-faucet-button';

const DFQ_SCALE = 1_000_000_000;

export function QuestDashboard() {
  const {
    isConnected,
    progress,
    dailyQuests,
    loadingQuests,
    questStatus,
    dailyCompletedToday,
    questsPerDay,
    weeklyDailyCount,
    weeklyUnlocked,
    bonusUnlocked,
    completeDaily,
    mintNftBadge,
    completeStakingQuest,
    message,
    clearMessage,
    WEEKLY_QUEST,
    BONUS_QUEST,
    seasonStatus,
  } = useQuestProgress();

  const contracts = useQuestContracts();
  const [contractMessage, setContractMessage] = useState<string | null>(null);

  const walrusProofs = useMemo(
    () => (progress ? getWalrusProofs(progress) : []),
    [progress],
  );

  if (!isConnected) {
    return <WalletGate />;
  }

  if (!progress) {
    return null;
  }

  const handleMint = async () => {
    setContractMessage(null);
    let tokenUri = WEEKLY_QUEST.badgeTokenUri;
    try {
      if (contracts.configured && contracts.onTargetChain) {
        const balances = await contracts.refreshBalances();
        const dfq = balances?.dfq ?? contracts.dfqBalance;
        if (dfq < contracts.mintFee) {
          setContractMessage(
            `Insufficient DFQ (need ${fromDfqUnits(contracts.mintFee)} DFQ, have ${fromDfqUnits(dfq)} DFQ). Claim the faucet first.`,
          );
          return;
        }
        const walrusRes = await fetch('/api/walrus/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet: progress.wallet,
            quest: {
              questId: WEEKLY_QUEST.id,
              badge: WEEKLY_QUEST.badgeName,
              type: 'badge-metadata',
            },
            label: 'badge-mint',
          }),
        }).then((r) => (r.ok ? r.json() : null));
        if (walrusRes?.uri) tokenUri = walrusRes.uri;
        await contracts.mintBadgeOnChain(tokenUri);
      }
      await mintNftBadge(tokenUri);
      setContractMessage('Weekly badge minted on-chain and recorded in your quest progress.');
    } catch (e) {
      setContractMessage(
        e instanceof Error ? e.message : 'Mint failed. Try again in a few seconds.',
      );
    }
  };

  const handleStake = async (amount: number) => {
    setContractMessage(null);
    try {
      if (contracts.configured && contracts.onTargetChain) {
        await contracts.stakeOnChain(amount);
        // Mirror the actual on-chain stake value to keep UI consistent.
        const refreshed = await contracts.refreshBalances();
        const stakedDfqHuman = Math.floor(Number(refreshed.staked) / DFQ_SCALE);
        await completeStakingQuest(stakedDfqHuman, true);
        setContractMessage(`Staked ${stakedDfqHuman} DFQ on-chain.`);
      } else {
        await completeStakingQuest(amount, false);
      }
    } catch (e) {
      setContractMessage(
        e instanceof Error ? e.message : 'Stake failed. Try again in a few seconds.',
      );
    }
  };

  let idx = 0;

  return (
    <PremiumCardGrid className="flex flex-col gap-6">
      <PremiumCard index={idx++} accentColor="#ff4444" className="p-4 text-sm text-gray-300">
        <span className="font-medium text-accent">Your journey</span> — up to{' '}
        {questsPerDay} dailies today (+{DAILY_XP} XP each). Wallet{' '}
        <span className="font-mono text-white">
          {progress.wallet.slice(0, 6)}…{progress.wallet.slice(-4)}
        </span>
        <span className="mt-2 block text-gray-500">
          Proofs stored on Walrus · Network: Sui{' '}
          {process.env.NEXT_PUBLIC_SUI_NETWORK ?? 'testnet'}
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          <SuiFaucetButton variant="inline" />
          <SuiscanAccountLink address={progress.wallet} />
          <a
            href={suiscanUrl('package', CRIMSON_PACKAGE_ID)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-gray-300 hover:border-accent/40 hover:text-accent"
          >
            Move package on Suiscan
            <span aria-hidden>↗</span>
          </a>
        </div>
      </PremiumCard>

      {contracts.configured && (
        <PremiumCard index={idx++} accentColor="#22c55e" className="p-4 space-y-2">
          <p className="text-xs text-gray-400">
            Balance: {fromDfqUnits(contracts.dfqBalance)} DFQ
            {contracts.stakedBalance > 0
              ? ` · Staked: ${fromDfqUnits(contracts.stakedBalance)} DFQ`
              : ''}
          </p>
          <button
            type="button"
            onClick={async () => {
              setContractMessage(null);
              try {
                await contracts.claimFaucet();
                setContractMessage('Faucet claimed — 1000 DFQ sent to your wallet.');
              } catch (e) {
                setContractMessage(
                  e instanceof Error ? e.message : 'Faucet claim failed.',
                );
              }
            }}
            disabled={
              contracts.isPending ||
              !contracts.onTargetChain ||
              !contracts.canClaimFaucet
            }
            className="w-full rounded-lg border border-white/20 py-2 text-sm text-white transition-colors hover:border-accent disabled:opacity-40"
          >
            {contracts.canClaimFaucet
              ? 'Claim DFQ faucet (1000 DFQ / 12h)'
              : `Faucet available in ${formatCooldownRemaining(contracts.faucetCooldownMs)}`}
          </button>
          <p className="text-xs text-gray-500">
            Transactions need testnet SUI for gas — not DFQ.
          </p>
          <SuiFaucetButton />
        </PremiumCard>
      )}

      {contracts.txHash && (
        <PremiumCard index={idx++} accentColor="#3b82f6" className="p-4 text-sm text-gray-300">
          <p className="text-xs text-gray-500">Latest on-chain transaction</p>
          <p className="mt-1 break-all font-mono text-xs text-white">{contracts.txHash}</p>
          <div className="mt-3">
            <SuiscanTxLink digest={contracts.txHash} />
          </div>
        </PremiumCard>
      )}

      {contractMessage && (
        <PremiumCard index={idx++} accentColor="#f59e0b" className="p-4 text-sm text-gray-300">
          <div className="flex items-start justify-between gap-2">
            <span>{contractMessage}</span>
            <button
              type="button"
              onClick={() => setContractMessage(null)}
              className="shrink-0 text-gray-500 hover:text-white"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </PremiumCard>
      )}

      <PremiumCard index={idx++} accentColor="#a78bfa" className="p-4">
        <QuestProgressPath
          dailyCompletedToday={dailyCompletedToday}
          questsPerDay={questsPerDay}
          weeklyDailyCount={weeklyDailyCount}
          weeklyRequired={WEEKLY_QUEST.requiredDailyCount}
          weeklyUnlocked={weeklyUnlocked}
          badgeMinted={progress.nftBadgeMinted}
          bonusUnlocked={bonusUnlocked}
          bonusCompleted={progress.bonusCompleted}
        />
      </PremiumCard>

      <PremiumCard index={idx++} accentColor="#fbbf24" className="p-4">
        <ProgressStats
          progress={progress}
          dailyCompletedToday={dailyCompletedToday}
          questsPerDay={questsPerDay}
          weeklyDailyCount={weeklyDailyCount}
          weeklyRequired={WEEKLY_QUEST.requiredDailyCount}
        />
      </PremiumCard>

      {message && (
        <PremiumCard index={idx++} accentColor="#ef4444" className="p-4">
          <div className="flex items-start justify-between gap-4 text-sm text-gray-200">
            <span>{message}</span>
            <button
              type="button"
              onClick={clearMessage}
              className="shrink-0 text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>
        </PremiumCard>
      )}

      <PremiumCard index={idx++} accentColor="#22c55e" className="p-4">
        <p className="text-sm font-semibold text-white">Walrus proof viewer</p>
        <p className="mt-1 text-xs text-gray-500">
          Expand any proof to read the JSON stored on Walrus via the aggregator.
        </p>
        <div className="mt-4">
          <WalrusProofViewer proofs={walrusProofs} />
        </div>
      </PremiumCard>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2 px-1">
          <h2 className="text-lg font-bold text-white">
            Today&apos;s quests ({dailyQuests.length})
          </h2>
          <p className="text-sm text-gray-500">
            {dailyCompletedToday}/{questsPerDay} done · {dailyCompletedToday * DAILY_XP} XP
          </p>
        </div>
        {loadingQuests && (
          <p className="text-sm text-gray-500 px-1">Loading from Walrus…</p>
        )}
        {dailyQuests.map((quest) => (
          <PremiumCard
            key={quest.id}
            index={idx++}
            accentColor="#ff4444"
            className="p-0 overflow-hidden"
          >
            <DailyQuestPanel
              quest={quest}
              completed={questStatus[quest.id]?.completed ?? false}
              attempted={questStatus[quest.id]?.attempted ?? false}
              savedProof={getProofForQuest(progress, quest.id)}
              onSubmit={completeDaily}
            />
          </PremiumCard>
        ))}
      </div>

      <PremiumCardGrid className="grid items-stretch gap-6 md:grid-cols-2">
        <PremiumCard
          flush
          index={idx++}
          accentColor="#a78bfa"
          className="h-full min-h-0"
        >
          <WeeklyQuestPanel
            quest={WEEKLY_QUEST}
            dailyCount={weeklyDailyCount}
            unlocked={weeklyUnlocked}
            minted={progress.nftBadgeMinted}
            onMint={handleMint}
            mintFeeDfq={WEEKLY_QUEST.mintFeeDfq}
            contractsReady={contracts.configured && contracts.onTargetChain}
          />
        </PremiumCard>
        <PremiumCard
          flush
          index={idx++}
          accentColor="#fbbf24"
          className="h-full min-h-0"
        >
          <BonusQuestPanel
            quest={BONUS_QUEST}
            unlocked={bonusUnlocked}
            completed={progress.bonusCompleted}
            completedStakeAmount={progress.bonusStakeAmount}
            completedBonusXp={progress.bonusCompleted ? progress.bonusXp : undefined}
            season={seasonStatus}
            onStake={handleStake}
            contractsReady={contracts.configured && contracts.onTargetChain}
          />
        </PremiumCard>
      </PremiumCardGrid>
    </PremiumCardGrid>
  );
}
