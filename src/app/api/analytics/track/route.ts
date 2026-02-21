import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/sqlite';
import crypto from 'crypto';

const COUNTRY_NAMES: Record<string, string> = {
  MA: 'Morocco', FR: 'France', US: 'United States', GB: 'United Kingdom',
  DE: 'Germany', CA: 'Canada', AU: 'Australia', NL: 'Netherlands',
  BE: 'Belgium', CH: 'Switzerland', ES: 'Spain', IT: 'Italy',
  PT: 'Portugal', DZ: 'Algeria', TN: 'Tunisia', SN: 'Senegal',
  CI: "Côte d'Ivoire", CM: 'Cameroon', AE: 'UAE', SA: 'Saudi Arabia',
  EG: 'Egypt', TR: 'Turkey', IN: 'India', CN: 'China', JP: 'Japan',
  BR: 'Brazil', MX: 'Mexico', AR: 'Argentina', ZA: 'South Africa',
  NG: 'Nigeria', GH: 'Ghana', KE: 'Kenya', PL: 'Poland', SE: 'Sweden',
  NO: 'Norway', DK: 'Denmark', FI: 'Finland', RU: 'Russia', UA: 'Ukraine',
  LY: 'Libya', MR: 'Mauritania', ML: 'Mali', SG: 'Singapore', MY: 'Malaysia',
  ID: 'Indonesia', PH: 'Philippines', VN: 'Vietnam', TH: 'Thailand',
  PK: 'Pakistan', BD: 'Bangladesh', LB: 'Lebanon', QA: 'Qatar',
  KW: 'Kuwait', IQ: 'Iraq', JO: 'Jordan', IL: 'Israel',
  CO: 'Colombia', CL: 'Chile', PE: 'Peru',
  CZ: 'Czech Republic', HU: 'Hungary', RO: 'Romania', GR: 'Greece',
  AT: 'Austria', IE: 'Ireland', NZ: 'New Zealand',
};

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'analytics_salt_2026').digest('hex').slice(0, 16);
}

function isBot(ua: string): boolean {
  return /bot|crawl|spider|slurp|bingbot|googlebot|yandex|baidu|duckduck|semrush|ahrefs|lighthouse|prerender|headless|python-requests|axios\/|curl\/|wget\/|java\/|go-http|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegram/i.test(ua);
}

function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad|playbook|silk|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|windows phone|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\/|OPR\//i.test(ua)) return 'Opera';
  if (/chrome\/\d/i.test(ua) && !/chromium/i.test(ua)) return 'Chrome';
  if (/firefox\/\d/i.test(ua)) return 'Firefox';
  if (/safari\/\d/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  return 'Other';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pathname, referrer, sessionId } = body;

    if (!pathname || typeof pathname !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return NextResponse.json({ ok: true });
    }

    const userAgent = request.headers.get('user-agent') || '';
    if (isBot(userAgent)) return NextResponse.json({ ok: true });

    // IP hash (RGPD-safe)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '0.0.0.0';
    const ipHash = hashIp(ip);

    // Deduplication: same session + pathname within 30 min → skip
    if (sessionId) {
      const dup = await db.execute({
        sql: `SELECT id FROM analytics_pageviews
              WHERE session_id = ? AND pathname = ?
                AND created_at >= datetime('now', '-30 minutes')
              LIMIT 1`,
        args: [sessionId, pathname.slice(0, 200)],
      });
      if (dup.rows.length > 0) return NextResponse.json({ ok: true });
    }

    // Country via Vercel/Cloudflare header — no external API
    const countryCode = request.headers.get('x-vercel-ip-country') ||
                        request.headers.get('cf-ipcountry') || '';
    const country = countryCode ? (COUNTRY_NAMES[countryCode] || countryCode) : 'Unknown';

    // Referrer
    let cleanRef = referrer || '';
    try {
      if (cleanRef && cleanRef !== 'direct') {
        const url = new URL(cleanRef);
        cleanRef = url.hostname;
        if (cleanRef.includes('raquibi.com') || cleanRef.includes('localhost')) cleanRef = '';
      }
    } catch { cleanRef = ''; }

    const device = detectDevice(userAgent);
    const browser = detectBrowser(userAgent);

    await db.execute({
      sql: `INSERT INTO analytics_pageviews
              (pathname, referrer, country, country_code, user_agent, ip_hash, session_id, device_type, browser)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        pathname.slice(0, 200),
        cleanRef || null,
        country || null,
        countryCode || null,
        userAgent.slice(0, 200) || null,
        ipHash,
        sessionId || null,
        device,
        browser,
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
