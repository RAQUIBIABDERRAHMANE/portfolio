import { NextResponse } from 'next/server';
import db from '@/lib/sqlite';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { fullName, phone, email, password } = await req.json();

        if (!fullName || !phone || !email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Save to SQLite & Get ID atomically using RETURNING *
        let newUser: any;
        try {
            const result = await db.execute({
                sql: 'INSERT INTO users (fullName, phone, email, password) VALUES (?, ?, ?, ?) RETURNING id, email, fullName',
                args: [fullName, phone, email, hashedPassword]
            });

            if (result.rows.length > 0) {
                newUser = result.rows[0];
            } else {
                throw new Error("Failed to insert user and retrieve data.");
            }

        } catch (dbError: any) {
            if (dbError.message?.includes('UNIQUE constraint failed')) {
                return NextResponse.json(
                    { error: 'Email already registered' },
                    { status: 400 }
                );
            }
            throw dbError;
        }

        const token = signToken({
            userId: newUser.id,
            email: newUser.email,
            role: 'client' // Default role
        });

        // 3. Send SMTP Email (Async - don't block response)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Raquibi Portfolio" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Registration Confirmed - Raquibi Portfolio',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Email Confirmed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#020617; font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#020617; padding:24px 0;">
    <tr>
        <td align="center">

            <!-- Main Container -->
            <table width="600" cellpadding="0" cellspacing="0"
                   style="background-color:#0f111a; border-radius:12px; overflow:hidden; border:2px solid #38bdf8;">

                <!-- Header -->
                <tr>
                    <td style="padding:32px; background-color:#020617; text-align:center;">
                        <img src="https://www.raquibi.com/abdo.png" alt="Logo" width="120" style="margin-bottom:16px;">
                        <h1 style="margin:0; color:#38bdf8; font-size:24px;">Welcome Aboard!</h1>
                    </td>
                </tr>

                <!-- Confirmation Message -->
                <tr>
                    <td style="padding:28px 32px; color:#e5e7eb; text-align:center;">
                        <p style="margin:0; font-size:16px; line-height:1.6;">
                            Hello <strong>${fullName}</strong>,<br><br>
                            Your registration was successful. You are now logged in and ready to explore.
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="padding:20px; text-align:center; background-color:#020617; border-top:1px solid #1e293b;">
                        <p style="margin:0; font-size:12px; color:#64748b;">
                            © 2025 RAQUIBI
                        </p>
                    </td>
                </tr>

            </table>
            <!-- End Container -->

        </td>
    </tr>
</table>

</body>
</html>
      `,
        };

        // Fire and forget email to speed up response
        transporter.sendMail(mailOptions).catch(err => console.error('Email send error:', err));

        const response = NextResponse.json({ success: true, message: 'Registration successful! logging in...' });

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
