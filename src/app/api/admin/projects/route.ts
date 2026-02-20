import { NextResponse } from 'next/server';
import { getAllProjects, addProject } from '@/lib/projectUtils';
import { getUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const projects = await getAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, company, year, description, results, link, link_text, image_url, color, download_files, is_published, is_featured, sort_order } = body;

    if (!title || !company || !year) {
      return NextResponse.json({ error: 'title, company and year are required' }, { status: 400 });
    }

    const project = await addProject({
      title,
      company,
      year,
      description: description || '',
      results: typeof results === 'string' ? results : JSON.stringify(results || []),
      link: link || '',
      link_text: link_text || 'View Project',
      image_url: image_url || '',
      color: color || 'from-cyan-500 to-blue-500',
      download_files: typeof download_files === 'string' ? download_files : JSON.stringify(download_files || []),
      is_published: is_published ?? true,
      is_featured: is_featured ?? false,
      sort_order: sort_order ?? 0,
    });

    if (!project) {
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Project created successfully', project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
