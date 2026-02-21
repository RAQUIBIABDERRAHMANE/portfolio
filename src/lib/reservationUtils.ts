import db from './sqlite';

export interface AvailabilitySlot {
  id: number;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time: string;  // "HH:MM"
  is_active: boolean;
  duration_minutes: number;
}

export interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  date: string;       // "YYYY-MM-DD"
  time_slot: string;  // "HH:MM"
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  admin_notes: string;
  created_at: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ─── Ensure tables ────────────────────────────────────────────────────────────
async function ensureTables() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS availability_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_week INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      duration_minutes INTEGER DEFAULT 45,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      service_type TEXT NOT NULL,
      date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      admin_notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default slots if empty (Mon-Fri 9h-17h every 45min)
  const check = await db.execute('SELECT COUNT(*) as cnt FROM availability_slots');
  if (Number((check.rows[0] as any).cnt) === 0) {
    const defaultSlots: { day: number; time: string }[] = [];
    for (const day of [1, 2, 3, 4, 5]) {
      for (const time of ['09:00', '09:45', '10:30', '11:15', '14:00', '14:45', '15:30', '16:15']) {
        defaultSlots.push({ day, time });
      }
    }
    for (const s of defaultSlots) {
      await db.execute({
        sql: 'INSERT INTO availability_slots (day_of_week, start_time, is_active, duration_minutes) VALUES (?, ?, 1, 45)',
        args: [s.day, s.time],
      });
    }
  }
}

function mapSlot(row: any): AvailabilitySlot {
  return {
    id: Number(row.id),
    day_of_week: Number(row.day_of_week),
    start_time: String(row.start_time),
    is_active: Boolean(row.is_active),
    duration_minutes: Number(row.duration_minutes || 45),
  };
}

function mapReservation(row: any): Reservation {
  return {
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone || ''),
    service_type: String(row.service_type),
    date: String(row.date),
    time_slot: String(row.time_slot),
    message: String(row.message || ''),
    status: String(row.status) as Reservation['status'],
    admin_notes: String(row.admin_notes || ''),
    created_at: String(row.created_at),
  };
}

// ─── Availability slots ───────────────────────────────────────────────────────
export async function getAllSlots(): Promise<AvailabilitySlot[]> {
  await ensureTables();
  const r = await db.execute('SELECT * FROM availability_slots ORDER BY day_of_week ASC, start_time ASC');
  return r.rows.map(mapSlot);
}

export async function addSlot(day_of_week: number, start_time: string, duration_minutes = 45): Promise<AvailabilitySlot | null> {
  await ensureTables();
  const r = await db.execute({
    sql: 'INSERT INTO availability_slots (day_of_week, start_time, is_active, duration_minutes) VALUES (?, ?, 1, ?)',
    args: [day_of_week, start_time, duration_minutes],
  });
  const res = await db.execute({ sql: 'SELECT * FROM availability_slots WHERE id = ?', args: [Number(r.lastInsertRowid)] });
  return res.rows[0] ? mapSlot(res.rows[0]) : null;
}

export async function toggleSlot(id: number, is_active: boolean): Promise<void> {
  await ensureTables();
  await db.execute({ sql: 'UPDATE availability_slots SET is_active = ? WHERE id = ?', args: [is_active ? 1 : 0, id] });
}

export async function deleteSlot(id: number): Promise<void> {
  await ensureTables();
  await db.execute({ sql: 'DELETE FROM availability_slots WHERE id = ?', args: [id] });
}

// ─── Available time slots for a given date (public) ──────────────────────────
export async function getAvailableSlotsForDate(date: string): Promise<string[]> {
  await ensureTables();
  const dayObj = new Date(date + 'T00:00:00');
  const dayOfWeek = dayObj.getDay();

  // Get active slots for that day of week
  const slotsRes = await db.execute({
    sql: 'SELECT * FROM availability_slots WHERE day_of_week = ? AND is_active = 1 ORDER BY start_time ASC',
    args: [dayOfWeek],
  });
  const allSlots = slotsRes.rows.map(r => String(r.start_time));

  // Get already booked slots for that date (confirmed or pending)
  const bookedRes = await db.execute({
    sql: "SELECT time_slot FROM reservations WHERE date = ? AND status != 'cancelled'",
    args: [date],
  });
  const booked = new Set(bookedRes.rows.map(r => String(r.time_slot)));

  return allSlots.filter(t => !booked.has(t));
}

// ─── Reservations ─────────────────────────────────────────────────────────────
export async function getAllReservations(): Promise<Reservation[]> {
  await ensureTables();
  const r = await db.execute('SELECT * FROM reservations ORDER BY date DESC, time_slot ASC');
  return r.rows.map(mapReservation);
}

export async function getReservationById(id: number): Promise<Reservation | null> {
  await ensureTables();
  const r = await db.execute({ sql: 'SELECT * FROM reservations WHERE id = ?', args: [id] });
  return r.rows[0] ? mapReservation(r.rows[0]) : null;
}

export async function createReservation(data: {
  name: string;
  email: string;
  phone?: string;
  service_type: string;
  date: string;
  time_slot: string;
  message?: string;
}): Promise<Reservation | null> {
  await ensureTables();

  // Check slot is still available
  const available = await getAvailableSlotsForDate(data.date);
  if (!available.includes(data.time_slot)) return null;

  const r = await db.execute({
    sql: `INSERT INTO reservations (name, email, phone, service_type, date, time_slot, message, status, admin_notes, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', '', CURRENT_TIMESTAMP)`,
    args: [data.name, data.email, data.phone || '', data.service_type, data.date, data.time_slot, data.message || ''],
  });
  return getReservationById(Number(r.lastInsertRowid));
}

export async function updateReservationStatus(
  id: number,
  status: Reservation['status'],
  admin_notes?: string
): Promise<Reservation | null> {
  await ensureTables();
  if (admin_notes !== undefined) {
    await db.execute({ sql: 'UPDATE reservations SET status = ?, admin_notes = ? WHERE id = ?', args: [status, admin_notes, id] });
  } else {
    await db.execute({ sql: 'UPDATE reservations SET status = ? WHERE id = ?', args: [status, id] });
  }
  return getReservationById(id);
}

export async function deleteReservation(id: number): Promise<void> {
  await ensureTables();
  await db.execute({ sql: 'DELETE FROM reservations WHERE id = ?', args: [id] });
}

export { DAY_NAMES };
