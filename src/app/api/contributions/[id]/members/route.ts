import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { addContributionMember, removeContributionMember, isContributionMember } from '@/lib/contributionUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUser();
  if (!user) {
    return NextResponse.json({ isMember: false }, { status: 401 });
  }

  // Admin bypass
  if (user.role === 'admin') {
    return NextResponse.json({ isMember: true });
  }

  if (!user.userId) {
    return NextResponse.json({ isMember: false }, { status: 401 });
  }

  const contributionId = parseInt(params.id, 10);
  if (isNaN(contributionId)) {
    return NextResponse.json({ error: 'Invalid contribution ID' }, { status: 400 });
  }

  const isMember = await isContributionMember(contributionId, user.userId);
  return NextResponse.json({ isMember });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin bypass
  if (user.role === 'admin') {
    return NextResponse.json({ success: true, isMember: true });
  }

  if (!user.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contributionId = parseInt(params.id, 10);
  if (isNaN(contributionId)) {
    return NextResponse.json({ error: 'Invalid contribution ID' }, { status: 400 });
  }

  const success = await addContributionMember(contributionId, user.userId);
  if (success) {
    return NextResponse.json({ success: true, isMember: true });
  } else {
    return NextResponse.json({ error: 'Failed to join contribution' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUser();
  if (!user || !user.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contributionId = parseInt(params.id, 10);
  if (isNaN(contributionId)) {
    return NextResponse.json({ error: 'Invalid contribution ID' }, { status: 400 });
  }

  const success = await removeContributionMember(contributionId, user.userId);
  if (success) {
    return NextResponse.json({ success: true, isMember: false });
  } else {
    return NextResponse.json({ error: 'Failed to leave contribution' }, { status: 500 });
  }
}
