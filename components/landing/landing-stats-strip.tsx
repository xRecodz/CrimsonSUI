'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { PlatformStats } from '@/lib/platform-stats';
import { CARD_EASE } from './card-motion';
import {
  LandingStatCard,
  LandingStatGrid,
  LandingStatSectionHeader,
} from './landing-stat-card';

type LeaderboardAgg = {
  totalXp: number;
  totalQuestsCompleted: number;
  onchainBadgesMinted: number;
  players: number;
};

export function LandingStatsStrip() {
  const reduceMotion = useReducedMotion();
  const [platform, setPlatform] = useState<PlatformStats | null>(null);
  const [agg, setAgg] = useState<LeaderboardAgg | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/leaderboard?limit=1').then((r) => r.json()),
    ])
      .then(([stats, lb]) => {
        setPlatform(stats);
        setAgg(lb.aggregates ?? null);
      })
      .catch(() => {});
  }, []);

  const items = [
    {
      label: 'Players',
      value: agg?.players ?? '—',
      hint: 'Wallets on the leaderboard',
    },
    {
      label: 'Total XP earned',
      value: agg?.totalXp != null ? agg.totalXp.toLocaleString() : '—',
      hint: 'Daily, weekly & bonus combined',
    },
    {
      label: 'Quests completed',
      value: agg?.totalQuestsCompleted ?? '—',
      hint: 'All quest types',
    },
    {
      label: 'NFTs minted (Sui)',
      value: platform?.badgesMintedLive
        ? platform.badgesMinted
        : (agg?.onchainBadgesMinted ?? '—'),
      hint: platform?.badgesMintedLive
        ? `Live on ${platform.chain}`
        : 'On-chain badge count',
      live: platform?.badgesMintedLive,
    },
  ];

  return (
    <section className="border-t border-white/10 bg-background px-4 pb-12 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <LandingStatSectionHeader
          title="Community stats"
          description="Live totals from players on Crimson"
          action={
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15, ease: CARD_EASE }}
            >
              <Link
                href="/leaderboard"
                className="text-sm font-semibold text-accent transition-colors hover:underline"
              >
                Full leaderboard →
              </Link>
            </motion.div>
          }
        />

        <LandingStatGrid className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <LandingStatCard
              key={item.label}
              label={item.label}
              value={item.value}
              hint={item.hint}
              live={item.live}
            />
          ))}
        </LandingStatGrid>
      </div>
    </section>
  );
}
