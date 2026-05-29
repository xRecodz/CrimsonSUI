'use client';

import { useEffect, useState } from 'react';
import {
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
  useSuiClientQuery,
} from '@mysten/dapp-kit';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

type ConnectWalletButtonProps = {
  label?: string;
  /** header = nav bar; hero = landing; cta = bottom CTA */
  variant?: 'header' | 'hero' | 'cta';
  className?: string;
};

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function connectedLabel(
  address: string,
  showBalance: boolean,
  displayBalance?: string,
): string {
  const short = truncateAddress(address);
  if (showBalance && displayBalance) {
    return `${short} · ${displayBalance}`;
  }
  return short;
}

const variantStyles = {
  header: {
    connect:
      'rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 hover:bg-accent/90 transition-colors',
    connected:
      'max-w-[10.5rem] truncate rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-white hover:border-white/25 hover:bg-white/10 transition-colors',
  },
  hero: {
    connect:
      'rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors',
    connected:
      'rounded-lg border border-accent/35 bg-accent/10 px-6 py-3 text-base font-semibold text-white hover:bg-accent/15 transition-colors',
  },
  cta: {
    connect:
      'inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/30 hover:bg-accent/90 transition-colors sm:px-10',
    connected:
      'inline-flex items-center justify-center rounded-lg border border-accent/35 bg-accent/10 px-6 py-3 text-base font-semibold text-white hover:bg-accent/15 transition-colors',
  },
} as const;

function ConnectTrigger({
  label,
  variant,
  className,
  ...buttonProps
}: {
  label: string;
  variant: 'header' | 'hero' | 'cta';
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<'button'>, 'children'>) {
  const v = variantStyles[variant];

  return (
    <button
      type="button"
      className={cn(v.connect, className)}
      {...buttonProps}
    >
      {variant === 'cta' ? (
        <>
          {label}
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function ConnectWalletButton({
  label = 'Connect Wallet',
  variant = 'hero',
  className,
}: ConnectWalletButtonProps) {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [mounted, setMounted] = useState(false);
  const v = variantStyles[variant];
  const showBalanceWhenConnected = variant === 'hero';

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: balance } = useSuiClientQuery(
    'getBalance',
    { owner: account?.address ?? '' },
    { enabled: mounted && !!account?.address && showBalanceWhenConnected },
  );

  const suiBalance = balance
    ? `${(Number(balance.totalBalance) / 1e9).toFixed(2)} SUI`
    : undefined;

  if (!mounted) {
    return (
      <div
        aria-hidden
        style={{ opacity: 0, pointerEvents: 'none', userSelect: 'none' }}
      >
        <button type="button" className={cn(v.connect, className)}>
          {label}
        </button>
      </div>
    );
  }

  if (!account) {
    return (
      <ConnectModal
        trigger={
          <ConnectTrigger label={label} variant={variant} className={className} />
        }
      />
    );
  }

  const displayLabel = connectedLabel(
    account.address,
    showBalanceWhenConnected,
    suiBalance,
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          title={account.address}
          className={cn(v.connected, className)}
        >
          {displayLabel}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[100] min-w-[12rem] rounded-lg border border-white/10 bg-[#141414] p-1 shadow-xl"
        >
          <DropdownMenu.Item
            className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-300 outline-none hover:bg-white/10 hover:text-white focus:bg-white/10"
            onSelect={() => void navigator.clipboard.writeText(account.address)}
          >
            Copy address
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
          <DropdownMenu.Item
            className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-400 outline-none hover:bg-red-500/10 focus:bg-red-500/10"
            onSelect={() => disconnect()}
          >
            Disconnect
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function useWalletAddress(): string | undefined {
  return useCurrentAccount()?.address;
}

export { truncateAddress };
