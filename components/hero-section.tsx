'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import BlurText from '@/components/react-bits/blur-text';
import ShinyText from '@/components/react-bits/shiny-text';
import Particles from '@/components/react-bits/particles';
import CountUp from '@/components/react-bits/count-up';
import Magnet from '@/components/react-bits/magnet';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import {
  LandingStatCard,
  LandingStatGridHero,
} from '@/components/landing/landing-stat-card';
import { usePlatformStats } from '@/hooks/use-platform-stats';
import { useWalletBadgeCount } from '@/hooks/use-wallet-badge-count';
import { DAILY_QUESTS_PER_DAY, DAILY_XP } from '@/lib/quest-engine';

export function HeroSection() {
  const { stats, loading: statsLoading } = usePlatformStats();
  const walletBadges = useWalletBadgeCount();

  const badgesMinted = stats?.badgesMinted ?? 0;
  const dailyQuests = stats?.dailyQuestsPerDay ?? DAILY_QUESTS_PER_DAY;
  const maxDailyXp = stats?.maxDailyXp ?? DAILY_QUESTS_PER_DAY * DAILY_XP;
  const poolSize = stats?.questPoolSize ?? 12;

  const statCards = [
    {
      key: 'total-badges',
      label: 'Total Badges Minted',
      hint: stats?.badgesMintedLive
        ? `On-chain · ${stats.chain} · BadgeRegistry`
        : 'Reading on-chain registry…',
      live: stats?.badgesMintedLive,
      value:
        statsLoading && stats?.badgesMintedLive !== false ? (
          <span className="text-gray-600">…</span>
        ) : (
          <CountUp to={badgesMinted} duration={1.8} separator="," />
        ),
    },
    {
      key: 'your-badges',
      label: 'Your Badge NFTs',
      hint: walletBadges.connected
        ? walletBadges.loading
          ? 'Loading QuestBadge objects…'
          : 'Owned by your connected wallet'
        : 'Connect Sui wallet to see yours',
      live: walletBadges.connected && walletBadges.configured && !walletBadges.loading,
      value: !walletBadges.connected ? (
        <span className="text-xl font-semibold text-gray-500">—</span>
      ) : walletBadges.loading ? (
        <span className="text-gray-600">…</span>
      ) : (
        <CountUp to={walletBadges.count} duration={1.2} separator="," />
      ),
    },
    {
      key: 'daily-quests',
      label: 'Daily Quests',
      hint: `${poolSize} topics · Walrus quest pool`,
      live: false,
      value: <CountUp to={dailyQuests} duration={1.8} separator="," />,
    },
    {
      key: 'max-xp',
      label: 'Max Daily XP',
      hint: `+${DAILY_XP} XP per correct answer`,
      live: false,
      value: <CountUp to={maxDailyXp} duration={1.8} separator="," />,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-background pt-20">
      <div className="absolute inset-0">
        <Particles
          particleColors={['#ff0000', '#ff3333', '#ffffff', '#991111']}
          particleCount={50000}
          particleSpread={10}
          speed={0.08}
          particleBaseSize={80}
          alphaParticles
          moveParticlesOnHover
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      <div className="absolute inset-0 opacity-[0.07]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.08) 25%, rgba(255, 0, 0, 0.08) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.08) 75%, rgba(255, 0, 0, 0.08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, 0.08) 25%, rgba(255, 0, 0, 0.08) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.08) 75%, rgba(255, 0, 0, 0.08) 76%, transparent 77%, transparent)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl flex-col items-center justify-center text-center sm:min-h-[calc(100vh-5rem)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Learn DeFi and Get Earn
            </span>
          </motion.div>

          <h1 className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            <BlurText
              as="span"
              text="Complete Quest."
              className="justify-center text-5xl sm:text-6xl lg:text-7xl font-bold text-white"
              delay={40}
            />
            <span className="block mt-2">
              <ShinyText
                text="Earn XP."
                className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                color="#ff0000"
                shineColor="#ffffff"
                speed={2.5}
              />
            </span>
            <BlurText
              as="span"
              text="Rank Up."
              className="justify-center text-5xl sm:text-6xl lg:text-7xl font-bold text-white mt-2"
              delay={50}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mx-auto mb-12 max-w-2xl text-lg sm:text-xl text-gray-400"
          >
            Wallet-linked DeFi quests. Earn XP and climb the leaderboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Magnet magnetStrength={2.5}>
              <ConnectWalletButton variant="hero" />
            </Magnet>
            <Magnet magnetStrength={2.5}>
              <Link
                href="/quests"
                className="px-8 py-4 text-lg font-semibold text-white rounded-lg border border-white/20 hover:border-accent hover:text-accent transition-all duration-300 hover:bg-accent/5 backdrop-blur-sm"
              >
                Explore Quests
              </Link>
            </Magnet>
          </motion.div>

          <LandingStatGridHero className="mt-5 grid w-full max-w-5xl grid-cols-1 gap-4 sm:mt-15 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <LandingStatCard
                key={stat.key}
                label={stat.label}
                hint={stat.hint}
                live={stat.live}
                value={stat.value}
              />
            ))}
          </LandingStatGridHero>
        </motion.div>
      </div>
    </section>
  );
}
