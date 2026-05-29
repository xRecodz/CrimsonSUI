import { PageShell } from '@/components/layout/page-shell';
import { FeedbackPage } from '@/components/feedback/feedback-page';
import { BRAND_NAME } from '@/lib/brand';

export default function FeedbackRoute() {
  return (
    <PageShell
      title="Feedback"
      description={`Rate your ${BRAND_NAME} experience — 1 to 5 stars, averaged across all reviews.`}
      maxWidth="md"
    >
      <FeedbackPage />
    </PageShell>
  );
}
