import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join, extname, basename } from 'path';

// MIME types by extension
const MIME_TYPES: Record<string, string> = {
  '.apk': 'application/vnd.android.package-archive',
  '.aab': 'application/x-authorware-bin',
  '.ipa': 'application/octet-stream',
  '.exe': 'application/x-msdownload',
  '.msi': 'application/x-msi',
  '.dmg': 'application/x-apple-diskimage',
  '.deb': 'application/x-debian-package',
  '.zip': 'application/zip',
  '.tar': 'application/x-tar',
  '.gz':  'application/gzip',
  '.rar': 'application/vnd.rar',
  '.pdf': 'application/pdf',
  '.jar': 'application/java-archive',
  '.war': 'application/java-archive',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }

    // Sanitize: strip leading slashes, prevent path traversal
    const sanitized = filePath
      .replace(/^[/\\]+/, '')           // strip leading slashes
      .replace(/\.\.[/\\]/g, '')        // prevent path traversal
      .replace(/\.\.$/, '');

    if (!sanitized || sanitized.includes('..')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // Only allow serving from uploads/ folder
    if (!sanitized.startsWith('uploads/')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const absolutePath = join(process.cwd(), 'public', sanitized);

    let fileBuffer: Buffer;
    try {
      fileBuffer = await readFile(absolutePath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const ext = extname(absolutePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const friendlyName = basename(absolutePath);

    // Convert Node.js Buffer → ArrayBuffer (compatible avec BodyInit)
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    ) as ArrayBuffer;

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${friendlyName}"`,
        'Content-Length': String(fileBuffer.length),
        'Cache-Control': 'no-cache',
        // Allow mobile browsers / cross-origin downloads
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[/api/download] error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
