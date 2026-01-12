import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/sqlite';
import { isAuthenticated } from '@/lib/auth';

// PATCH - Update application status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json();

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const result = await db.execute({
            sql: `UPDATE employment_submissions 
                  SET status = ?, reviewedAt = datetime('now') 
                  WHERE id = ?`,
            args: [status, parseInt(id)]
        });

        if (result.rowsAffected === 0) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Application ${status}` 
        });

    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json(
            { error: 'Failed to update application' },
            { status: 500 }
        );
    }
}

// DELETE - Remove application
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const result = await db.execute({
            sql: 'DELETE FROM employment_submissions WHERE id = ?',
            args: [parseInt(id)]
        });

        if (result.rowsAffected === 0) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Application deleted' 
        });

    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json(
            { error: 'Failed to delete application' },
            { status: 500 }
        );
    }
}

// GET - Get single application
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!isAuthenticated()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const result = await db.execute({
            sql: 'SELECT * FROM employment_submissions WHERE id = ?',
            args: [parseInt(id)]
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching application:', error);
        return NextResponse.json(
            { error: 'Failed to fetch application' },
            { status: 500 }
        );
    }
}
