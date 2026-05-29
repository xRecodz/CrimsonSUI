'use client';

import { Wallet } from 'lucide-react';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { PremiumCard, PremiumCardGrid } from '@/components/landing/premium-card';
import { SuiFaucetButton } from '@/components/quests/sui-faucet-button';

export function WalletGate() {
  return (
    <PremiumCardGrid className="flex justify-center py-8">
      <PremiumCard index={0} accentColor="#ff4444" className="max-w-lg p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <Wallet className="h-8 w-8 text-accent" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-white">Connect Your Wallet</h2>
        <p className="mb-8 text-gray-400">
          Connect your Sui wallet to generate personalized daily, weekly, and bonus
          quests. Quest proofs are stored on Walrus.
        </p>
        <ConnectWalletButton variant="hero" />
        <p className="mt-6 mb-3 text-xs text-gray-500">
          Need SUI for gas? Open the official testnet faucet.
        </p>
        <SuiFaucetButton />
      </PremiumCard>
    </PremiumCardGrid>
  );
}
