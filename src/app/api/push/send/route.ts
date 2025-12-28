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

        const { title, body, url, targetUserIds } = await req.json();

        if (!title || !body) {
            return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
        }

        let sql = 'SELECT subscription FROM subscriptions';
        let args: any[] = [];

        if (targetUserIds && Array.isArray(targetUserIds) && targetUserIds.length > 0) {
            const placeholders = targetUserIds.map(() => '?').join(',');
            sql += ` WHERE user_id IN (${placeholders})`;
            args = targetUserIds;
        }

        const subscriptionsResult = await db.execute({ sql, args });
        const subscriptions = subscriptionsResult.rows as any[];

        if (subscriptions.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No active subscriptions found for selected targets.',
                stats: { success: 0, failure: 0 }
            });
        }

        const results = await Promise.allSettled(
            subscriptions.map(sub => {
                try {
                    const subscription = JSON.parse(sub.subscription);
                    return webpush.sendNotification(
                        subscription,
                        JSON.stringify({ title, body, url: url || '/' }),
                        {
                            TTL: 86400, // Keep message alive for 24 hours if device is offline
                            headers: {
                                'Urgency': 'high' // Priority for mobile power management
                            }
                        }
                    );
                } catch (e) {
                    return Promise.reject(new Error('Invalid subscription format'));
                }
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
