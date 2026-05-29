'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, RefreshCw } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { fetchLeaderboard } from '@/lib/leaderboard-data';
import { pushLocalLeaderboardToServer } from '@/lib/leaderboard-sync';
import type { LeaderboardEntry } from '@/lib/quest-types';
import FadeContent from '@/components/react-bits/fade-content';

function getRankIcon(rank: number) {
  if (rank === 1) return Trophy;
  if (rank <= 3) return Award;
  return Star;
}

export function Leaderboard() {
  const account = useCurrentAccount();
  const address = account?.address;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { entries: rows, total: count } = await fetchLeaderboard(address, 10);
    setEntries(rows);
    setTotal(count);
    setLoading(false);
  }, [address]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await pushLocalLeaderboardToServer();
      if (!cancelled) await load();
    })();

    return () => {
      cancelled = true;
    };
  }, [load]);

  const rowVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35 },
    },
  };

  return (
    <section
      id="leaderboard"
      className="relative w-full bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <FadeContent className="mb-10 text-center sm:mb-12">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Top Performers
          </h2>
          <p className="text-base text-gray-400 sm:text-lg">
            Real players ranked by total XP from quest progress—synced when you
            complete quests.
          </p>
          {total > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {total} wallet{total === 1 ? '' : 's'} on the board
            </p>
          )}
        </FadeContent>

        <motion.div
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="hidden grid-cols-5 gap-4 border-b border-white/10 bg-white/5 p-4 font-semibold text-xs uppercase tracking-wider text-gray-400 sm:grid sm:p-5">
            <div>Rank</div>
            <div>Wallet</div>
            <div className="text-right">XP</div>
            <div className="text-right">Badges</div>
            <div className="text-right">Status</div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Loading leaderboard…
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400">No players yet.</p>
              <p className="mt-2 text-sm text-gray-500">
                Be the first—connect wallet and complete a quest.
              </p>
            </div>
          ) : (
            <motion.div
              className="divide-y divide-white/5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {entries.map((entry) => {
                const IconComponent = getRankIcon(entry.rank);
                return (
                  <motion.div key={entry.wallet} variants={rowVariants}>
                    <div
                      className={`hidden items-center gap-4 p-5 transition-colors hover:bg-white/5 sm:grid sm:grid-cols-5 ${
                        entry.isYou ? 'bg-accent/5' : ''
                      }`}
                    >
                      <div className="font-bold text-accent">#{entry.rank}</div>
                      <div className="font-mono text-sm text-gray-300">
                        {entry.wallet.slice(0, 6)}…{entry.wallet.slice(-4)}
                        {entry.isYou && (
                          <span className="ml-2 text-xs text-accent">(you)</span>
                        )}
                      </div>
                      <div className="text-right font-semibold text-white">
                        {entry.xp.toLocaleString()}
                        <span className="ml-1 text-xs text-gray-500">XP</span>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex rounded-full bg-accent/10 px-2.5 py-0.5 text-sm font-semibold text-accent">
                          {entry.badges}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <IconComponent className="h-5 w-5 text-accent" />
                      </div>
                    </div>

                    <div
                      className={`p-4 sm:hidden ${entry.isYou ? 'bg-accent/5' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-accent">#{entry.rank}</span>
                        <span className="font-mono text-sm text-gray-300">
                          {entry.wallet.slice(0, 6)}…{entry.wallet.slice(-4)}
                          {entry.isYou && (
                            <span className="ml-1 text-accent">(you)</span>
                          )}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span>{entry.xp.toLocaleString()} XP</span>
                        <span className="text-accent">{entry.badges} badges</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link
            href="/quests"
            className="inline-block rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition-all hover:border-accent hover:bg-accent/5 hover:text-accent"
          >
            Start Quests & Earn XP
          </Link>
        </div>
      </div>
    </section>
  );
}
