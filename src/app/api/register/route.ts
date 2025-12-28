import { NextResponse } from 'next/server';
import db from '@/lib/sqlite';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

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

        // 1. Save to SQLite
        try {
            const stmt = db.prepare(
                'INSERT INTO users (fullName, phone, email, password) VALUES (?, ?, ?, ?)'
            );
            stmt.run(fullName, phone, email, hashedPassword);
        } catch (dbError: any) {
            if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return NextResponse.json(
                    { error: 'Email already registered' },
                    { status: 400 }
                );
            }
            throw dbError;
        }

        // 2. Send SMTP Email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true, // Use SSL/TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Raquibi Portfolio" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Registration Successful - Raquibi Portfolio',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00fff9;">Welcome, ${fullName}!</h2>
          <p>Thank you for registering on my portfolio website.</p>
          <p><strong>Your Details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${fullName}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p>I will get in touch with you soon!</p>
          <hr />
          <p style="font-size: 12px; color: #777;">This is an automated message from Raquibi Portfolio.</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Registration successful!' });
    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
