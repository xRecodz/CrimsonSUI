'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Calendar, Crown, ArrowRight } from 'lucide-react';
import ShinyText from '@/components/react-bits/shiny-text';
import {
  PremiumCard,
  PremiumCardGrid,
  PremiumSectionHeader,
} from '@/components/landing/premium-card';
import {
  BONUS_QUEST,
  DAILY_QUESTS_PER_DAY,
  WEEKLY_QUEST,
} from '@/lib/quest-engine';

const quests = [
  {
    icon: Zap,
    title: 'Daily Quest',
    tag: 'Easy',
    items: ['Voting & DeFi quiz', `${DAILY_QUESTS_PER_DAY} unique quests / day`, '+100 XP per correct answer'],
    accent: '#ff4444',
    borderHover: 'group-hover:border-accent/40',
  },
  {
    icon: Calendar,
    title: 'Weekly Quest',
    tag: 'Medium',
    items: [
      `Complete ${WEEKLY_QUEST.requiredDailyCount} dailies / week`,
      'Record badge proof on Walrus',
      `+${WEEKLY_QUEST.xpReward} XP`,
    ],
    accent: '#a78bfa',
    borderHover: 'group-hover:border-purple-500/40',
  },
  {
    icon: Crown,
    title: 'Bonus Quest',
    tag: 'Hard',
    items: [
      `Stake ≥${BONUS_QUEST.requiredStakeAmount} ${BONUS_QUEST.stakeTokenSymbol} on-chain`,
      'Unlock after badge mint',
      `+${BONUS_QUEST.xpReward} bonus XP`,
    ],
    accent: '#fbbf24',
    borderHover: 'group-hover:border-yellow-500/40',
  },
];

export function QuestTypes() {
  return (
    <section
      id="quest-types"
      className="relative w-full bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <PremiumSectionHeader
          title={
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              <ShinyText
                text="Quest Types"
                color="#ffffff"
                shineColor="#ff0000"
                speed={3}
              />
            </h2>
          }
          description="Daily grind, weekly badge, on-chain bonus—three paths to learn DeFi and stack XP."
        />

        <PremiumCardGrid className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
          {quests.map((quest, index) => {
            const Icon = quest.icon;
            return (
              <PremiumCard
                key={quest.title}
                index={index}
                accentColor={quest.accent}
                className="p-5"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10"
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    >
                      <Icon className="h-5 w-5 text-accent" />
                    </motion.div>
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                      {quest.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{quest.title}</h3>

                  <ul className="space-y-2 text-sm leading-snug text-gray-400">
                    {quest.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/quests"
                    className={`inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 ${quest.borderHover}`}
                  >
                    View Details
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </PremiumCard>
            );
          })}
        </PremiumCardGrid>
      </div>
    </section>
  );
}
