import { NextResponse } from 'next/server';
import db from '@/lib/sqlite';
import { isAuthenticated } from '@/lib/auth';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!isAuthenticated()) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const id = Number(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid user ID' },
                { status: 400 }
            );
        }

        await db.execute({
            sql: 'UPDATE users SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?',
            args: [id]
        });

        return NextResponse.json({ success: true, message: 'User deactivated successfully' });
    } catch (error: any) {
        console.error('Delete User API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
