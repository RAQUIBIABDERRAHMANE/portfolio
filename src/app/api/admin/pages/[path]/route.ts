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
}

// GET - Fetch single page setting
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string }> }
) {
    try {
        const { path } = await params;
        const normalized = (path || "").trim().toLowerCase().replace(/^\/+/, "").replace(/\/+$/, "");
        const pagePath = "/" + normalized;

        const result = await db.execute({
            sql: "SELECT * FROM page_settings WHERE page_path = ?",
            args: [pagePath]
        });

        if (result.rows.length === 0) {
            // Page not in settings, assume it's enabled
            return NextResponse.json({ 
                is_enabled: true,
                page_path: pagePath,
                page_name: normalized,
                disabled_message: null
            });
        }

        const row = result.rows[0];
        return NextResponse.json({
            id: Number(row.id),
            page_path: String(row.page_path),
            page_name: String(row.page_name),
            is_enabled: Boolean(row.is_enabled),
            disabled_message: String(row.disabled_message || ""),
            redirect_path: row.redirect_path ? String(row.redirect_path) : null,
        });
    } catch (error) {
        console.error("Error fetching page setting:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH - Update page setting
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string }> }
) {
    try {
        const user = getUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { path } = await params;
        const normalized = (path || "").trim().toLowerCase().replace(/^\/+/, "").replace(/\/+$/, "");
        const pagePath = "/" + normalized;
        const body = await request.json();
        const { is_enabled, disabled_message, redirect_path, page_name } = body;

        // Check if page exists
        const existing = await db.execute({
            sql: "SELECT * FROM page_settings WHERE page_path = ?",
            args: [pagePath]
        });

        if (existing.rows.length === 0) {
            // Create new entry
            await db.execute({
                sql: `INSERT INTO page_settings (page_path, page_name, is_enabled, disabled_message, redirect_path) 
                      VALUES (?, ?, ?, ?, ?)`,
                args: [pagePath, page_name || path, is_enabled !== undefined ? (is_enabled ? 1 : 0) : 1, disabled_message || "Cette page est temporairement indisponible.", redirect_path || null]
            });
        } else {
            // Update existing
            const updates: string[] = [];
            const values: any[] = [];

            if (is_enabled !== undefined) {
                updates.push("is_enabled = ?");
                values.push(is_enabled ? 1 : 0);
            }
            if (disabled_message !== undefined) {
                updates.push("disabled_message = ?");
                values.push(disabled_message);
            }
            if (redirect_path !== undefined) {
                updates.push("redirect_path = ?");
                values.push(redirect_path);
            }
            if (page_name !== undefined) {
                updates.push("page_name = ?");
                values.push(page_name);
            }

            if (updates.length > 0) {
                updates.push("updated_at = CURRENT_TIMESTAMP");
                values.push(pagePath);
                await db.execute({
                    sql: `UPDATE page_settings SET ${updates.join(", ")} WHERE page_path = ?`,
                    args: values
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating page setting:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Remove page setting
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string }> }
) {
    try {
        const user = getUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { path } = await params;
        const pagePath = "/" + path;

        await db.execute({
            sql: "DELETE FROM page_settings WHERE page_path = ?",
            args: [pagePath]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting page setting:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
