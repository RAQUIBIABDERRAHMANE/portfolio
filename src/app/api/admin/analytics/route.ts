import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import db from '@/lib/sqlite';

export async function GET() {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Total views
    const totalRes = await db.execute(`SELECT COUNT(*) as count FROM analytics_pageviews`);
    const total = (totalRes.rows[0] as any).count as number;

    // Today
    const todayRes = await db.execute(`
      SELECT COUNT(*) as count FROM analytics_pageviews
      WHERE date(created_at) = date('now')
    `);
    const today = (todayRes.rows[0] as any).count as number;

    // This week
    const weekRes = await db.execute(`
      SELECT COUNT(*) as count FROM analytics_pageviews
      WHERE created_at >= datetime('now', '-7 days')
    `);
    const thisWeek = (weekRes.rows[0] as any).count as number;

    // This month
    const monthRes = await db.execute(`
      SELECT COUNT(*) as count FROM analytics_pageviews
      WHERE created_at >= datetime('now', '-30 days')
    `);
    const thisMonth = (monthRes.rows[0] as any).count as number;

    // Unique visitors (by ip_hash) total
    const uniqueRes = await db.execute(`
      SELECT COUNT(DISTINCT ip_hash) as count FROM analytics_pageviews
    `);
    const uniqueVisitors = (uniqueRes.rows[0] as any).count as number;

    // Unique visitors today
    const uniqueTodayRes = await db.execute(`
      SELECT COUNT(DISTINCT ip_hash) as count FROM analytics_pageviews
      WHERE date(created_at) = date('now')
    `);
    const uniqueToday = (uniqueTodayRes.rows[0] as any).count as number;

    // Top pages (last 30 days)
    const topPagesRes = await db.execute(`
      SELECT pathname, COUNT(*) as views
      FROM analytics_pageviews
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY pathname
      ORDER BY views DESC
      LIMIT 10
    `);
    const topPages = topPagesRes.rows.map((r: any) => ({
      pathname: r.pathname,
      views: r.views,
    }));

    // Top countries (last 30 days)
    const topCountriesRes = await db.execute(`
      SELECT country, country_code, COUNT(*) as views
      FROM analytics_pageviews
      WHERE created_at >= datetime('now', '-30 days')
        AND country IS NOT NULL
        AND country != 'Unknown'
      GROUP BY country
      ORDER BY views DESC
      LIMIT 10
    `);
    const topCountries = topCountriesRes.rows.map((r: any) => ({
      country: r.country,
      countryCode: r.country_code,
      views: r.views,
    }));

    // Top referrers (last 30 days)
    const topReferrersRes = await db.execute(`
      SELECT referrer, COUNT(*) as views
      FROM analytics_pageviews
      WHERE created_at >= datetime('now', '-30 days')
        AND referrer IS NOT NULL
        AND referrer != ''
      GROUP BY referrer
      ORDER BY views DESC
      LIMIT 8
    `);
    const topReferrers = topReferrersRes.rows.map((r: any) => ({
      referrer: r.referrer,
      views: r.views,
    }));

    // Views per day — last 30 days
    const dailyRes = await db.execute(`
      SELECT date(created_at) as day, COUNT(*) as views
      FROM analytics_pageviews
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY day
      ORDER BY day ASC
    `);
    const daily = dailyRes.rows.map((r: any) => ({
      day: r.day,
      views: r.views,
    }));

    // Recent views
    const recentRes = await db.execute(`
      SELECT pathname, country, created_at
      FROM analytics_pageviews
      ORDER BY created_at DESC
      LIMIT 20
    `);
    const recent = recentRes.rows.map((r: any) => ({
      pathname: r.pathname,
      country: r.country,
      createdAt: r.created_at,
    }));

    return NextResponse.json({
      stats: { total, today, thisWeek, thisMonth, uniqueVisitors, uniqueToday },
      topPages,
      topCountries,
      topReferrers,
      daily,
      recent,
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
