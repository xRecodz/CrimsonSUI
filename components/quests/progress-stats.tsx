'use client';

import { motion } from 'framer-motion';
import { Award, Flame, Shield, Zap } from 'lucide-react';
import { getTotalXp } from '@/lib/quest-engine';
import type { UserQuestProgress } from '@/lib/quest-types';

type ProgressStatsProps = {
  progress: UserQuestProgress;
  dailyCompletedToday: number;
  questsPerDay: number;
  weeklyDailyCount: number;
  weeklyRequired: number;
};

export function ProgressStats({
  progress,
  dailyCompletedToday,
  questsPerDay,
  weeklyDailyCount,
  weeklyRequired,
}: ProgressStatsProps) {
  const stats = [
    {
      icon: Zap,
      label: 'Total XP',
      value: getTotalXp(progress).toLocaleString(),
    },
    {
      icon: Shield,
      label: 'Dailies Today',
      value: `${dailyCompletedToday}/${questsPerDay}`,
    },
    {
      icon: Award,
      label: 'Weekly (dailies)',
      value: `${weeklyDailyCount}/${weeklyRequired}`,
    },
    {
      icon: Flame,
      label: 'Bonus XP',
      value: progress.bonusXp.toLocaleString(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
          >
            <Icon className="mb-3 h-5 w-5 text-accent" />
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        );
      })}
    </motion.div>
  );
}
