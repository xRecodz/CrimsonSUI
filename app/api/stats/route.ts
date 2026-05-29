import { NextResponse } from 'next/server';
import { fetchPlatformStats } from '@/lib/platform-stats';

export const revalidate = 60;

export async function GET() {
  const stats = await fetchPlatformStats();
  return NextResponse.json(stats);
}
