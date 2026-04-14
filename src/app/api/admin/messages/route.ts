import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import db from "@/lib/sqlite";

export async function GET() {
    const user = getUser();
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await db.execute(`
            SELECT * FROM contact_messages
            ORDER BY created_at DESC
        `);
        return NextResponse.json({ messages: result.rows });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
    }
}
