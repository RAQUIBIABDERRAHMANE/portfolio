import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { getAllMcpKeys, addMcpKey, updateMcpKey, deleteMcpKey } from '@/lib/mcpKeysUtils';

// GET all keys
export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const keys = await getAllMcpKeys();
    return NextResponse.json({ keys });
  } catch (error) {
    console.error('Error fetching MCP keys:', error);
    return NextResponse.json({ error: 'Failed to fetch MCP keys' }, { status: 500 });
  }
}

// CREATE new key
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { name, permissions } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const permsArray = Array.isArray(permissions) && permissions.length > 0 ? permissions : ['read_only'];
    const newKey = await addMcpKey(name, permsArray);
    return NextResponse.json({ key: newKey });
  } catch (error) {
    console.error('Error creating MCP key:', error);
    return NextResponse.json({ error: 'Failed to create MCP key' }, { status: 500 });
  }
}

// UPDATE (activate/deactivate) key
export async function PUT(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id, is_active } = await request.json();
    if (id === undefined || is_active === undefined) {
      return NextResponse.json({ error: 'ID and is_active are required' }, { status: 400 });
    }

    const updatedKey = await updateMcpKey(id, is_active);
    return NextResponse.json({ key: updatedKey });
  } catch (error) {
    console.error('Error updating MCP key:', error);
    return NextResponse.json({ error: 'Failed to update MCP key' }, { status: 500 });
  }
}

// DELETE key
export async function DELETE(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteMcpKey(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting MCP key:', error);
    return NextResponse.json({ error: 'Failed to delete MCP key' }, { status: 500 });
  }
}
