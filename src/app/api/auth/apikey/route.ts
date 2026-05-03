import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import db from '@/lib/sqlite';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Ensure the admin_settings table exists (safe to call every request)
async function ensureAdminSettings() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS admin_settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);
}

export async function GET() {
    const user = getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Admin users are not stored in the users table — use admin_settings
        if (user.role === 'admin') {
            await ensureAdminSettings();
            const result = await db.execute({
                sql: "SELECT value FROM admin_settings WHERE key = 'api_key'",
                args: []
            });
            const apiKey = result.rows[0]?.value ?? null;
            return NextResponse.json({ api_key: apiKey });
        }

        // Regular client users — look up by userId or email
        const sql = user.userId
            ? 'SELECT api_key FROM users WHERE id = ?'
            : 'SELECT api_key FROM users WHERE email = ?';
        const arg = user.userId ?? user.email;

        const result = await db.execute({ sql, args: [arg] });

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ api_key: result.rows[0].api_key });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST() {
    const user = getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newApiKey = crypto.randomUUID();

    try {
        // Admin: persist in admin_settings table
        if (user.role === 'admin') {
            await ensureAdminSettings();
            await db.execute({
                sql: "INSERT INTO admin_settings (key, value) VALUES ('api_key', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                args: [newApiKey]
            });
            return NextResponse.json({ api_key: newApiKey });
        }

        // Regular client: update users table by userId or email
        const sql = user.userId
            ? 'UPDATE users SET api_key = ? WHERE id = ?'
            : 'UPDATE users SET api_key = ? WHERE email = ?';
        const arg = user.userId ?? user.email;

        await db.execute({ sql, args: [newApiKey, arg] });
        return NextResponse.json({ api_key: newApiKey });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
