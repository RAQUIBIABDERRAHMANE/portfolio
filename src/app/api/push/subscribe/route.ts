import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import db from '@/lib/sqlite';

export async function POST(req: Request) {
    try {
        const user = getUser();
        const { subscription } = await req.json();

        if (!subscription) {
            return NextResponse.json({ error: 'Subscription is required' }, { status: 400 });
        }

        const subscriptionJson = JSON.stringify(subscription);
        const userId = user?.role === 'client' ? (user.userId ?? null) : null;
        const subRole = user?.role || 'guest';

        // Check if subscription already exists to avoid duplicates
        const existingResult = await db.execute({
            sql: 'SELECT id, role FROM subscriptions WHERE subscription = ?',
            args: [subscriptionJson]
        });
        const existing = existingResult.rows[0];

        if (!existing) {
            await db.execute({
                sql: 'INSERT INTO subscriptions (user_id, subscription, role) VALUES (?, ?, ?)',
                args: [userId, subscriptionJson, subRole]
            });
        } else if (existing.role !== subRole) {
            // Update role if it changed (e.g., guest logged in as admin)
            await db.execute({
                sql: 'UPDATE subscriptions SET role = ? WHERE id = ?',
                args: [subRole, existing.id]
            });
        }

        return NextResponse.json({ success: true, message: 'Subscribed to push notifications' });
    } catch (error: any) {
        console.error('Subscription Error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
