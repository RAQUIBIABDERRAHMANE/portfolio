import { createClient } from '@libsql/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const url = process.env.TURSO_DATABASE_URL || 'file:./database/users.sqlite';
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
    url,
    authToken,
});

async function sendBulkEmail() {
    console.log('--- Starting Bulk Email Process ---');

    try {
        // 1. Fetch all users from the database
        console.log('Fetching users from database...');
        const result = await db.execute('SELECT fullName, email FROM users');
        const users = result.rows;

        if (users.length === 0) {
            console.log('No users found in the database. Exiting.');
            return;
        }

        console.log(`Found ${users.length} users. Preparing to send emails...`);

        // 2. Setup Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 3. Iterate and send emails
        let successCount = 0;
        let failCount = 0;

        for (const user of users) {
            const { fullName, email } = user;

            // Skip admin email if configured
            if (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
                console.log(`Skipping admin: ${email}`);
                continue;
            }

            console.log(`Sending email to: ${fullName} (${email})...`);

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
                        <h1 style="margin:0; color:#38bdf8; font-size:24px;">Email Confirmed</h1>
                    </td>
                </tr>

                <!-- Confirmation Message -->
                <tr>
                    <td style="padding:28px 32px; color:#e5e7eb; text-align:center;">
                        <p style="margin:0; font-size:16px; line-height:1.6;">
                            Hello <strong>${fullName}</strong>,<br><br>
                            Your email has been successfully confirmed.
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

            try {
                await transporter.sendMail(mailOptions);
                console.log(`✅ Successfully sent to ${email}`);
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to send to ${email}:`, error.message);
                failCount++;
            }

            // Optional: Small delay between emails to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('\n--- Process Summary ---');
        console.log(`Total attempted: ${users.length}`);
        console.log(`Successfully sent: ${successCount}`);
        console.log(`Failed: ${failCount}`);
        console.log('------------------------');

    } catch (error) {
        console.error('Fatal Error during bulk email process:', error);
    }
}

sendBulkEmail();
