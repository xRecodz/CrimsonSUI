'use client';

import ScrollVelocity from '@/components/react-bits/scroll-velocity';

export function ScrollMarquee() {
  return (
    <section className="relative border-y border-white/10 bg-black/50 py-4 overflow-hidden">
      <ScrollVelocity
        texts={[
          '◆ DECENTRALIZED FINANCE',
          '◆ WEB3 · ON-CHAIN EVERYTHING',
          '◆ CRYPTO YIELD & STAKING',
          '◆ ETHEREUM · BASE · POLYGON',
          '◆ SOLANA · ARBITRUM · OPTIMISM',
          '◆ SMART CONTRACTS & DAPPS',
          '◆ LIQUIDITY POOLS & AMMs',
          '◆ CROSS-CHAIN BRIDGES',
          '◆ DAO GOVERNANCE & VOTING',
          '◆ NFTs · TOKENS · WALLETS',
        ]}
        velocity={80}
        className="space-y-2 text-sm font-semibold tracking-widest text-gray-500 uppercase"
      />
    </section>
  );
}
