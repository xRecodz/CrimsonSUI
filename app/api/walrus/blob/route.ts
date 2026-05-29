import { NextResponse } from 'next/server';
import { readJsonFromWalrus, walrusBlobUrl } from '@/lib/walrus/client';
import { isWalrusBlobId } from '@/lib/walrus/proof';

export async function GET(request: Request) {
  const blobId = new URL(request.url).searchParams.get('blobId');

  if (!blobId) {
    return NextResponse.json({ error: 'blobId query required' }, { status: 400 });
  }

  if (!isWalrusBlobId(blobId)) {
    return NextResponse.json(
      { error: 'Not a Walrus blob (local fallback id)' },
      { status: 400 },
    );
  }

  try {
    const data = await readJsonFromWalrus(blobId);
    return NextResponse.json({
      blobId,
      gatewayUrl: walrusBlobUrl(blobId),
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Walrus read failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
