import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sqlite";

// Public endpoint to check if a page is enabled
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string }> }
) {
    try {
        const { path } = await params;
        const pagePath = "/" + path;

        const result = await db.execute({
            sql: "SELECT is_enabled, disabled_message, redirect_path FROM page_settings WHERE page_path = ?",
            args: [pagePath]
        });

        if (result.rows.length === 0) {
            // Page not in settings, assume it's enabled
            return NextResponse.json({ 
                is_enabled: true,
                disabled_message: null,
                redirect_path: null
            });
        }

        const row = result.rows[0];
        return NextResponse.json({
            is_enabled: Boolean(row.is_enabled),
            disabled_message: row.disabled_message ? String(row.disabled_message) : null,
            redirect_path: row.redirect_path ? String(row.redirect_path) : null
        });
    } catch (error) {
        console.error("Error checking page status:", error);
        // In case of error, allow access (fail open)
        return NextResponse.json({ 
            is_enabled: true,
            disabled_message: null,
            redirect_path: null
        });
    }
}
