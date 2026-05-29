'use client';

import { motion } from 'framer-motion';
import { Lock, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type QuestPanelAccent = 'purple' | 'amber';

const accentConfig = {
  purple: {
    unlocked:
      'border-purple-500/40 bg-gradient-to-b from-purple-500/20 via-purple-500/12 to-purple-950/40',
    label: 'text-purple-300',
    icon: 'text-purple-400',
    dot: 'bg-purple-400',
    button: 'bg-purple-600 text-white hover:bg-purple-500',
  },
  amber: {
    unlocked:
      'border-yellow-500/40 bg-gradient-to-b from-yellow-500/20 via-yellow-500/12 to-yellow-950/30',
    label: 'text-yellow-300',
    icon: 'text-yellow-400',
    dot: 'bg-yellow-400',
    button: 'bg-yellow-500 text-black hover:bg-yellow-400',
  },
} as const;

export function questPanelShellClass(unlocked: boolean, accent: QuestPanelAccent) {
  return cn(
    'flex h-full min-h-0 w-full flex-1 flex-col rounded-xl border p-6 sm:p-8',
    unlocked
      ? accentConfig[accent].unlocked
      : 'border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.04]',
  );
}

type QuestPanelShellProps = {
  accent: QuestPanelAccent;
  unlocked: boolean;
  delay?: number;
  children: ReactNode;
};

export function QuestPanelShell({
  accent,
  unlocked,
  delay = 0.1,
  children,
}: QuestPanelShellProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={questPanelShellClass(unlocked, accent)}
      style={{ minHeight: '100%' }}
    >
      {children}
    </motion.section>
  );
}

type QuestPanelHeaderProps = {
  accent: QuestPanelAccent;
  icon: LucideIcon;
  label: string;
  locked: boolean;
};

export function QuestPanelHeader({
  accent,
  icon: Icon,
  label,
  locked,
}: QuestPanelHeaderProps) {
  const styles = accentConfig[accent];
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className={cn('h-5 w-5', styles.icon)} />
      <span className={cn('text-sm font-medium', styles.label)}>{label}</span>
      {locked && <Lock className="ml-auto h-4 w-4 text-gray-500" />}
    </div>
  );
}

type QuestPanelMetricProps = {
  label: string;
  value: string;
  children?: ReactNode;
};

export function QuestPanelMetric({ label, value, children }: QuestPanelMetricProps) {
  return (
    <div className="mt-6 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>
      {children}
    </div>
  );
}

type QuestPanelStepsProps = {
  accent: QuestPanelAccent;
  steps: string[];
};

export function QuestPanelSteps({ accent, steps }: QuestPanelStepsProps) {
  const dot = accentConfig[accent].dot;
  return (
    <ul className="mt-6 space-y-2 text-sm text-gray-300">
      {steps.map((step) => (
        <li key={step} className="flex items-center gap-2">
          <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dot)} />
          {step}
        </li>
      ))}
    </ul>
  );
}

export const questPanelInputClass =
  'border-white/20 bg-white/[0.08] text-white placeholder:text-gray-500 disabled:opacity-70';

type QuestPanelActionButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  accent: QuestPanelAccent;
  completed?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
};

export function QuestPanelActionButton({
  onClick,
  disabled = false,
  accent,
  completed = false,
  icon: Icon,
  children,
}: QuestPanelActionButtonProps) {
  const styles = accentConfig[accent];
  const active = !disabled && !completed;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || completed}
      whileHover={active ? { scale: 1.02 } : undefined}
      whileTap={active ? { scale: 0.98 } : undefined}
      className={cn(
        'mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-all',
        completed
          ? 'border border-green-500/30 bg-green-500/10 text-green-400'
          : active
            ? styles.button
            : 'cursor-not-allowed bg-white/5 text-gray-500',
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </motion.button>
  );
}
