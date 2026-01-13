import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sqlite";
import { getUser } from "@/lib/auth";

interface PageSetting {
    id: number;
    page_path: string;
    page_name: string;
    is_enabled: number;
    disabled_message: string;
    redirect_path: string | null;
    created_at: string;
    updated_at: string;
}

// Ensure table exists
async function ensureTableExists() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS page_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_path TEXT NOT NULL UNIQUE,
            page_name TEXT NOT NULL,
            is_enabled INTEGER DEFAULT 1,
            disabled_message TEXT DEFAULT 'Cette page est temporairement indisponible.',
            redirect_path TEXT DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

// GET - Fetch all page settings
export async function GET(request: NextRequest) {
    try {
        const user = getUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await ensureTableExists();

        const result = await db.execute("SELECT * FROM page_settings ORDER BY page_name ASC");
        
        const pages = result.rows.map(row => ({
            id: Number(row.id),
            page_path: String(row.page_path),
            page_name: String(row.page_name),
            is_enabled: Boolean(row.is_enabled),
            disabled_message: String(row.disabled_message || ""),
            redirect_path: row.redirect_path ? String(row.redirect_path) : null,
        }));

        return NextResponse.json({ pages });
    } catch (error: any) {
        console.error("Error fetching page settings:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create a new page setting
export async function POST(request: NextRequest) {
    try {
        const user = getUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await ensureTableExists();

        const body = await request.json();
        const rawPath = body.page_path || body.pagePath;
        const page_path = (rawPath || "").trim().toLowerCase().replace(/^\/+/, "").replace(/\/+$/, "");
        const page_name = body.page_name || body.pageName || page_path;
        const is_enabled = body.is_enabled;
        const disabled_message = body.disabled_message;
        const redirect_path = body.redirect_path;

        if (!page_path || !page_name) {
            return NextResponse.json(
                { error: "Page path and name are required" },
                { status: 400 }
            );
        }

        await db.execute({
            sql: `INSERT INTO page_settings (page_path, page_name, is_enabled, disabled_message, redirect_path) 
                  VALUES (?, ?, ?, ?, ?)
                  ON CONFLICT(page_path) DO UPDATE SET
                  page_name = excluded.page_name,
                  is_enabled = excluded.is_enabled,
                  disabled_message = excluded.disabled_message,
                  redirect_path = excluded.redirect_path,
                  updated_at = CURRENT_TIMESTAMP`,
            args: [
                "/" + page_path, 
                page_name, 
                is_enabled !== undefined ? (is_enabled ? 1 : 0) : 0, 
                disabled_message || "Cette page est temporairement indisponible.", 
                redirect_path || null
            ]
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error creating page setting:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
