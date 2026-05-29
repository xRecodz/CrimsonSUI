'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Medal, Target, Trophy, Layers } from 'lucide-react';
import ShinyText from '@/components/react-bits/shiny-text';
import {
  PremiumCard,
  PremiumCardGrid,
  PremiumSectionHeader,
} from '@/components/landing/premium-card';
import { CARD_STAGGER } from '@/components/landing/card-motion';
import {
  BONUS_QUEST,
  DAILY_XP,
  WEEKLY_QUEST,
} from '@/lib/quest-engine';

const badges = [
  {
    icon: Target,
    name: 'First Clear',
    rarity: 'Common',
    description: 'Answer your first daily quest correctly (+100 XP)',
    color: '#60A5FA',
    how: 'Complete any daily on /quests',
  },
  {
    icon: Layers,
    name: 'Weekly Ready',
    rarity: 'Rare',
    description: `Finish ${WEEKLY_QUEST.requiredDailyCount} daily quests in one week`,
    color: '#A78BFA',
    how: 'Unlocks the mint step',
  },
  {
    icon: Medal,
    name: WEEKLY_QUEST.badgeName,
    rarity: 'Epic',
    description: `On-chain Sui object · ${WEEKLY_QUEST.mintFeeDfq} DFQ mint fee · metadata on Walrus`,
    color: '#FBBF24',
    how: 'Mint after weekly progress',
  },
  {
    icon: Trophy,
    name: 'DFQ Staker',
    rarity: 'Legendary',
    description: `Stake ≥${BONUS_QUEST.requiredStakeAmount} ${BONUS_QUEST.stakeTokenSymbol} + complete bonus (+${BONUS_QUEST.xpReward} XP)`,
    color: '#FF4444',
    how: 'After Pioneer badge mint',
  },
] as const;

export function NFTBadges() {
  return (
    <section className="relative w-full overflow-hidden bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <PremiumSectionHeader
          title={
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              <ShinyText
                text="NFT Badges & Milestones"
                color="#ffffff"
                shineColor="#ff0000"
                speed={3}
              />
            </h2>
          }
          description="Progress from daily quizzes to an on-chain Pioneer badge and DFQ staking proof—all tied to your Sui wallet."
        />

        <PremiumCardGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <PremiumCard
                key={badge.name}
                index={index + 3}
                accentColor={badge.color}
                className="p-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <motion.div
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10"
                      style={{ boxShadow: `0 0 20px ${badge.color}22` }}
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    >
                      <Icon className="h-5 w-5" style={{ color: badge.color }} />
                    </motion.div>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        color: badge.color,
                        backgroundColor: `${badge.color}18`,
                      }}
                    >
                      {badge.rarity}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold leading-tight text-white">
                      {badge.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-snug text-gray-400">
                      {badge.description}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500">{badge.how}</p>
                </div>
              </PremiumCard>
            );
          })}
        </PremiumCardGrid>

        <motion.p
          className="mt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 3 * CARD_STAGGER + 0.4, duration: 0.5 }}
        >
          Pioneer badge is minted on-chain; other milestones are tracked in your quest
          progress (+{DAILY_XP} XP per daily).{' '}
          <Link href="/quests" className="text-accent hover:underline">
            Start earning →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
