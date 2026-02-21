import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import db from '@/lib/sqlite';

function rangeClause(range: string): string {
  switch (range) {
    case '7d':  return `datetime('now', '-7 days')`;
    case '90d': return `datetime('now', '-90 days')`;
    case 'all': return `datetime('2000-01-01')`;
    default:    return `datetime('now', '-30 days')`; // 30d
  }
}

function prevRangeClause(range: string): { start: string; end: string } {
  switch (range) {
    case '7d':  return { start: `datetime('now', '-14 days')`, end: `datetime('now', '-7 days')` };
    case '90d': return { start: `datetime('now', '-180 days')`, end: `datetime('now', '-90 days')` };
    case 'all': return { start: `datetime('2000-01-01')`, end: `datetime('2000-01-01')` };
    default:    return { start: `datetime('now', '-60 days')`, end: `datetime('now', '-30 days')` };
  }
}

function dailyGroupFormat(range: string): string {
  return range === '90d' || range === 'all' ? `strftime('%Y-%W', created_at)` : `date(created_at)`;
}

export async function GET(request: NextRequest) {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '30d';
  const since = rangeClause(range);
  const prev = prevRangeClause(range);

  try {
    // ── Core counts ───────────────────────────────────────────────
    const [totalR, todayR, weekR, monthR, uniqueR, uniqueTodayR, liveR] = await Promise.all([
      db.execute(`SELECT COUNT(*) as c FROM analytics_pageviews`),
      db.execute(`SELECT COUNT(*) as c FROM analytics_pageviews WHERE date(created_at)=date('now')`),
      db.execute(`SELECT COUNT(*) as c FROM analytics_pageviews WHERE created_at >= datetime('now','-7 days')`),
      db.execute(`SELECT COUNT(*) as c FROM analytics_pageviews WHERE created_at >= datetime('now','-30 days')`),
      db.execute(`SELECT COUNT(DISTINCT ip_hash) as c FROM analytics_pageviews`),
      db.execute(`SELECT COUNT(DISTINCT ip_hash) as c FROM analytics_pageviews WHERE date(created_at)=date('now')`),
      db.execute(`SELECT COUNT(DISTINCT ip_hash) as c FROM analytics_pageviews WHERE created_at >= datetime('now','-5 minutes')`),
    ]);

    const stats = {
      total: Number((totalR.rows[0] as any).c),
      today: Number((todayR.rows[0] as any).c),
      thisWeek: Number((weekR.rows[0] as any).c),
      thisMonth: Number((monthR.rows[0] as any).c),
      uniqueVisitors: Number((uniqueR.rows[0] as any).c),
      uniqueToday: Number((uniqueTodayR.rows[0] as any).c),
      liveVisitors: Number((liveR.rows[0] as any).c),
    };

    // ── Trend vs previous period ──────────────────────────────────
    const [curPeriodR, prevPeriodR, curUniqueR, prevUniqueR] = await Promise.all([
      db.execute({ sql: `SELECT COUNT(*) as c FROM analytics_pageviews WHERE created_at >= ${since}`, args: [] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM analytics_pageviews WHERE created_at >= ${prev.start} AND created_at < ${prev.end}`, args: [] }),
      db.execute({ sql: `SELECT COUNT(DISTINCT ip_hash) as c FROM analytics_pageviews WHERE created_at >= ${since}`, args: [] }),
      db.execute({ sql: `SELECT COUNT(DISTINCT ip_hash) as c FROM analytics_pageviews WHERE created_at >= ${prev.start} AND created_at < ${prev.end}`, args: [] }),
    ]);
    const curViews = Number((curPeriodR.rows[0] as any).c);
    const prevViews = Number((prevPeriodR.rows[0] as any).c);
    const curUnique = Number((curUniqueR.rows[0] as any).c);
    const prevUnique = Number((prevUniqueR.rows[0] as any).c);
    const trend = {
      views: curViews,
      viewsPct: prevViews === 0 ? null : Math.round(((curViews - prevViews) / prevViews) * 100),
      unique: curUnique,
      uniquePct: prevUnique === 0 ? null : Math.round(((curUnique - prevUnique) / prevUnique) * 100),
    };

    // ── Top pages ─────────────────────────────────────────────────
    const topPagesR = await db.execute({
      sql: `SELECT pathname, COUNT(*) as views, COUNT(DISTINCT ip_hash) as uniq
            FROM analytics_pageviews
            WHERE created_at >= ${since}
            GROUP BY pathname ORDER BY views DESC LIMIT 10`,
      args: [],
    });
    const topPages = topPagesR.rows.map((r: any) => ({
      pathname: r.pathname, views: Number(r.views), unique: Number(r.uniq),
    }));

    // ── Top countries ─────────────────────────────────────────────
    const topCountriesR = await db.execute({
      sql: `SELECT country, country_code, COUNT(*) as views
            FROM analytics_pageviews
            WHERE created_at >= ${since} AND country IS NOT NULL AND country != 'Unknown'
            GROUP BY country ORDER BY views DESC LIMIT 10`,
      args: [],
    });
    const topCountries = topCountriesR.rows.map((r: any) => ({
      country: r.country, countryCode: r.country_code, views: Number(r.views),
    }));

    // ── Top referrers ─────────────────────────────────────────────
    const topReferrersR = await db.execute({
      sql: `SELECT referrer, COUNT(*) as views
            FROM analytics_pageviews
            WHERE created_at >= ${since} AND referrer IS NOT NULL AND referrer != ''
            GROUP BY referrer ORDER BY views DESC LIMIT 8`,
      args: [],
    });
    const topReferrers = topReferrersR.rows.map((r: any) => ({
      referrer: r.referrer, views: Number(r.views),
    }));

    // ── Daily / weekly chart ──────────────────────────────────────
    const fmt = dailyGroupFormat(range);
    const dailyR = await db.execute({
      sql: `SELECT ${fmt} as day, COUNT(*) as views, COUNT(DISTINCT ip_hash) as unique_visitors
            FROM analytics_pageviews
            WHERE created_at >= ${since}
            GROUP BY day ORDER BY day ASC`,
      args: [],
    });
    const daily = dailyR.rows.map((r: any) => ({
      day: r.day, views: Number(r.views), unique: Number(r.unique_visitors),
    }));

    // ── Device breakdown ──────────────────────────────────────────
    const devicesR = await db.execute({
      sql: `SELECT device_type, COUNT(*) as views
            FROM analytics_pageviews
            WHERE created_at >= ${since} AND device_type IS NOT NULL
            GROUP BY device_type ORDER BY views DESC`,
      args: [],
    });
    const devices = devicesR.rows.map((r: any) => ({
      device: r.device_type, views: Number(r.views),
    }));

    // ── Browser breakdown ─────────────────────────────────────────
    const browsersR = await db.execute({
      sql: `SELECT browser, COUNT(*) as views
            FROM analytics_pageviews
            WHERE created_at >= ${since} AND browser IS NOT NULL
            GROUP BY browser ORDER BY views DESC LIMIT 6`,
      args: [],
    });
    const browsers = browsersR.rows.map((r: any) => ({
      browser: r.browser, views: Number(r.views),
    }));

    // ── Unique sessions ───────────────────────────────────────────
    const sessionsR = await db.execute({
      sql: `SELECT COUNT(DISTINCT session_id) as c FROM analytics_pageviews WHERE created_at >= ${since} AND session_id IS NOT NULL`,
      args: [],
    });
    const uniqueSessions = Number((sessionsR.rows[0] as any).c);

    // ── Live feed ─────────────────────────────────────────────────
    const recentR = await db.execute(`
      SELECT pathname, country, device_type, browser, created_at
      FROM analytics_pageviews
      ORDER BY created_at DESC LIMIT 25
    `);
    const recent = recentR.rows.map((r: any) => ({
      pathname: r.pathname,
      country: r.country,
      device: r.device_type,
      browser: r.browser,
      createdAt: r.created_at,
    }));

    return NextResponse.json({
      range,
      stats,
      trend,
      uniqueSessions,
      topPages,
      topCountries,
      topReferrers,
      daily,
      devices,
      browsers,
      recent,
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
