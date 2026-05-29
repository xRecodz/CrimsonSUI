'use client';

import { Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SUI_FAUCET_URL = 'https://faucet.sui.io/';

type SuiFaucetButtonProps = {
  className?: string;
  /** full = block button; inline = compact link chip */
  variant?: 'full' | 'inline';
};

export function SuiFaucetButton({
  className,
  variant = 'full',
}: SuiFaucetButtonProps) {
  const base =
    variant === 'full'
      ? 'inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 py-2.5 text-sm font-medium text-white transition-colors hover:border-accent hover:text-accent'
      : 'inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-gray-300 hover:border-accent/40 hover:text-accent';

  return (
    <a
      href={SUI_FAUCET_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, className)}
    >
      <Droplets className={variant === 'full' ? 'h-4 w-4' : 'h-3.5 w-3.5'} aria-hidden />
      Sui testnet faucet
      <span aria-hidden>↗</span>
    </a>
  );
}
