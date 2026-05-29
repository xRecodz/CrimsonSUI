'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { CARD_EASE, cardVariants, gridVariants, headerVariants } from './card-motion';
import { cn } from '@/lib/utils';

type LandingStatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  live?: boolean;
  className?: string;
};

export function LandingStatCard({
  label,
  value,
  hint,
  live = false,
  className,
}: LandingStatCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : cardVariants}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -4,
              transition: { duration: 0.28, ease: CARD_EASE },
            }
      }
      className={cn(
        'flex h-full min-h-[8.25rem] flex-col rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:min-h-[8.75rem] sm:p-6',
        'transition-[border-color,background-color] duration-300',
        'hover:border-accent/25 hover:bg-white/[0.06]',
        className,
      )}
    >
      <div className="mb-3 flex min-h-[1.25rem] items-start justify-between gap-2">
        <p className="text-left text-sm leading-snug text-gray-500">{label}</p>
        {live ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
            <span className="h-1 w-1 animate-pulse rounded-full bg-green-400" />
            Live
          </span>
        ) : (
          <span className="h-5 w-10 shrink-0" aria-hidden />
        )}
      </div>

      <div className="flex min-h-[2rem] items-center text-2xl font-bold tabular-nums text-white">
        {value}
      </div>

      <p
        className={cn(
          'mt-auto pt-3 text-left text-xs leading-relaxed text-gray-600',
          hint ? 'min-h-[2.5rem]' : 'min-h-0',
        )}
      >
        {hint ?? '\u00a0'}
      </p>
    </motion.div>
  );
}

type LandingStatGridProps = {
  children: ReactNode;
  className?: string;
};

/** Staggered scroll-in grid for stat cards (matches PremiumCardGrid). */
export function LandingStatGrid({ children, className }: LandingStatGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-50px' }}
      variants={reduceMotion ? undefined : gridVariants}
    >
      {children}
    </motion.div>
  );
}

type LandingStatSectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function LandingStatSectionHeader({
  title,
  description,
  action,
}: LandingStatSectionHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between"
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-40px' }}
      variants={reduceMotion ? undefined : headerVariants}
    >
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}

/** Hero stat row: animates on mount (above the fold). */
export function LandingStatGridHero({ children, className }: LandingStatGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion ? undefined : 'visible'}
      variants={reduceMotion ? undefined : gridVariants}
    >
      {children}
    </motion.div>
  );
}
