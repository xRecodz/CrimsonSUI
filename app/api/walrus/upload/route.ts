import { NextResponse } from 'next/server';
import { storeJsonOnWalrus } from '@/lib/walrus/client';
import { buildQuestMetadataPayload } from '@/lib/quest-storage';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      wallet: string;
      quest: Record<string, unknown>;
      label?: string;
      sendObjectTo?: string;
    };

    if (!body.wallet || !body.quest) {
      return NextResponse.json(
        { error: 'wallet and quest are required' },
        { status: 400 },
      );
    }

    const payload = {
      ...buildQuestMetadataPayload(body.wallet, body.quest),
      storage: 'walrus',
      label: body.label ?? `crimson-quest-${String(body.quest.questId ?? 'proof')}`,
    };

    const result = await storeJsonOnWalrus(payload, {
      sendObjectTo: body.sendObjectTo,
    });

    return NextResponse.json({
      blobId: result.blobId,
      suiObjectId: result.suiObjectId,
      uri: `walrus://${result.blobId}`,
      gatewayUrl: result.gatewayUrl,
      endEpoch: result.endEpoch,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Walrus upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
