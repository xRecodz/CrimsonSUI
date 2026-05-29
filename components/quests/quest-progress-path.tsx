'use client';

import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuestProgressPathProps = {
  dailyCompletedToday: number;
  questsPerDay: number;
  weeklyDailyCount: number;
  weeklyRequired: number;
  weeklyUnlocked: boolean;
  badgeMinted: boolean;
  bonusUnlocked: boolean;
  bonusCompleted: boolean;
};

export function QuestProgressPath({
  dailyCompletedToday,
  questsPerDay,
  weeklyDailyCount,
  weeklyRequired,
  weeklyUnlocked,
  badgeMinted,
  bonusUnlocked,
  bonusCompleted,
}: QuestProgressPathProps) {
  const steps = [
    {
      label: 'Daily quests',
      detail: `${dailyCompletedToday}/${questsPerDay} today · ${weeklyDailyCount}/${weeklyRequired} this week for weekly`,
      done: weeklyUnlocked,
      active: !weeklyUnlocked,
    },
    {
      label: 'Weekly — Mint badge',
      detail: badgeMinted
        ? 'Badge unlocked'
        : weeklyUnlocked
          ? 'Ready — record badge proof on Walrus'
          : `Need ${weeklyRequired - weeklyDailyCount} more daily completions`,
      done: badgeMinted,
      active: weeklyUnlocked && !badgeMinted,
    },
    {
      label: 'Bonus — Stake on-chain',
      detail: bonusCompleted
        ? 'Staking quest done'
        : bonusUnlocked
          ? 'Stake ≥10 on-chain'
          : 'Unlock after badge mint',
      done: bonusCompleted,
      active: bonusUnlocked && !bonusCompleted,
    },
  ];

  return (
    <div className="p-1 sm:p-2">
      <p className="mb-4 text-sm font-medium text-white">Quest path</p>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={step.label} className="flex gap-3">
            <div className="mt-0.5 shrink-0">
              {step.done ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : step.active ? (
                <Circle className="h-5 w-5 text-accent animate-pulse" />
              ) : (
                <Lock className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div>
              <p
                className={cn(
                  'font-medium',
                  step.done ? 'text-green-400' : step.active ? 'text-white' : 'text-gray-500',
                )}
              >
                {i + 1}. {step.label}
              </p>
              <p className="text-sm text-gray-500">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
