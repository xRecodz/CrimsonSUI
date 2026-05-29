'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { BRAND_NAME } from '@/lib/brand';
import { cn } from '@/lib/utils';

export const NAV_ITEMS = [
  { label: 'Quest', href: '/quests' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Feedback', href: '/feedback' },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/quests') return pathname === '/quests' || pathname.startsWith('/quests/');
  return pathname === href;
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 group">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="text-lg font-bold text-white transition-colors group-hover:text-accent">
            {BRAND_NAME}
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6 text-base">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative py-1 transition-colors',
                  active ? 'text-accent font-medium' : 'text-gray-400 hover:text-white',
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0">
          <ConnectWalletButton variant="header" label="Connect" />
        </div>
      </div>
    </motion.header>
  );
}
