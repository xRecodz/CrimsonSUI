'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { BRAND_NAME } from '@/lib/brand';
import { cn } from '@/lib/utils';

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
  createdAt: string;
};

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            'h-4 w-4',
            n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-600',
          )}
        />
      ))}
    </div>
  );
}

export function LandingFeedback() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch('/api/feedback?limit=3')
      .then((r) => r.json())
      .then((data: { summary: Summary; reviews: Review[] }) => {
        setSummary(data.summary);
        setReviews(data.reviews ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Community Feedback</h2>
            <p className="mt-2 text-gray-400">
              Real ratings from {BRAND_NAME} players
            </p>
          </div>
          {summary && summary.count > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center">
              <p className="text-3xl font-bold text-white">{summary.average}</p>
              <Stars value={Math.round(summary.average)} />
              <p className="mt-1 text-xs text-gray-500">
                {summary.count} review{summary.count === 1 ? '' : 's'}
              </p>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-gray-500">
            No reviews yet.{' '}
            <Link href="/feedback" className="text-accent hover:underline">
              Be the first to rate
            </Link>
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review, i) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white">{review.displayName}</span>
                  <Stars value={review.rating} />
                </div>
                <p className="line-clamp-3 text-sm text-gray-400">{review.message}</p>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/feedback"
            className="text-sm font-medium text-accent hover:underline"
          >
            View all reviews & leave feedback →
          </Link>
        </div>
      </div>
    </section>
  );
}
