import { NextResponse } from 'next/server';
import { getAvailableSlotsForDate } from '@/lib/reservationUtils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date. Use YYYY-MM-DD.' }, { status: 400 });
    }

    // Don't allow past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(date + 'T00:00:00') < today) {
      return NextResponse.json({ slots: [] });
    }

    const slots = await getAvailableSlotsForDate(date);
    return NextResponse.json({ slots });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}
