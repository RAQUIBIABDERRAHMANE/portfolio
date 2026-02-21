import { NextResponse } from 'next/server';
import { createReservation } from '@/lib/reservationUtils';
import { getUser } from '@/lib/auth';
import nodemailer from 'nodemailer';

const SERVICE_TYPES = [
  'Appel de découverte',
  'Démo de projet',
  'Consultation technique',
  'Autre',
];

function formatDateFr(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

async function sendConfirmationEmail({
  name, email, service_type, date, time_slot,
}: { name: string; email: string; service_type: string; date: string; time_slot: string }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const formattedDate = formatDateFr(date);

    await transporter.sendMail({
      from: `"Raquibi Portfolio" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Booking Request Received — Raquibi Portfolio',
      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#020617;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#020617;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0"
           style="background-color:#0f111a;border-radius:16px;overflow:hidden;border:2px solid #00fff9;max-width:600px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="padding:40px 32px;background:linear-gradient(135deg,#020617 0%,#0f172a 100%);text-align:center;border-bottom:1px solid #1e293b;">
          <img src="https://www.raquibi.com/abdo.png" alt="Raquibi" width="80"
               style="border-radius:50%;margin-bottom:20px;border:2px solid #00fff9;">
          <h1 style="margin:0;color:#00fff9;font-size:26px;letter-spacing:2px;text-transform:uppercase;">
            Booking Received
          </h1>
          <p style="margin:8px 0 0;color:#64748b;font-size:13px;">Your request is pending confirmation</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:36px 40px;color:#e2e8f0;">
          <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;">
            Hello <strong style="color:#ffffff;">${name}</strong>,
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#94a3b8;line-height:1.7;">
            Your booking request has been received. I will review it shortly and confirm the session via email.
            Here are your booking details:
          </p>

          <!-- Details card -->
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="background-color:#020617;border-radius:12px;border:1px solid #1e293b;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;border-bottom:1px solid #1e293b;">
                <p style="margin:0;font-size:11px;color:#00fff9;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">Session Type</p>
                <p style="margin:6px 0 0;font-size:16px;color:#ffffff;font-weight:bold;">${service_type}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;border-bottom:1px solid #1e293b;">
                <p style="margin:0;font-size:11px;color:#00fff9;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">Date</p>
                <p style="margin:6px 0 0;font-size:16px;color:#ffffff;font-weight:bold;text-transform:capitalize;">${formattedDate}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0;font-size:11px;color:#00fff9;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">Time</p>
                <p style="margin:6px 0 0;font-size:16px;color:#ffffff;font-weight:bold;">${time_slot} &mdash; 45 minutes</p>
              </td>
            </tr>
          </table>

          <p style="margin:28px 0 0;font-size:14px;color:#64748b;line-height:1.7;">
            You will receive another email once your session is confirmed. If you have any questions, feel free to reply to this email.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:24px 40px;text-align:center;background-color:#020617;border-top:1px solid #1e293b;">
          <p style="margin:0;font-size:12px;color:#334155;">
            &copy; ${new Date().getFullYear()} RAQUIBI &bull; This email was sent automatically
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
      `,
    });
  } catch (err) {
    console.error('Failed to send booking confirmation email:', err);
  }
}

export async function POST(request: Request) {
  try {
    // Auth required
    const user = getUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to book a session.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, service_type, date, time_slot, message } = body;

    if (!name || !email || !service_type || !date || !time_slot) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (!SERVICE_TYPES.includes(service_type)) {
      return NextResponse.json({ error: 'Invalid service type.' }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format.' }, { status: 400 });
    }

    // Prevent past bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(date + 'T00:00:00') < today) {
      return NextResponse.json({ error: 'Cannot book in the past.' }, { status: 400 });
    }

    const reservation = await createReservation({ name, email, phone, service_type, date, time_slot, message });

    if (!reservation) {
      return NextResponse.json({ error: 'This time slot is no longer available.' }, { status: 409 });
    }

    // Send confirmation email (non-blocking)
    sendConfirmationEmail({ name, email, service_type, date, time_slot });

    return NextResponse.json({ message: 'Reservation created successfully.', reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation.' }, { status: 500 });
  }
}
