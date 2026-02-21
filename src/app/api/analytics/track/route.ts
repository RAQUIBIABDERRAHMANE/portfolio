import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/sqlite';
import crypto from 'crypto';

// Country names from ISO codes (common ones)
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
};

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'analytics_salt_2026').digest('hex').slice(0, 16);
}

function isBot(ua: string): boolean {
  return /bot|crawl|spider|slurp|bingbot|googlebot|yandex|baidu|duckduck|semrush|ahrefs/i.test(ua);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pathname, referrer } = body;

    if (!pathname || typeof pathname !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Skip admin pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return NextResponse.json({ ok: true });
    }

    const userAgent = request.headers.get('user-agent') || '';
    if (isBot(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    // Get IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '0.0.0.0';
    const ipHash = hashIp(ip);

    // Country from Vercel header (free, no API call needed)
    const countryCode = request.headers.get('x-vercel-ip-country') || 
                        request.headers.get('cf-ipcountry') || '';
    const country = countryCode ? (COUNTRY_NAMES[countryCode] || countryCode) : 'Unknown';

    // Clean referrer
    let cleanRef = referrer || '';
    try {
      if (cleanRef && cleanRef !== 'direct') {
        const url = new URL(cleanRef);
        cleanRef = url.hostname;
        // Don't store self-referrals
        if (cleanRef.includes('raquibi.com') || cleanRef.includes('localhost')) {
          cleanRef = '';
        }
      }
    } catch { cleanRef = ''; }

    const ua = userAgent.slice(0, 200);

    await db.execute({
      sql: `INSERT INTO analytics_pageviews (pathname, referrer, country, country_code, user_agent, ip_hash)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [pathname.slice(0, 200), cleanRef || null, country || null, countryCode || null, ua || null, ipHash],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
