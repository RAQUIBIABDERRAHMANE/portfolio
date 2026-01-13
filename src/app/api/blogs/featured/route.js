import { NextResponse } from 'next/server';
import { getFeaturedBlogs } from '@/lib/blogUtils';

export async function GET() {
  try {
    // Get featured blogs (limited to 6 for homepage)
    const featuredBlogs = await getFeaturedBlogs(6);
    
    return NextResponse.json({ blogs: featuredBlogs });
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured blogs' },
      { status: 500 }
    );
  }
}
