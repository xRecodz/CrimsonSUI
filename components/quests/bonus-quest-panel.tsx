'use client';

import { useMemo, useState } from 'react';
import { Crown } from 'lucide-react';
import type { BonusQuest } from '@/lib/quest-types';
import type { SeasonStatus } from '@/lib/quest-season';
import { formatSeasonRange } from '@/lib/quest-season';
import {
  BONUS_XP_BASE,
  calculateBonusXp,
  getBonusXpBreakdown,
  getBonusStakeXpCapDfq,
  getBonusXpPerDfqAboveMin,
} from '@/lib/bonus-xp';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  QuestPanelActionButton,
  QuestPanelHeader,
  QuestPanelMetric,
  QuestPanelShell,
  QuestPanelSteps,
  questPanelInputClass,
} from './quest-panel-shared';

type BonusQuestPanelProps = {
  quest: BonusQuest;
  unlocked: boolean;
  completed: boolean;
  completedStakeAmount?: number;
  completedBonusXp?: number;
  season: SeasonStatus;
  onStake: (amount: number) => void | Promise<void>;
  contractsReady?: boolean;
};

export function BonusQuestPanel({
  quest,
  unlocked,
  completed,
  completedStakeAmount,
  completedBonusXp,
  season,
  onStake,
  contractsReady = false,
}: BonusQuestPanelProps) {
  const [amount, setAmount] = useState(String(quest.requiredStakeAmount));
  const stakeNum = Number(amount) || 0;
  const previewXp = useMemo(() => calculateBonusXp(stakeNum), [stakeNum]);
  const breakdown = useMemo(() => getBonusXpBreakdown(stakeNum), [stakeNum]);

  const stakeProgress = Math.min(
    100,
    (stakeNum / quest.requiredStakeAmount) * 100,
  );

  const xpPerDfq = getBonusXpPerDfqAboveMin();
  const stakeCap = getBonusStakeXpCapDfq();

  const steps = [
    'Farm daily & weekly quests first — bonus is your endgame XP push',
    `Stake ${quest.requiredStakeAmount}+ ${quest.stakeTokenSymbol} on-chain (+${xpPerDfq} Bonus XP per extra stake unit, cap ${stakeCap})`,
    `Minimum reward +${BONUS_XP_BASE.toLocaleString()} Bonus XP at min stake`,
  ];

  const stakeLabel = contractsReady
    ? `${quest.stakeTokenSymbol} on-chain`
    : quest.stakeTokenSymbol;

  const seasonBanner = season.configured &&
    season.startAt &&
    season.endAt && (
      <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/90">
        <span className="font-medium text-amber-200">Season · </span>
        {formatSeasonRange(season.startAt, season.endAt)}
        <span className="text-amber-200/80"> · {season.message}</span>
      </p>
    );

  const canSubmit =
    unlocked && !completed && season.active && previewXp > 0;

  return (
    <QuestPanelShell accent="amber" unlocked={unlocked} delay={0.2}>
      <QuestPanelHeader
        accent="amber"
        icon={Crown}
        label="Hidden / Bonus Quest"
        locked={!unlocked}
      />

      <h3 className="text-xl font-bold text-white">{quest.title}</h3>
      <p className="mt-2 text-sm text-gray-400">{quest.description}</p>
      {seasonBanner}

      {!season.active && !completed && (
        <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-gray-400">
          {season.message}
        </p>
      )}

      <QuestPanelMetric
        label={completed ? 'Staked' : 'Stake requirement'}
        value={
          !unlocked
            ? `0/${quest.requiredStakeAmount} ${quest.stakeTokenSymbol}`
            : completed && completedStakeAmount != null
              ? `${completedStakeAmount} ${quest.stakeTokenSymbol}`
              : `${Math.min(stakeNum, quest.requiredStakeAmount)}/${quest.requiredStakeAmount}+ ${quest.stakeTokenSymbol}`
        }
      >
        <Progress
          value={!unlocked ? 0 : completed ? 100 : stakeProgress}
          className="h-2"
        />
      </QuestPanelMetric>

      <QuestPanelSteps accent="amber" steps={steps} />

      {!unlocked && <div className="min-h-4 flex-1" aria-hidden />}

      {unlocked && !completed && (
        <div className="mt-6 space-y-3">
          <label className="mb-2 block text-sm text-gray-400">
            Stake amount ({stakeLabel})
          </label>
          <Input
            type="number"
            min={quest.requiredStakeAmount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={questPanelInputClass}
          />
          <div className="rounded-lg border border-yellow-500/25 bg-yellow-500/10 px-3 py-2.5">
            <p className="text-sm font-semibold text-yellow-100">
              Estimated reward: +{previewXp.toLocaleString()} Bonus XP
            </p>
            <p className="mt-1 text-xs text-yellow-200/70">
              Base {breakdown.baseXp.toLocaleString()} +{' '}
              {breakdown.scaledXp.toLocaleString()} scaling
              {breakdown.hitCap
                ? ` (cap ${stakeCap} for XP calculation)`
                : ''}
            </p>
          </div>
        </div>
      )}

      {completed && completedBonusXp != null && (
        <p className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300">
          Earned +{completedBonusXp.toLocaleString()} Bonus XP
          {completedStakeAmount != null
            ? ` · ${completedStakeAmount} ${quest.stakeTokenSymbol} staked`
            : ''}
        </p>
      )}

      {unlocked && <div className="min-h-2 flex-1" aria-hidden />}

      <QuestPanelActionButton
        accent="amber"
        onClick={() => onStake(stakeNum)}
        disabled={!canSubmit}
        completed={completed}
        icon={Crown}
      >
        {completed
          ? 'Staking Quest Completed'
          : !season.active
            ? 'Season inactive'
            : previewXp <= 0
              ? 'Enter stake amount'
              : `Stake & earn +${previewXp.toLocaleString()} XP`}
      </QuestPanelActionButton>
    </QuestPanelShell>
  );
}
