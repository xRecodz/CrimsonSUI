import { NextResponse } from 'next/server';
import {
  getActiveNetwork,
  getPublicSuiRpcUrl,
  getSuiRpcUrl,
  getTatumApiKey,
} from '@/lib/sui/network';

function isRateLimitedRpcResponse(status: number, bodyText: string): boolean {
  if (status === 429 || status >= 500) return true;
  try {
    const json = JSON.parse(bodyText) as {
      error?: { code?: number; message?: string };
    };
    const msg = json.error?.message?.toLowerCase() ?? '';
    if (
      msg.includes('too many requests') ||
      msg.includes('rate limit') ||
      msg.includes('upstream')
    ) {
      return true;
    }
    // Tatum gateway rate limit code observed in the wild
    if (json.error?.code === -16429) return true;
  } catch {
    // non-JSON body
  }
  return false;
}

async function forwardRpc(url: string, body: string, apiKey?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers['x-api-key'] = apiKey;

  const res = await fetch(url, { method: 'POST', headers, body });
  const text = await res.text();
  return { res, text };
}

/** Proxy JSON-RPC to Tatum; falls back to public fullnode on rate limits. */
export async function POST(request: Request) {
  try {
    const network = getActiveNetwork();
    const body = await request.text();

    const primary = await forwardRpc(
      getSuiRpcUrl(network),
      body,
      getTatumApiKey(network),
    );

    if (!isRateLimitedRpcResponse(primary.res.status, primary.text)) {
      return new NextResponse(primary.text, {
        status: primary.res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fallback = await forwardRpc(getPublicSuiRpcUrl(network), body);
    return new NextResponse(fallback.text, {
      status: fallback.res.status,
      headers: {
        'Content-Type': 'application/json',
        'X-Sui-Rpc-Fallback': 'public-fullnode',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'RPC proxy error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
