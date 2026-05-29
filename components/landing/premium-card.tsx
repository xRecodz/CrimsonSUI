'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  CARD_DURATION,
  CARD_EASE,
  CARD_STAGGER,
  headerVariants,
} from './card-motion';
import { cn } from '@/lib/utils';

type PremiumCardProps = {
  children: ReactNode;
  index: number;
  accentColor?: string;
  /** Fills parent height; transparent shell for nested full-bleed panels (e.g. quest cards). */
  flush?: boolean;
  className?: string;
};

export function PremiumCard({
  children,
  index,
  accentColor = '#ff0000',
  flush = false,
  className,
}: PremiumCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={
        reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }
      }
      animate={
        reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: CARD_DURATION,
              delay: index * CARD_STAGGER,
              ease: CARD_EASE,
            }
      }
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -5,
              transition: { duration: 0.28, ease: CARD_EASE },
            }
      }
      className={cn(
        'group relative overflow-hidden rounded-xl',
        flush
          ? 'flex min-h-0 flex-col border-0 bg-transparent shadow-none'
          : cn(
              'border border-white/10 bg-white/[0.04] backdrop-blur-sm',
              'transition-[border-color,background-color] duration-300',
              'hover:border-white/20 hover:bg-white/[0.06]',
            ),
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${accentColor}14, transparent 65%)`,
        }}
      />

      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${accentColor}40, transparent 40%, transparent 60%, ${accentColor}25)`,
          }}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.35,
          }}
        />
      )}

      {!reduceMotion && (
        <motion.div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <motion.div
            className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
            initial={{ x: '-120%' }}
            whileInView={{ x: '220%' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 1.1,
              delay: 0.15 + index * 0.12,
              ease: CARD_EASE,
            }}
          />
        </motion.div>
      )}

      <div
        className={cn(
          'relative z-[1]',
          flush && 'flex min-h-0 flex-1 flex-col',
        )}
      >
        {children}
      </div>
    </motion.article>
  );
}

type PremiumCardGridProps = {
  children: ReactNode;
  className?: string;
};

export function PremiumCardGrid({ children, className }: PremiumCardGridProps) {
  return <div className={className}>{children}</div>;
}

type PremiumSectionHeaderProps = {
  title: ReactNode;
  description: string;
  className?: string;
};

export function PremiumSectionHeader({
  title,
  description,
  className,
}: PremiumSectionHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn('mb-10 text-center sm:mb-12', className)}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-40px' }}
      variants={reduceMotion ? undefined : headerVariants}
    >
      <div className="mb-3">{title}</div>
      <p className="mx-auto max-w-xl text-base text-gray-400 sm:text-lg">{description}</p>
    </motion.div>
  );
}
