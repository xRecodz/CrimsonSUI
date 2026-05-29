'use client';

import { PageShell } from '@/components/layout/page-shell';
import { QuestDashboard } from '@/components/quests/quest-dashboard';
import { BRAND_NAME } from '@/lib/brand';

export default function QuestsPage() {
  return (
    <PageShell
      title="Quests"
      description={`Daily quizzes, weekly badge mint, and DFQ staking — personalized for your wallet on ${BRAND_NAME}.`}
      maxWidth="xl"
    >
      <QuestDashboard />
    </PageShell>
  );
}
