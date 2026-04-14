import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import db from "@/lib/sqlite";
import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
  webpush.setVapidDetails(
    "mailto:ceo@raquibi.com",
    publicKey,
    privateKey
  );
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Save to database and trigger push notification
    try {
      await db.execute({
        sql: `INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
        args: [name, email, subject, message],
      });

      // Send Web Push Notification to Admins
      if (publicKey && privateKey) {
        const subscriptionsResult = await db.execute({
          sql: "SELECT subscription FROM subscriptions WHERE role = 'admin'",
          args: []
        });
        const subscriptions = subscriptionsResult.rows as any[];
        
        await Promise.allSettled(
          subscriptions.map(sub => {
            try {
              const subscription = JSON.parse(sub.subscription);
              return webpush.sendNotification(
                subscription,
                JSON.stringify({ 
                  title: `New Message: ${name}`, 
                  body: message.length > 50 ? message.substring(0, 50) + "..." : message, 
                  url: "/admin" 
                }),
                { TTL: 86400, urgency: 'high' }
              );
            } catch (e) {
              return Promise.reject(new Error("Invalid subscription format"));
            }
          })
        );
      }
    } catch (dbOrPushError) {
      console.error("[DB/Push Error]", dbOrPushError);
      // We don't fail the request if DB insert or Push fails, we still try to send the email.
    }

    // Email to Abdo
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `📩 [Portfolio] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1724; color: #e2e8f0; padding: 32px; border-radius: 16px; border: 1px solid rgba(0,255,249,0.2);">
          <h2 style="color: #00fff9; margin-bottom: 24px; font-size: 22px;">New Contact Form Message</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; width: 30%;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">${email}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Subject</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <p style="color: #94a3b8; margin-bottom: 8px;">Message:</p>
            <div style="background: rgba(0,255,249,0.05); border: 1px solid rgba(0,255,249,0.15); border-radius: 12px; padding: 16px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
          </div>
          <p style="margin-top: 24px; color: #475569; font-size: 13px;">Sent from raquibi.com portfolio contact form</p>
        </div>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"Abdo Raquibi" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}! 🚀`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1724; color: #e2e8f0; padding: 32px; border-radius: 16px; border: 1px solid rgba(0,255,249,0.2);">
          <h2 style="color: #00fff9; margin-bottom: 16px;">Hey ${name}! 👋</h2>
          <p style="line-height: 1.7; color: #cbd5e1;">Thanks for getting in touch! I've received your message and will get back to you as soon as possible — usually within 24 hours.</p>
          <p style="line-height: 1.7; color: #cbd5e1; margin-top: 16px;">In the meantime, feel free to check out my work on <a href="https://github.com/RAQUIBIABDERRAHMANE" style="color: #00fff9;">GitHub</a> or connect with me on <a href="https://linkedin.com/in/abderrahmaneraquibi" style="color: #00fff9;">LinkedIn</a>.</p>
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #475569; font-size: 13px; margin: 0;">Best regards,</p>
            <p style="color: #00fff9; font-weight: bold; font-size: 16px; margin: 4px 0 0;">Abdo Raquibi</p>
            <p style="color: #475569; font-size: 13px; margin: 4px 0 0;">Full-Stack Developer · raquibi.com</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
