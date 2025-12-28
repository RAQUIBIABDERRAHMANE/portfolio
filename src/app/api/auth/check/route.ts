import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import db from '@/lib/sqlite';

export async function GET() {
    const user = getUser();

    if (!user) {
        return NextResponse.json({ authenticated: false });
    }

    let userInfo = {
        email: user.email,
        role: user.role,
        fullName: user.role === 'admin' ? 'Administrator' : ''
    };

    if (user.role === 'client' && user.userId) {
        const result = await db.execute({
            sql: 'SELECT fullName FROM users WHERE id = ?',
            args: [user.userId]
        });
        const dbUser = result.rows[0] as any;
        if (dbUser) {
            userInfo.fullName = dbUser.fullName;
        }
    }

    return NextResponse.json({
        authenticated: true,
        ...userInfo
    });
}
