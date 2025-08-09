import { Metadata } from "next";
import { BlogPost } from "@/components/BlogPost";
import { notFound } from "next/navigation";
import pool from "@/lib/db";

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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM blogs WHERE slug = ? AND is_published = 1',
        [params.slug]
      ) as [DatabasePost[], any];
      
      if (rows.length === 0) {
        return {
          title: "Post Not Found",
          description: "The requested blog post could not be found.",
        };
      }

      const post = rows[0];
      
      return {
        title: `${post.title} | Abdo Raquibi - Full-Stack Developer`,
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
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM blogs WHERE slug = ? AND is_published = 1',
        [params.slug]
      ) as [DatabasePost[], any];
      
      if (rows.length === 0) {
        notFound();
      }

      const post = rows[0];
      
      // Transform the database post to match the component interface
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
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    notFound();
  }
}
