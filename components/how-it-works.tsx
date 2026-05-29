'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, Sparkles, Award, Unlock, ArrowRight } from 'lucide-react';
import { PremiumCard, PremiumCardGrid, PremiumSectionHeader } from '@/components/landing/premium-card';

const steps = [
  {
    icon: Wallet,
    title: 'Connect Wallet',
    description: 'Connect your Sui wallet (testnet)',
    accent: '#ff4444',
  },
  {
    icon: Sparkles,
    title: 'Receive Quests',
    description: 'Personalized daily quests with proofs on Walrus',
    accent: '#a78bfa',
  },
  {
    icon: Award,
    title: 'Earn Rewards',
    description: 'XP, leaderboard rank, NFT badge',
    accent: '#fbbf24',
  },
  {
    icon: Unlock,
    title: 'Bonus Stake',
    description: 'Stake DFQ after minting badge',
    accent: '#22c55e',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative w-full bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <PremiumSectionHeader
          title={
            <h2 className="text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
          }
          description="Four steps from wallet connect to on-chain proof"
        />

        <PremiumCardGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <PremiumCard
                key={step.title}
                index={index}
                accentColor={step.accent}
                className="p-5"
              >
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-bold text-accent">Step {index + 1}</span>
                  <Icon className="h-7 w-7 text-white" />
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </PremiumCard>
            );
          })}
        </PremiumCardGrid>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-12 flex flex-col items-center gap-4 text-center"
        >
          <p className="max-w-lg text-gray-400">
            Earn XP and mint your Pioneer badge onchain.
          </p>
          <Link
            href="/quests"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start Quests
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm text-gray-500 hover:text-accent transition-colors"
          >
            View leaderboard & global stats →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
