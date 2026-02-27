import { NextResponse } from 'next/server';
import { getPublishedProjects } from '@/lib/projectUtils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await getPublishedProjects();
    console.log('[/api/projects] returning', projects.length, 'published projects');
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects', projects: [] }, { status: 500 });
  }
}
