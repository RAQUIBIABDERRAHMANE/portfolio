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
        const userId = user?.role === 'client' ? user.userId : null;

        // Check if subscription already exists to avoid duplicates
        const existing = db.prepare('SELECT id FROM subscriptions WHERE subscription = ?').get(subscriptionJson) as any;

        if (!existing) {
            db.prepare('INSERT INTO subscriptions (user_id, subscription) VALUES (?, ?)')
                .run(userId, subscriptionJson);
        }

        return NextResponse.json({ success: true, message: 'Subscribed to push notifications' });
    } catch (error: any) {
        console.error('Subscription Error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
