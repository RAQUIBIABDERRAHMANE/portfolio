import { NextResponse } from 'next/server';
import { updateContribution, deleteContribution } from '@/lib/contributionUtils';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await req.json();
    const updated = await updateContribution(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update contribution or not found' }, { status: 404 });
    }
    return NextResponse.json({ contribution: updated });
  } catch (error) {
    console.error('Error updating contribution:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const success = await deleteContribution(id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete contribution or not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting contribution:', error);
    return NextResponse.json({ error: 'Failed to delete contribution' }, { status: 500 });
  }
}
