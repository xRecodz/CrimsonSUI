import { NextResponse } from 'next/server';
import {
  addFeedback,
  readFeedback,
  summarizeFeedback,
} from '@/lib/server/feedback-store';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50);

  const rows = await readFeedback();
  const summary = summarizeFeedback(rows);

  return NextResponse.json({
    reviews: rows.slice(0, limit),
    summary,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      displayName?: string;
      rating?: number;
      message?: string;
      wallet?: string;
    };

    const rating = Math.round(Number(body.rating));
    const message = (body.message ?? '').trim();
    const displayName = (body.displayName ?? 'Anonymous').trim().slice(0, 40);

    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      );
    }

    const wallet = body.wallet?.toLowerCase();
    // Sui addresses are 32 bytes (0x + 64 hex). Accept legacy 20-byte format too for old data.
    if (wallet && !/^0x[a-f0-9]{40}$/.test(wallet) && !/^0x[a-f0-9]{64}$/.test(wallet)) {
      return NextResponse.json({ error: 'invalid wallet' }, { status: 400 });
    }

    const rows = await addFeedback({
      displayName: displayName || 'Anonymous',
      rating,
      message: message.slice(0, 500),
      wallet,
    });

    const summary = summarizeFeedback(rows);

    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
