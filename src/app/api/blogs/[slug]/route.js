import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const connection = await pool.getConnection();
    
    try {
      // Fetch blog by slug
      const [rows] = await connection.execute(
        'SELECT * FROM blogs WHERE slug = ? AND is_published = 1',
        [slug]
      );
      
      if (rows.length === 0) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
      
      // Increment view count
      await connection.execute(
        'UPDATE blogs SET view_count = view_count + 1 WHERE slug = ?',
        [slug]
      );
      
      return NextResponse.json({ blog: rows[0] });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
