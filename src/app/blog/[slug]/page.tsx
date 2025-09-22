import { Metadata } from "next";
import { BlogPost } from "@/components/BlogPost";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

interface DatabasePost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  read_time: string;
  category: string;
  tags: string;
  image: string;
  meta_description: string;
  meta_keywords: string;
  view_count: number;
}

// Fonction pour récupérer un blog depuis l'API
async function fetchBlogBySlug(slug: string): Promise<DatabasePost | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: 'no-store' // Désactiver le cache pour avoir les données les plus récentes
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await fetchBlogBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Article Non Trouvé",
      description: "L'article de blog demandé n'a pas pu être trouvé.",
    };
  }
  
  return {
    title: `${post.title} | Abdo Raquibi - Développeur Full-Stack`,
    description: post.excerpt,
    keywords: post.meta_keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await fetchBlogBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  // Transformer le post de la base de données pour correspondre à l'interface du composant
  const transformedPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    date: post.date,
    read_time: post.read_time,
    category: post.category,
    tags: post.tags,
    image: post.image,
    meta_description: post.meta_description,
    view_count: post.view_count,
  };

  return <BlogPost post={transformedPost} />;
}
