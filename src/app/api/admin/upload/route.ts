import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Allowed extensions for project downloads
const ALLOWED_EXTENSIONS = [
  '.apk', '.aab', '.ipa',          // Mobile apps
  '.exe', '.msi', '.dmg', '.deb',  // Desktop apps
  '.zip', '.tar.gz', '.gz', '.rar', // Archives
  '.pdf',                           // Documents
  '.jar', '.war',                   // Java
];

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const displayName = formData.get('name') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `File too large. Max ${MAX_SIZE / 1024 / 1024} MB.` }, { status: 400 });
    }

    // Check extension
    const originalName = file.name;
    const ext = ('.' + originalName.split('.').pop()).toLowerCase();
    const isAllowed = ALLOWED_EXTENSIONS.some((e) =>
      e === ext || originalName.toLowerCase().endsWith(e)
    );
    if (!isAllowed) {
      return NextResponse.json(
        { error: `File type "${ext}" is not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }

    // Build a safe unique filename
    const timestamp = Date.now();
    const safeBase = originalName
      .replace(/\.[^.]+$/, '') // remove extension
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .slice(0, 60);
    const filename = `${safeBase}_${timestamp}${ext}`;

    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'projects');
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    await writeFile(join(uploadDir, filename), buffer);

    const url = `/uploads/projects/${filename}`;

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: {
        name: displayName || originalName,
        filename,
        url,
        size: file.size,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
