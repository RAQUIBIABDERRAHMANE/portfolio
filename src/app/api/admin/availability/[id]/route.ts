import { NextResponse } from 'next/server';
import { toggleSlot, deleteSlot } from '@/lib/reservationUtils';
import { getUser } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { is_active } = await request.json();
    await toggleSlot(Number(params.id), Boolean(is_active));
    return NextResponse.json({ message: 'Slot updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update slot' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await deleteSlot(Number(params.id));
    return NextResponse.json({ message: 'Slot deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}
