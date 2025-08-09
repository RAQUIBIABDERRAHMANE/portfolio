import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Fetch all published blogs ordered by date (newest first)
      const [rows] = await connection.execute(
        'SELECT * FROM blogs WHERE is_published = 1 ORDER BY date DESC'
      );
      
      return NextResponse.json({ blogs: rows });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
