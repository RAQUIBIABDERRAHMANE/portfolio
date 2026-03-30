import { NextResponse } from 'next/server';
import { getActiveContributions } from '@/lib/contributionUtils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const contributions = await getActiveContributions();
    return NextResponse.json({ contributions });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json({ error: 'Failed to fetch contributions', contributions: [] }, { status: 500 });
  }
}
