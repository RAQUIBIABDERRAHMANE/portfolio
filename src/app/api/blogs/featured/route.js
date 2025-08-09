import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Fetch featured blogs (limit to 6 for the homepage)
      const [rows] = await connection.execute(
        'SELECT * FROM blogs WHERE is_featured = 1 AND is_published = 1 ORDER BY date DESC LIMIT 6'
      );
      
      return NextResponse.json({ blogs: rows });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured blogs' },
      { status: 500 }
    );
  }
}
