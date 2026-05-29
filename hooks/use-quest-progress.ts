'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  BONUS_QUEST,
  WEEKLY_QUEST,
  buildIpfsCid,
  countDailyCompletionsThisWeek,
  countDailyCompletionsToday,
  generateDailyQuestsFromPool,
  resolveDailyQuestCount,
  getDateKey,
  getWeekKey,
  isQuestAttempted,
  isQuestCompleted,
} from '@/lib/quest-engine';
import type { DailyQuest } from '@/lib/quest-types';
import {
  buildQuestMetadataPayload,
  loadProgress,
  saveProgress,
  uploadQuestProofToWalrus,
} from '@/lib/quest-storage';
import type { QuestSubmitResult, UserQuestProgress } from '@/lib/quest-types';
import { appendWalrusProof, isWalrusBlobId } from '@/lib/walrus/proof';
import { calculateBonusXp } from '@/lib/bonus-xp';
import { getSeasonStatus } from '@/lib/quest-season';

export function useQuestProgress() {
  const account = useCurrentAccount();
  const address = account?.address;
  const isConnected = !!account;
  const [progress, setProgress] = useState<UserQuestProgress | null>(null);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingQuests, setLoadingQuests] = useState(false);
  const [questsPerDay, setQuestsPerDay] = useState(
    resolveDailyQuestCount(48),
  );

  const dateKey = getDateKey();
  const weekKey = getWeekKey();
  const seasonStatus = useMemo(() => getSeasonStatus(), []);

  const refresh = useCallback(() => {
    if (!address) {
      setProgress(null);
      return;
    }
    setProgress(loadProgress(address));
  }, [address]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!address) {
      setDailyQuests([]);
      return;
    }

    let cancelled = false;
    setLoadingQuests(true);

    fetch(`/api/quests/daily?wallet=${encodeURIComponent(address)}&dateKey=${dateKey}`)
      .then((r) => r.json())
      .then((data: { quests: DailyQuest[]; questsPerDay?: number }) => {
        if (!cancelled) {
          setDailyQuests(data.quests ?? []);
          if (data.questsPerDay) setQuestsPerDay(data.questsPerDay);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDailyQuests(generateDailyQuestsFromPool(address, undefined, dateKey));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingQuests(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address, dateKey]);

  const weeklyDailyCount = progress
    ? countDailyCompletionsThisWeek(progress.dailyCompletedQuestIds, weekKey)
    : 0;

  const dailyCompletedToday = progress
    ? countDailyCompletionsToday(progress.dailyCompletedQuestIds, dateKey)
    : 0;

  const weeklyUnlocked = weeklyDailyCount >= WEEKLY_QUEST.requiredDailyCount;
  const bonusUnlocked = !!progress?.nftBadgeMinted;

  const completeDaily = useCallback(
    async (questId: string, optionId: string) => {
      if (!address || !progress) return null;

      const quest = dailyQuests.find((q) => q.id === questId);
      if (!quest) return null;

      if (isQuestCompleted(progress.dailyCompletedQuestIds, questId)) {
        setMessage('This quest is already completed.');
        return null;
      }

      if (isQuestAttempted(progress.dailyAttemptedQuestIds, questId)) {
        setMessage('You already attempted this quest.');
        return null;
      }

      const correct = optionId === quest.correctOptionId;
      const xpEarned = correct ? quest.xpReward : 0;

      const proofPayload = {
        questId: quest.id,
        optionId,
        correct,
        dateKey,
        slot: quest.slot,
        title: quest.title,
      };

      const walrusProof = await uploadQuestProofToWalrus(
        address,
        proofPayload,
        `daily-${quest.id}`,
      );

      const blobId =
        walrusProof?.blobId ??
        buildIpfsCid(
          JSON.stringify(buildQuestMetadataPayload(address, proofPayload)),
        );

      const attempted = [
        ...new Set([...progress.dailyAttemptedQuestIds, questId]),
      ];

      let next: UserQuestProgress = {
        ...progress,
        totalXp: progress.totalXp + xpEarned,
        dailyAttemptedQuestIds: attempted,
        dailyCompletedQuestIds: correct
          ? [...new Set([...progress.dailyCompletedQuestIds, questId])]
          : progress.dailyCompletedQuestIds,
        lastDailyAnswer: { dateKey, correct, xpEarned },
        ipfsProofCids: progress.ipfsProofCids,
      };

      if (isWalrusBlobId(blobId)) {
        next = appendWalrusProof(next, {
          blobId,
          questId: quest.id,
          label: `Daily — ${quest.title}`,
          gatewayUrl: walrusProof.gatewayUrl,
        });
      } else {
        next = {
          ...next,
          ipfsProofCids: [...next.ipfsProofCids, blobId],
        };
      }

      const saved = saveProgress(next);
      setProgress(saved);
      setMessage(
        correct
          ? walrusProof
            ? `Correct! +${xpEarned} XP. Proof stored on Walrus.`
            : `Correct! +${xpEarned} XP.`
          : walrusProof
            ? 'Incorrect. Proof stored on Walrus. Try your other dailies today.'
            : 'Incorrect. This quest is closed—you can try other dailies today.',
      );
      return {
        correct,
        xpEarned,
        blobId: isWalrusBlobId(blobId) ? blobId : undefined,
        gatewayUrl: walrusProof?.gatewayUrl,
      } satisfies QuestSubmitResult;
    },
    [address, progress, dailyQuests, dateKey],
  );

  const mintNftBadge = useCallback(
    async (onchainTokenUri?: string) => {
      if (!address || !progress) return null;

      if (!weeklyUnlocked) {
        setMessage(
          `Complete ${WEEKLY_QUEST.requiredDailyCount} daily quests this week first (${weeklyDailyCount}/${WEEKLY_QUEST.requiredDailyCount}).`,
        );
        return null;
      }

      if (progress.nftBadgeMinted) {
        setMessage('NFT Badge already minted.');
        return null;
      }

      const tokenUri = onchainTokenUri ?? WEEKLY_QUEST.badgeTokenUri;

      const walrusProof = await uploadQuestProofToWalrus(address, {
        questId: WEEKLY_QUEST.id,
        badge: WEEKLY_QUEST.badgeName,
        tokenUri,
      });

      const blobId =
        walrusProof?.blobId ??
        buildIpfsCid(
          JSON.stringify(
            buildQuestMetadataPayload(address, {
              questId: WEEKLY_QUEST.id,
              badge: WEEKLY_QUEST.badgeName,
              tokenUri,
            }),
          ),
        );

      let next: UserQuestProgress = {
        ...progress,
        nftBadgeMinted: true,
        badgeCount: progress.badgeCount + 1,
        weeklyCompleted: true,
        totalXp: progress.totalXp + WEEKLY_QUEST.xpReward,
        ipfsProofCids: progress.ipfsProofCids,
      };

      next = isWalrusBlobId(blobId)
        ? appendWalrusProof(next, {
            blobId,
            questId: WEEKLY_QUEST.id,
            label: `Weekly — ${WEEKLY_QUEST.badgeName}`,
            gatewayUrl: walrusProof?.gatewayUrl,
          })
        : { ...next, ipfsProofCids: [...next.ipfsProofCids, blobId] };

      const saved = saveProgress(next);
      setProgress(saved);
      setMessage(
        walrusProof
          ? `Badge recorded on Walrus! +${WEEKLY_QUEST.xpReward} XP.`
          : `Badge progress saved locally (+${WEEKLY_QUEST.xpReward} XP). Complete on-chain mint with DFQ fee.`,
      );
      return saved;
    },
    [address, progress, weeklyUnlocked, weeklyDailyCount],
  );

  const completeStakingQuest = useCallback(
    async (amount: number, onchainConfirmed = false) => {
      if (!address || !progress) return null;

      if (!bonusUnlocked) {
        setMessage('Mint the NFT Badge from weekly quest to unlock bonus quest.');
        return null;
      }

      if (progress.bonusCompleted) {
        setMessage('Bonus quest already completed.');
        return null;
      }

      if (!seasonStatus.active) {
        setMessage(seasonStatus.message);
        return null;
      }

      const xpEarned = calculateBonusXp(amount);
      if (xpEarned <= 0) {
        setMessage(
          `Stake at least ${BONUS_QUEST.requiredStakeAmount} ${BONUS_QUEST.stakeTokenSymbol} to earn Bonus XP.`,
        );
        return null;
      }

      if (!onchainConfirmed && amount < BONUS_QUEST.requiredStakeAmount) {
        setMessage(
          `Stake at least ${BONUS_QUEST.requiredStakeAmount} ${BONUS_QUEST.stakeTokenSymbol} on-chain.`,
        );
        return null;
      }

      const walrusProof = await uploadQuestProofToWalrus(address, {
        questId: BONUS_QUEST.id,
        staked: amount,
        token: BONUS_QUEST.stakeTokenSymbol,
        onchain: onchainConfirmed,
        bonusXpEarned: xpEarned,
      });

      const blobId =
        walrusProof?.blobId ??
        buildIpfsCid(
          JSON.stringify(
            buildQuestMetadataPayload(address, {
              questId: BONUS_QUEST.id,
              staked: amount,
              token: BONUS_QUEST.stakeTokenSymbol,
            }),
          ),
        );

      let next: UserQuestProgress = {
        ...progress,
        stakingCompleted: true,
        bonusCompleted: true,
        bonusStakeAmount: amount,
        bonusXp: progress.bonusXp + xpEarned,
        ipfsProofCids: progress.ipfsProofCids,
      };

      next = isWalrusBlobId(blobId)
        ? appendWalrusProof(next, {
            blobId,
            questId: BONUS_QUEST.id,
            label: 'Bonus — Staking',
            gatewayUrl: walrusProof?.gatewayUrl,
          })
        : { ...next, ipfsProofCids: [...next.ipfsProofCids, blobId] };

      const saved = saveProgress(next);
      setProgress(saved);
      setMessage(
        `Hidden quest complete! +${xpEarned.toLocaleString()} Bonus XP (${amount} ${BONUS_QUEST.stakeTokenSymbol} staked).`,
      );
      return saved;
    },
    [address, progress, bonusUnlocked, seasonStatus],
  );

  const clearMessage = useCallback(() => setMessage(null), []);

  const questStatus = useMemo(() => {
    if (!progress) return {};
    return Object.fromEntries(
      dailyQuests.map((q) => [
        q.id,
        {
          completed: isQuestCompleted(progress.dailyCompletedQuestIds, q.id),
          attempted: isQuestAttempted(progress.dailyAttemptedQuestIds, q.id),
        },
      ]),
    );
  }, [progress, dailyQuests]);

  return {
    address,
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
    weekKey,
    dateKey,
    completeDaily,
    mintNftBadge,
    completeStakingQuest,
    message,
    clearMessage,
    refresh,
    WEEKLY_QUEST,
    BONUS_QUEST,
    seasonStatus,
    calculateBonusXp,
  };
}
