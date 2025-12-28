import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import db from '@/lib/sqlite';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPass = process.env.ADMIN_PASS;

        // Check for Admin
        if (adminEmail && adminPass && email === adminEmail && password === adminPass) {
            const token = signToken({ email: adminEmail, role: 'admin' });

            const response = NextResponse.json({
                success: true,
                role: 'admin',
                message: 'Admin logged in successfully'
            });

            response.cookies.set({
                name: 'auth_token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        }

        // Check for Client in DB
        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE email = ?',
            args: [email]
        });
        const user = result.rows[0] as any;

        if (user && await bcrypt.compare(password, user.password)) {
            if (user.deletedAt) {
                return NextResponse.json(
                    { error: 'Account has been deactivated' },
                    { status: 403 }
                );
            }
            const token = signToken({
                userId: user.id,
                email: user.email,
                role: 'client'
            });

            const response = NextResponse.json({
                success: true,
                role: 'client',
                message: 'Logged in successfully'
            });

            response.cookies.set({
                name: 'auth_token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        }

        return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
        );
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
