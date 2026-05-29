'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Users, Zap, Target, Coins, Medal } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { fetchLeaderboard } from '@/lib/leaderboard-data';
import { pushLocalLeaderboardToServer } from '@/lib/leaderboard-sync';
import type { LeaderboardEntry } from '@/lib/quest-types';
import { PremiumCard, PremiumCardGrid } from '@/components/landing/premium-card';

type Aggregates = {
  players: number;
  totalXp: number;
  totalQuestsCompleted: number;
  totalBadgesClaimed: number;
  onchainBadgesMinted: number;
  dfqMintFeesEst: number;
};

const ACCENTS = ['#ff4444', '#a78bfa', '#fbbf24', '#22c55e', '#60a5fa'];

function getRankIcon(rank: number) {
  if (rank === 1) return Trophy;
  return Medal;
}

export function LeaderboardPage() {
  const account = useCurrentAccount();
  const address = account?.address;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [agg, setAgg] = useState<Aggregates | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { entries: rows, aggregates } = await fetchLeaderboard(address, 50);
    setEntries(rows);
    setAgg(aggregates ?? null);
    setLoading(false);
  }, [address]);

  useEffect(() => {
    (async () => {
      await pushLocalLeaderboardToServer();
      await load();
    })();
  }, [load]);

  const statCards = [
    {
      icon: Zap,
      label: 'Total XP earned',
      value: agg?.totalXp.toLocaleString() ?? '—',
      hint: 'Sum across all players',
    },
    {
      icon: Target,
      label: 'Quests completed',
      value: agg?.totalQuestsCompleted ?? '—',
      hint: 'Daily + weekly + bonus',
    },
    {
      icon: Medal,
      label: 'NFT badges claimed',
      value: agg?.onchainBadgesMinted ?? '—',
      hint: 'On-chain mints (Sui)',
    },
    {
      icon: Coins,
      label: 'DFQ mint fees (est.)',
      value: agg?.dfqMintFeesEst != null ? `${agg.dfqMintFeesEst} DFQ` : '—',
      hint: '50 DFQ × badges minted',
    },
    {
      icon: Users,
      label: 'Active players',
      value: agg?.players ?? '—',
      hint: 'Wallets on leaderboard',
    },
  ];

  return (
    <div className="space-y-6">
      <PremiumCardGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <PremiumCard
              key={card.label}
              index={i}
              accentColor={ACCENTS[i % ACCENTS.length]}
              className="p-4"
            >
              <Icon className="mb-2 h-5 w-5 text-accent" />
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-xs text-gray-600">{card.hint}</p>
            </PremiumCard>
          );
        })}
      </PremiumCardGrid>

      <PremiumCard index={5} accentColor="#ff4444" className="overflow-hidden p-0">
        <div className="hidden grid-cols-4 gap-4 border-b border-white/10 bg-white/5 p-4 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:grid">
          <div>Rank</div>
          <div>Wallet</div>
          <div className="text-right">XP</div>
          <div className="text-right">Badges</div>
        </div>

        {loading ? (
          <p className="p-10 text-center text-gray-500">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="p-10 text-center text-gray-500">
            No players yet.{' '}
            <Link href="/quests" className="text-accent hover:underline">
              Play quests
            </Link>
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {entries.map((entry) => {
              const Icon = getRankIcon(entry.rank);
              return (
                <div
                  key={entry.wallet}
                  className={`grid grid-cols-2 items-center gap-2 p-4 transition-colors hover:bg-white/[0.03] sm:grid-cols-4 sm:gap-4 ${
                    entry.isYou ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-accent">
                    <Icon className="hidden h-4 w-4 sm:block" />#{entry.rank}
                  </div>
                  <div className="col-span-2 font-mono text-sm text-gray-300 sm:col-span-1">
                    {entry.wallet.slice(0, 8)}…{entry.wallet.slice(-4)}
                    {entry.isYou && (
                      <span className="ml-2 text-xs text-accent">(you)</span>
                    )}
                  </div>
                  <div className="text-right font-semibold text-white">
                    {entry.xp.toLocaleString()} XP
                  </div>
                  <div className="text-right text-accent">{entry.badges}</div>
                </div>
              );
            })}
          </div>
        )}
      </PremiumCard>

      <div className="text-center">
        <Link
          href="/quests"
          className="inline-block rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:border-accent hover:text-accent"
        >
          Earn more XP
        </Link>
      </div>
    </div>
  );
}
