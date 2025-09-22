import { NextResponse } from 'next/server';
import { getPublishedBlogs, addBlog } from '@/lib/blogUtils';

export async function GET() {
  try {
    const blogs = getPublishedBlogs();
    return NextResponse.json({ 
      blogs: blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      source: 'json' 
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
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
      is_featured,
      image,
      meta_description,
      meta_keywords
    } = await request.json();

    // Valider les champs requis
    if (!title || !slug || !excerpt || !content || !category || !author) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Créer le nouveau blog
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
      date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
    };

    const newBlog = addBlog(blogData);

    if (!newBlog) {
      return NextResponse.json(
        { error: 'Échec de la création du blog' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Blog créé avec succès',
        blog: newBlog
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Échec de la création du blog' },
      { status: 500 }
    );
  }
}
