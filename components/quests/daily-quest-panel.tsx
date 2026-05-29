'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Vote } from 'lucide-react';
import type { DailyQuest, QuestSubmitResult, WalrusProofRecord } from '@/lib/quest-types';
import { cn } from '@/lib/utils';
import { WalrusProofLink } from './walrus-proof-viewer';

type DailyQuestPanelProps = {
  quest: DailyQuest;
  completed: boolean;
  attempted: boolean;
  savedProof?: WalrusProofRecord;
  onSubmit: (
    questId: string,
    optionId: string,
  ) => Promise<QuestSubmitResult | null>;
};

export function DailyQuestPanel({
  quest,
  completed,
  attempted,
  savedProof,
  onSubmit,
}: DailyQuestPanelProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastProof, setLastProof] = useState<{
    blobId: string;
    gatewayUrl?: string;
  } | null>(null);

  const locked = completed || attempted || result !== null;
  const displayProof =
    lastProof ??
    (savedProof
      ? { blobId: savedProof.blobId, gatewayUrl: savedProof.gatewayUrl }
      : null);

  const handleSubmit = async () => {
    if (!selected || locked) return;
    setSubmitting(true);
    const res = await onSubmit(quest.id, selected);
    setSubmitting(false);
    if (res) {
      setResult(res.correct ? 'correct' : 'wrong');
      if (res.blobId) {
        setLastProof({ blobId: res.blobId, gatewayUrl: res.gatewayUrl });
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Vote className="h-3.5 w-3.5" />
            Daily #{quest.slot + 1} · {quest.type === 'vote' ? 'Voting' : 'Quiz'}
          </span>
          <h3 className="mt-3 text-2xl font-bold text-white">{quest.title}</h3>
          <p className="mt-2 text-sm text-gray-500">
            Wallet-personalized · {quest.dateKey} · +{quest.xpReward} XP
          </p>
        </div>
        {completed && (
          <span className="inline-flex items-center gap-1 text-sm text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            Done
          </span>
        )}
        {attempted && !completed && (
          <span className="text-sm text-amber-400">Attempted</span>
        )}
      </div>

      <p className="mb-6 text-lg text-gray-200">{quest.question}</p>

      <div className="space-y-3">
        {quest.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={locked}
            onClick={() => setSelected(option.id)}
            className={cn(
              'w-full rounded-lg border px-4 py-3 text-left text-sm transition-all',
              selected === option.id
                ? 'border-accent bg-accent/10 text-white'
                : 'border-white/10 bg-black/20 text-gray-300 hover:border-white/30',
              locked && 'opacity-60 cursor-not-allowed',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {!locked && (
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={!selected || submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white disabled:opacity-40"
        >
          {submitting ? 'Uploading proof to Walrus…' : 'Submit Answer'}
        </motion.button>
      )}

      {result === 'correct' && (
        <p className="mt-4 text-sm text-green-400">
          Correct! +{quest.xpReward} XP added. Try your other daily quests for more XP.
        </p>
      )}
      {result === 'wrong' && (
        <p className="mt-4 text-sm text-amber-400">
          Incorrect. This quest is closed—complete your other dailies today.
        </p>
      )}

      {displayProof && (attempted || completed || result !== null) && (
        <WalrusProofLink
          blobId={displayProof.blobId}
          gatewayUrl={displayProof.gatewayUrl}
        />
      )}
    </motion.section>
  );
}
