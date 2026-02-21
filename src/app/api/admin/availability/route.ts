import { NextResponse } from 'next/server';
import { getAllSlots, addSlot } from '@/lib/reservationUtils';
import { getUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const slots = await getAllSlots();
    return NextResponse.json({ slots });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { day_of_week, start_time, duration_minutes } = await request.json();
    if (day_of_week === undefined || !start_time) {
      return NextResponse.json({ error: 'day_of_week and start_time are required' }, { status: 400 });
    }
    const slot = await addSlot(Number(day_of_week), String(start_time), Number(duration_minutes || 45));
    return NextResponse.json({ message: 'Slot created', slot }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 });
  }
}
