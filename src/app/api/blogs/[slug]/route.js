import { NextResponse } from 'next/server';
import { getBlogBySlug, incrementViewCount } from '@/lib/blogUtils';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    // Récupérer le blog par slug
    const blog = await getBlogBySlug(slug);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Article de blog non trouvé' },
        { status: 404 }
      );
    }
    
    // Incrémenter le nombre de vues
    await incrementViewCount(slug);
    
    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Échec de la récupération de l\'article de blog' },
      { status: 500 }
    );
  }
}
