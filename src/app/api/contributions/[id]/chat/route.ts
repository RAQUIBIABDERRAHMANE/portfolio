import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { getContributionMessages, addContributionMessage, deleteContributionMessage, isContributionMember } from '@/lib/contributionUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contributionId = parseInt(params.id, 10);
  if (isNaN(contributionId)) {
    return NextResponse.json({ error: 'Invalid contribution ID' }, { status: 400 });
  }

  if (user.role !== 'admin') {
    if (!user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isMember = await isContributionMember(contributionId, user.userId);
    if (!isMember) {
      return NextResponse.json({ error: 'Forbidden. You are not a member of this project.' }, { status: 403 });
    }
  }

  const messages = await getContributionMessages(contributionId);
  return NextResponse.json(messages);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contributionId = parseInt(params.id, 10);
  if (isNaN(contributionId)) {
    return NextResponse.json({ error: 'Invalid contribution ID' }, { status: 400 });
  }

  if (user.role !== 'admin') {
    if (!user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isMember = await isContributionMember(contributionId, user.userId);
    if (!isMember) {
      return NextResponse.json({ error: 'Forbidden. You are not a member of this project.' }, { status: 403 });
    }
  }

  try {
    const body = await request.json();
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // For admin with no userId, use 0
    const submitUserId = user.userId || 0; 

    const success = await addContributionMessage(contributionId, submitUserId, body.message);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contributionId = parseInt(params.id, 10);
  if (isNaN(contributionId)) {
    return NextResponse.json({ error: 'Invalid contribution ID' }, { status: 400 });
  }

  if (user.role !== 'admin') {
    if (!user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isMember = await isContributionMember(contributionId, user.userId);
    if (!isMember) {
      return NextResponse.json({ error: 'Forbidden. You are not a member of this project.' }, { status: 403 });
    }
  }

  try {
    const url = new URL(request.url);
    const messageId = parseInt(url.searchParams.get('messageId') || '', 10);
    
    if (isNaN(messageId)) {
      return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
    }

    const isAdmin = user.role === 'admin';
    const submitUserId = user.userId || 0;
    
    const success = await deleteContributionMessage(messageId, submitUserId, isAdmin);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete message or unauthorized' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
