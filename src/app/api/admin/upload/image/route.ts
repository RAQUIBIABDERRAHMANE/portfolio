import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Type non autorisé: ${file.type}. Acceptés: JPG, PNG, WebP, GIF, SVG` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image trop lourde. Max 5 MB.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeBase = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .slice(0, 60);
    const filename = `${safeBase}_${Date.now()}.${ext}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'projects', 'images');
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(join(uploadDir, filename), new Uint8Array(bytes));

    return NextResponse.json({
      url: `/uploads/projects/images/${filename}`,
      filename,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
