import { NextResponse } from 'next/server';
import db from '@/lib/sqlite';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
    try {
        if (!isAuthenticated()) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const result = await db.execute('SELECT id, fullName, email, phone, createdAt, deletedAt FROM users WHERE deletedAt IS NULL ORDER BY createdAt DESC');

        // Map rows to plain objects for reliable JSON serialization
        const users = result.rows.map(row => ({
            id: Number(row.id),
            fullName: String(row.fullName),
            email: String(row.email),
            phone: String(row.phone),
            createdAt: String(row.createdAt),
            deletedAt: row.deletedAt ? String(row.deletedAt) : null
        }));

        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        console.error('Fetch Users API Error:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
