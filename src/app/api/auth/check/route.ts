import { NextResponse } from 'next/server';
import { getUser, isUserActive } from '@/lib/auth';
import db from '@/lib/sqlite';

export async function GET() {
    const user = getUser();

    if (!user) {
        return NextResponse.json({ authenticated: false });
    }

    let userInfo: any = {
        email: user.email,
        role: user.role,
        fullName: user.role === 'admin' ? 'Administrator' : '',
        phone: ''
    };

    if (user.role === 'client' && user.userId) {
        if (!await isUserActive(user.userId)) {
            return NextResponse.json({ authenticated: false });
        }

        const result = await db.execute({
            sql: 'SELECT fullName, phone, deletedAt FROM users WHERE id = ?',
            args: [user.userId]
        });
        const dbUser = result.rows[0] as any;
        if (dbUser) {
            if (dbUser.deletedAt) {
                return NextResponse.json({ authenticated: false });
            }
            userInfo.fullName = dbUser.fullName;
            userInfo.phone = dbUser.phone;
        }
    }

    return NextResponse.json({
        authenticated: true,
        ...userInfo
    });
}
