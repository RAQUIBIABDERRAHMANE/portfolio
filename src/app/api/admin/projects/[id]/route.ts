import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/projectUtils';
import { getUser } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const project = await getProjectById(Number(params.id));
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();

    if (body.results !== undefined && typeof body.results !== 'string') {
      body.results = JSON.stringify(body.results);
    }
    if (body.download_files !== undefined && typeof body.download_files !== 'string') {
      body.download_files = JSON.stringify(body.download_files);
    }

    const project = await updateProject(Number(params.id), body);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Project updated', project });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const success = await deleteProject(Number(params.id));
    if (!success) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
