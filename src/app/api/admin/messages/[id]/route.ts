import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import db from "@/lib/sqlite";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const user = getUser();
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { status } = await req.json();
        await db.execute({
            sql: `UPDATE contact_messages SET status = ? WHERE id = ?`,
            args: [status, params.id],
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = getUser();
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await db.execute({
            sql: `DELETE FROM contact_messages WHERE id = ?`,
            args: [params.id],
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }
}
