import { NextResponse } from 'next/server';
import { getFeaturedBlogs } from '@/lib/blogUtils';

export async function GET() {
  try {
    // Récupérer les blogs mis en avant (limité à 6 pour la page d'accueil)
    const featuredBlogs = getFeaturedBlogs(6);
    
    return NextResponse.json({ blogs: featuredBlogs });
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return NextResponse.json(
      { error: 'Échec de la récupération des blogs mis en avant' },
      { status: 500 }
    );
  }
}
