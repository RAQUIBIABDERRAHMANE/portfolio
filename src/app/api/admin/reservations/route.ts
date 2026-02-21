import { NextResponse } from 'next/server';
import { getAllReservations } from '@/lib/reservationUtils';
import { getUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const reservations = await getAllReservations();
    return NextResponse.json({ reservations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}
