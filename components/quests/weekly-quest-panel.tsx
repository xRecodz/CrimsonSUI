'use client';

import { Calendar, Medal } from 'lucide-react';
import type { WeeklyQuest } from '@/lib/quest-types';
import { Progress } from '@/components/ui/progress';
import {
  QuestPanelActionButton,
  QuestPanelHeader,
  QuestPanelMetric,
  QuestPanelShell,
  QuestPanelSteps,
} from './quest-panel-shared';

type WeeklyQuestPanelProps = {
  quest: WeeklyQuest;
  dailyCount: number;
  unlocked: boolean;
  minted: boolean;
  onMint: () => void | Promise<void>;
  mintFeeDfq?: number;
  contractsReady?: boolean;
};

export function WeeklyQuestPanel({
  quest,
  dailyCount,
  unlocked,
  minted,
  onMint,
  mintFeeDfq = 0,
  contractsReady = false,
}: WeeklyQuestPanelProps) {
  const progressPercent = Math.min(
    100,
    (dailyCount / quest.requiredDailyCount) * 100,
  );

  const steps = [
    `Complete ${quest.requiredDailyCount} daily quests this week`,
    contractsReady
      ? 'Mint QuestBadge on Sui (metadata on Walrus)'
      : 'Deploy contracts / connect wallet to mint on-chain',
    `Earn +${quest.xpReward} XP & unlock the bonus quest`,
  ];

  return (
    <QuestPanelShell accent="purple" unlocked={unlocked} delay={0.1}>
      <QuestPanelHeader
        accent="purple"
        icon={Calendar}
        label="Weekly Quest"
        locked={!unlocked}
      />

      <h3 className="text-xl font-bold text-white">{quest.title}</h3>
      <p className="mt-2 text-sm text-gray-400">{quest.description}</p>

      <QuestPanelMetric
        label="Daily quests this week"
        value={`${dailyCount}/${quest.requiredDailyCount}`}
      >
        <Progress value={progressPercent} className="h-2" />
      </QuestPanelMetric>

      <QuestPanelSteps accent="purple" steps={steps} />

      <div className="min-h-4 flex-1" aria-hidden />

      <QuestPanelActionButton
        accent="purple"
        onClick={onMint}
        disabled={!unlocked}
        completed={minted}
        icon={Medal}
      >
        {minted ? `${quest.badgeName} Minted` : `Mint ${quest.badgeName}`}
      </QuestPanelActionButton>
    </QuestPanelShell>
  );
}
