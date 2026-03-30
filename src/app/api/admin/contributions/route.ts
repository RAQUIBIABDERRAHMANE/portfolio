import { NextResponse } from 'next/server';
import { getAllContributions, addContribution } from '@/lib/contributionUtils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const contributions = await getAllContributions();
    return NextResponse.json({ contributions });
  } catch (error) {
    console.error('Error fetching all contributions:', error);
    return NextResponse.json({ error: 'Failed to fetch contributions', contributions: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newContribution = await addContribution(body);
    if (!newContribution) {
      return NextResponse.json({ error: 'Failed to create contribution' }, { status: 500 });
    }
    return NextResponse.json({ contribution: newContribution }, { status: 201 });
  } catch (error) {
    console.error('Error adding contribution:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
