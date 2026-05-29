import { PageShell } from '@/components/layout/page-shell';
import { LeaderboardPage } from '@/components/leaderboard/leaderboard-page';
import { BRAND_NAME } from '@/lib/brand';

export default function LeaderboardRoute() {
  return (
    <PageShell
      title="Leaderboard"
      description={`Live ${BRAND_NAME} stats — total XP, quests completed, and on-chain DFQ / NFT rewards.`}
      maxWidth="lg"
    >
      <LeaderboardPage />
    </PageShell>
  );
}
