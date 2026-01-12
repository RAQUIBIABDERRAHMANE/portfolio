import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sqlite";
import { isAuthenticated } from "@/lib/auth";
import nodemailer from "nodemailer";

// Ensure employment_submissions table exists
async function ensureTableExists() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS employment_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            idNumber TEXT NOT NULL,
            startDate TEXT NOT NULL,
            position TEXT,
            githubUrl TEXT,
            portfolioUrl TEXT,
            linkedinUrl TEXT,
            skills TEXT,
            hasFixedSalary INTEGER DEFAULT 1,
            fixedSalary TEXT,
            revenueSharePercentage TEXT,
            paymentConditionAccepted INTEGER DEFAULT 0,
            remoteWorkConditionAccepted INTEGER DEFAULT 0,
            ndaAccepted INTEGER DEFAULT 0,
            ownershipAccepted INTEGER DEFAULT 0,
            agreementAccepted INTEGER DEFAULT 0,
            cvFileName TEXT,
            cvData TEXT,
            signatureData TEXT,
            signatureDate TEXT,
            status TEXT DEFAULT 'pending',
            submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            reviewedAt DATETIME,
            reviewedBy TEXT
        )
    `);
    
    // Add cvData column if it doesn't exist (for existing tables)
    try {
        await db.execute(`ALTER TABLE employment_submissions ADD COLUMN cvData TEXT`);
    } catch {
        // Column already exists, ignore error
    }
}

// POST - Create new employment submission
export async function POST(request: NextRequest) {
    try {
        await ensureTableExists();

        const formData = await request.formData();
        
        // Extract all form fields
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const idNumber = formData.get("idNumber") as string;
        const startDate = formData.get("startDate") as string;
        const position = formData.get("position") as string || "Software Developer";
        const githubUrl = formData.get("githubUrl") as string || "";
        const portfolioUrl = formData.get("portfolioUrl") as string || "";
        const linkedinUrl = formData.get("linkedinUrl") as string || "";
        const skills = formData.get("skills") as string || "";
        const hasFixedSalary = formData.get("hasFixedSalary") === "true" ? 1 : 0;
        const fixedSalary = formData.get("fixedSalary") as string || "";
        const revenueSharePercentage = formData.get("revenueSharePercentage") as string || "";
        const paymentConditionAccepted = formData.get("paymentConditionAccepted") === "true" ? 1 : 0;
        const remoteWorkConditionAccepted = formData.get("remoteWorkConditionAccepted") === "true" ? 1 : 0;
        const ndaAccepted = formData.get("ndaAccepted") === "true" ? 1 : 0;
        const ownershipAccepted = formData.get("ownershipAccepted") === "true" ? 1 : 0;
        const agreementAccepted = formData.get("agreementAccepted") === "true" ? 1 : 0;
        const signatureData = formData.get("signature") as string || "";
        const signatureDate = formData.get("signatureDate") as string || "";
        
        // Handle CV file - store as base64
        const cvFile = formData.get("cv") as File | null;
        const cvFileName = cvFile?.name || "";
        let cvData = "";
        if (cvFile && cvFile.size > 0) {
            const buffer = await cvFile.arrayBuffer();
            cvData = `data:${cvFile.type};base64,${Buffer.from(buffer).toString('base64')}`;
        }

        // Validate required fields
        if (!fullName || !email || !phone || !idNumber || !startDate) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check for duplicate submissions
        const existing = await db.execute({
            sql: "SELECT id FROM employment_submissions WHERE email = ? AND status = 'pending'",
            args: [email]
        });

        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: "You already have a pending application. Please wait for review." },
                { status: 409 }
            );
        }

        // Insert into database
        const result = await db.execute({
            sql: `INSERT INTO employment_submissions (
                fullName, email, phone, idNumber, startDate, position,
                githubUrl, portfolioUrl, linkedinUrl, skills,
                hasFixedSalary, fixedSalary, revenueSharePercentage,
                paymentConditionAccepted, remoteWorkConditionAccepted,
                ndaAccepted, ownershipAccepted, agreementAccepted,
                cvFileName, cvData, signatureData, signatureDate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                fullName, email, phone, idNumber, startDate, position,
                githubUrl, portfolioUrl, linkedinUrl, skills,
                hasFixedSalary, fixedSalary, revenueSharePercentage,
                paymentConditionAccepted, remoteWorkConditionAccepted,
                ndaAccepted, ownershipAccepted, agreementAccepted,
                cvFileName, cvData, signatureData, signatureDate
            ]
        });

        // Send confirmation email to developer
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
            subject: 'Employment Application Received - Raquibi',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Application Received</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#020617; font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#020617; padding:24px 0;">
    <tr>
        <td align="center">

            <table width="600" cellpadding="0" cellspacing="0"
                   style="background-color:#0f111a; border-radius:12px; overflow:hidden; border:2px solid #38bdf8;">

                <tr>
                    <td style="padding:32px; background-color:#020617; text-align:center;">
                        <img src="https://www.raquibi.com/abdo.png" alt="Logo" width="120" style="margin-bottom:16px;">
                        <h1 style="margin:0; color:#38bdf8; font-size:24px;">Application Received!</h1>
                    </td>
                </tr>

                <tr>
                    <td style="padding:28px 32px; color:#e5e7eb;">
                        <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6;">
                            Hello <strong>${fullName}</strong>,
                        </p>
                        <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6;">
                            Thank you for submitting your employment agreement. We have received your application for the position of <strong>${position}</strong>.
                        </p>
                        
                        <table width="100%" cellpadding="12" style="background-color:#1e293b; border-radius:8px; margin:20px 0;">
                            <tr>
                                <td style="color:#94a3b8; font-size:12px; text-transform:uppercase;">Start Date</td>
                                <td style="color:#38bdf8; font-size:14px; text-align:right;">${startDate}</td>
                            </tr>
                            <tr>
                                <td style="color:#94a3b8; font-size:12px; text-transform:uppercase;">Revenue Share</td>
                                <td style="color:#10b981; font-size:14px; text-align:right; font-weight:bold;">${revenueSharePercentage}%</td>
                            </tr>
                            <tr>
                                <td style="color:#94a3b8; font-size:12px; text-transform:uppercase;">Status</td>
                                <td style="color:#fbbf24; font-size:14px; text-align:right;">⏳ Pending Review</td>
                            </tr>
                        </table>

                        <p style="margin:0; font-size:14px; line-height:1.6; color:#94a3b8;">
                            Our team will review your application and get back to you shortly. Please keep this email for your records.
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding:20px; text-align:center; background-color:#020617; border-top:1px solid #1e293b;">
                        <p style="margin:0; font-size:12px; color:#64748b;">
                            © ${new Date().getFullYear()} RAQUIBI - Employment Agreement
                        </p>
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
            `,
        };

        // Fire and forget email
        transporter.sendMail(mailOptions).catch(err => console.error('Employment email send error:', err));

        return NextResponse.json({
            success: true,
            message: "Employment application submitted successfully",
            id: Number(result.lastInsertRowid)
        });

    } catch (error) {
        console.error("Error saving employment submission:", error);
        return NextResponse.json(
            { error: "Failed to save application" },
            { status: 500 }
        );
    }
}

// GET - Retrieve all submissions (admin only)
export async function GET(request: NextRequest) {
    try {
        if (!isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await ensureTableExists();
        
        const result = await db.execute(
            "SELECT * FROM employment_submissions ORDER BY submittedAt DESC"
        );

        return NextResponse.json({
            success: true,
            submissions: result.rows
        });

    } catch (error) {
        console.error("Error fetching employment submissions:", error);
        return NextResponse.json(
            { error: "Failed to fetch submissions" },
            { status: 500 }
        );
    }
}
