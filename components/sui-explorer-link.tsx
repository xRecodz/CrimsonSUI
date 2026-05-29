'use client';

import { ExternalLink } from 'lucide-react';
import { suiscanAccountUrl, suiscanTxUrl } from '@/lib/sui/explorer';
import { cn } from '@/lib/utils';

type SuiExplorerLinkProps = {
  href: string;
  label: string;
  className?: string;
};

function SuiExplorerLink({ href, label, className }: SuiExplorerLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-gray-300 transition-colors hover:border-accent/40 hover:text-accent',
        className,
      )}
    >
      {label}
      <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
    </a>
  );
}

export function SuiscanTxLink({
  digest,
  className,
  label = 'View tx on Suiscan',
}: {
  digest: string;
  className?: string;
  label?: string;
}) {
  return (
    <SuiExplorerLink href={suiscanTxUrl(digest)} label={label} className={className} />
  );
}

export function SuiscanAccountLink({
  address,
  className,
  label = 'Wallet on Suiscan',
}: {
  address: string;
  className?: string;
  label?: string;
}) {
  return (
    <SuiExplorerLink
      href={suiscanAccountUrl(address)}
      label={label}
      className={className}
    />
  );
}
