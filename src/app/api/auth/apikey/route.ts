import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import db from '@/lib/sqlite';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
    const user = getUser();
    if (!user || (!user.userId && !user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await db.execute({
            sql: 'SELECT api_key FROM users WHERE email = ?',
            args: [user.email]
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ api_key: result.rows[0].api_key });
    } catch (e: any) {
        console.error(e); return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST() {
    const user = getUser();
    if (!user || (!user.userId && !user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newApiKey = crypto.randomUUID();

    try {
        await db.execute({
            sql: 'UPDATE users SET api_key = ? WHERE email = ?',
            args: [newApiKey, user.email]
        });

        return NextResponse.json({ api_key: newApiKey });
    } catch (e: any) {
        console.error(e); return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
