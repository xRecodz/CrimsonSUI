'use client';

import { useCallback, useState } from 'react';
import { ChevronDown, ExternalLink, Loader2 } from 'lucide-react';
import type { WalrusProofRecord } from '@/lib/quest-types';
import { cn } from '@/lib/utils';

type WalrusProofViewerProps = {
  proofs: WalrusProofRecord[];
  className?: string;
};

type LoadedProof = {
  blobId: string;
  data: unknown;
  gatewayUrl: string;
};

export function WalrusProofViewer({ proofs, className }: WalrusProofViewerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    proofs.length === 1 ? proofs[0]?.blobId ?? null : null,
  );
  const [loaded, setLoaded] = useState<Record<string, LoadedProof>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<Record<string, string>>({});

  const loadProof = useCallback(
    async (proof: WalrusProofRecord) => {
      if (loaded[proof.blobId]) return;

      setLoadingId(proof.blobId);
      setErrorId((prev) => {
        const next = { ...prev };
        delete next[proof.blobId];
        return next;
      });

      try {
        const res = await fetch(
          `/api/walrus/blob?blobId=${encodeURIComponent(proof.blobId)}`,
        );
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error ?? 'Failed to load proof');
        }
        setLoaded((prev) => ({
          ...prev,
          [proof.blobId]: {
            blobId: proof.blobId,
            data: json.data,
            gatewayUrl: json.gatewayUrl ?? proof.gatewayUrl ?? '',
          },
        }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Load failed';
        setErrorId((prev) => ({ ...prev, [proof.blobId]: msg }));
      } finally {
        setLoadingId(null);
      }
    },
    [loaded],
  );

  const toggle = async (proof: WalrusProofRecord) => {
    const next = expandedId === proof.blobId ? null : proof.blobId;
    setExpandedId(next);
    if (next) await loadProof(proof);
  };

  if (proofs.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Complete a quest to store your first proof on Walrus.
      </p>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {proofs
        .slice()
        .reverse()
        .map((proof) => {
          const open = expandedId === proof.blobId;
          const isLoading = loadingId === proof.blobId;
          const err = errorId[proof.blobId];
          const data = loaded[proof.blobId];

          return (
            <div
              key={proof.blobId}
              className="overflow-hidden rounded-lg border border-white/10 bg-black/20"
            >
              <button
                type="button"
                onClick={() => void toggle(proof)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-white/[0.04]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {proof.label ?? proof.questId ?? 'Quest proof'}
                  </p>
                  <p className="truncate font-mono text-xs text-gray-500">
                    {proof.blobId}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-gray-500 transition-transform',
                    open && 'rotate-180',
                  )}
                />
              </button>

              {open && (
                <div className="border-t border-white/10 px-3 pb-3 pt-2">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <a
                      href={proof.gatewayUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-xs font-medium text-accent hover:bg-accent/20"
                    >
                      Open on Walrus
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => void navigator.clipboard.writeText(proof.blobId)}
                      className="rounded-md border border-white/10 px-2 py-1 text-xs text-gray-400 hover:text-white"
                    >
                      Copy blob ID
                    </button>
                  </div>

                  {isLoading && (
                    <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Reading JSON from Walrus aggregator…
                    </div>
                  )}

                  {err && !isLoading && (
                    <p className="text-sm text-red-400">{err}</p>
                  )}

                  {data && !isLoading && (
                    <pre className="max-h-64 overflow-auto rounded-md border border-white/10 bg-black/40 p-3 text-xs leading-relaxed text-gray-300">
                      {JSON.stringify(data.data, null, 2)}
                    </pre>
                  )}

                  {!data && !isLoading && !err && (
                    <button
                      type="button"
                      onClick={() => void loadProof(proof)}
                      className="text-sm text-accent hover:underline"
                    >
                      Load proof JSON
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

/** Compact proof link after quest submit. */
export function WalrusProofLink({
  blobId,
  gatewayUrl,
  className,
}: {
  blobId: string;
  gatewayUrl?: string;
  className?: string;
}) {
  const href =
    gatewayUrl ??
    `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline',
        className,
      )}
    >
      View proof on Walrus
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
