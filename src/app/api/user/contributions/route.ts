import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import db from '@/lib/sqlite';

export async function GET(request: NextRequest) {
  const user = getUser();
  if (!user || !user.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await db.execute({
      sql: `
        SELECT c.* 
        FROM contributions c
        JOIN contribution_members cm ON c.id = cm.contribution_id
        WHERE cm.user_id = ?
        ORDER BY cm.joined_at DESC
      `,
      args: [user.userId]
    });
    
    // Parse JSON
    const contributions = result.rows.map((row: any) => {
      let techParsed = [];
      try { techParsed = JSON.parse(row.techStack || '[]'); } catch {}
      return {
        id: Number(row.id),
        title: String(row.title),
        description: String(row.description || ''),
        techStack: techParsed,
        color: String(row.color),
        link: String(row.link || '')
      };
    });

    return NextResponse.json(contributions);
  } catch (error) {
    console.error('Error fetching user joined contributions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
