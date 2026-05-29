'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PremiumCard, PremiumCardGrid } from '@/components/landing/premium-card';

type Summary = {
  count: number;
  average: number;
  distribution: Record<string, number>;
};

type Review = {
  id: string;
  displayName: string;
  rating: number;
  message: string;
  wallet?: string;
  createdAt: string;
};

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="rounded p-1 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              'h-8 w-8',
              n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-600',
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function FeedbackPage() {
  const account = useCurrentAccount();
  const address = account?.address;
  const [summary, setSummary] = useState<Summary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch('/api/feedback?limit=20')
      .then((r) => r.json())
      .then((data: { summary: Summary; reviews: Review[] }) => {
        setSummary(data.summary);
        setReviews(data.reviews ?? []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          rating,
          message,
          wallet: address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setSummary(data.summary);
      setMessage('');
      setStatus('Thank you! Your review was submitted.');
      load();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  let cardIndex = 0;

  return (
    <PremiumCardGrid className="flex flex-col gap-5">
      {summary && summary.count > 0 && (
        <PremiumCard index={cardIndex++} accentColor="#fbbf24" className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="text-center sm:text-left">
              <p className="text-5xl font-bold text-white">{summary.average}</p>
              <p className="text-sm text-gray-500">
                out of 5 · {summary.count} reviews
              </p>
            </div>
            <div className="space-y-2">
              {([5, 4, 3, 2, 1] as const).map((stars) => {
                const count =
                  summary.distribution[stars] ??
                  summary.distribution[String(stars) as '1'] ??
                  0;
                const pct = summary.count ? (count / summary.count) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-sm">
                    <span className="w-8 text-gray-500">{stars}★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-amber-400/80 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </PremiumCard>
      )}

      <PremiumCard index={cardIndex++} accentColor="#ff4444" className="p-6">
        <form onSubmit={submit} className="space-y-5">
          <h2 className="text-lg font-semibold text-white">Leave a review</h2>
          <div>
            <p className="mb-2 text-sm text-gray-400">Your rating</p>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-400">Display name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Anonymous"
              className="border-white/10 bg-black/40 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-400">Review</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did you like about the quests, XP, or on-chain mint?"
              rows={4}
              className="border-white/10 bg-black/40 text-white"
              required
              minLength={10}
            />
          </div>
          {status && (
            <p
              className={cn(
                'text-sm',
                status.includes('Thank') ? 'text-green-400' : 'text-amber-400',
              )}
            >
              {status}
            </p>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent/90"
          >
            {submitting ? 'Submitting…' : 'Submit feedback'}
          </Button>
        </form>
      </PremiumCard>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white px-1">All reviews</h2>
        {reviews.length === 0 ? (
          <PremiumCard index={cardIndex} accentColor="#666" className="p-8 text-center">
            <p className="text-gray-500">No reviews yet. Be the first above.</p>
          </PremiumCard>
        ) : (
          reviews.map((review) => (
            <PremiumCard
              key={review.id}
              index={cardIndex++}
              accentColor="#a78bfa"
              className="p-4"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-white">{review.displayName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">{review.rating}/5</span>
                  <span className="text-xs text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400">{review.message}</p>
            </PremiumCard>
          ))
        )}
      </div>
    </PremiumCardGrid>
  );
}
