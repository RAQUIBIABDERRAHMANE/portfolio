import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { tempBlogs, getNextId } from '@/lib/tempData';

export async function GET() {
  try {
    // Try to connect to MySQL database first
    try {
      const [rows] = await pool.execute(
        'SELECT id, title, slug, excerpt, content, author, date, read_time, category, tags, is_published, is_featured, view_count FROM blogs ORDER BY date DESC'
      );
      console.log('Successfully retrieved data from MySQL database');
      return NextResponse.json({ blogs: rows, source: 'mysql' });
    } catch (dbError) {
      console.log('MySQL connection failed, using temporary data:', dbError.message);
      // Fallback to temporary data if database connection fails
      return NextResponse.json({ blogs: tempBlogs, source: 'temp', error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      read_time,
      tags,
      is_published,
      is_featured
    } = await request.json();

    // Validate required fields
    if (!title || !slug || !excerpt || !content || !category || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = tempBlogs.find(blog => blog.slug === slug);
    if (existing) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

    // Create new blog post
    const newBlog = {
      id: getNextId(),
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      read_time: read_time || '5 min read',
      tags: tags || '',
      is_published: is_published || false,
      is_featured: is_featured || false,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      view_count: 0
    };

    // Add to temporary storage
    tempBlogs.unshift(newBlog); // Add to beginning for newest first

    return NextResponse.json(
      { 
        message: 'Post created successfully',
        blog: newBlog
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
