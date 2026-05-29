'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { BRAND_NAME } from '@/lib/brand';

export function QuestHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="font-semibold text-white">{BRAND_NAME}</span>
          </div>
        </div>
        <ConnectWalletButton variant="hero" className="!px-5 !py-2.5 !text-sm" />
      </div>
    </header>
  );
}
