import { NextResponse } from 'next/server';
import { getAllBlogs, addBlog, updateBlog, deleteBlog } from '@/lib/blogUtils';
import { getUser, isUserActive } from '@/lib/auth';

// GET all blogs (admin only)
export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const blogs = await getAllBlogs();
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST create new blog (admin only)
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
      is_featured,
      image,
      meta_description,
      meta_keywords,
      date
    } = await request.json();

    // Validate required fields
    if (!title || !slug || !excerpt || !content || !category || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const blogData = {
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
      image: image || '',
      meta_description: meta_description || excerpt,
      meta_keywords: meta_keywords || '',
      date: date || new Date().toISOString().split('T')[0]
    };

    const newBlog = await addBlog(blogData);

    if (!newBlog) {
      return NextResponse.json(
        { error: 'Failed to create blog' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Blog created successfully', blog: newBlog },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
