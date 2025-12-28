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

        const users = db.prepare('SELECT id, fullName, email, phone, createdAt FROM users ORDER BY createdAt DESC').all();

        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        console.error('Fetch Users Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
