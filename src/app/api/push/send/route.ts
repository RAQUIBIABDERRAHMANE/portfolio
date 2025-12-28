import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import db from '@/lib/sqlite';
import webpush from 'web-push';

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
    webpush.setVapidDetails(
        'mailto:ceo@raquibi.com',
        publicKey,
        privateKey
    );
}

export async function POST(req: Request) {
    try {
        const user = getUser();

        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, body, url } = await req.json();

        if (!title || !body) {
            return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
        }

        const subscriptionsResult = await db.execute('SELECT subscription FROM subscriptions');
        const subscriptions = subscriptionsResult.rows as any[];

        const results = await Promise.allSettled(
            subscriptions.map(sub => {
                const subscription = JSON.parse(sub.subscription);
                return webpush.sendNotification(
                    subscription,
                    JSON.stringify({ title, body, url: url || '/' })
                );
            })
        );

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.filter(r => r.status === 'rejected').length;

        // Cleanup dead subscriptions (e.g. 410 Gone)
        const deadSubscriptions = results
            .map((r, i) => r.status === 'rejected' && (r.reason as any).statusCode === 410 ? subscriptions[i] : null)
            .filter(Boolean);

        if (deadSubscriptions.length > 0) {
            for (const dead of deadSubscriptions) {
                await db.execute({
                    sql: 'DELETE FROM subscriptions WHERE subscription = ?',
                    args: [dead.subscription]
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Sent to ${successCount} devices. ${failureCount} failed.`,
            stats: { success: successCount, failure: failureCount }
        });
    } catch (error: any) {
        console.error('Push Send Error:', error);
        return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
    }
}
