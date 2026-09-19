import { Metadata } from "next";
import { BlogPost } from "@/components/BlogPost";
import { notFound } from "next/navigation";
import { getBlogBySlug, incrementViewCount } from "@/lib/blogUtils";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);

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
  const post = await getBlogBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Increment view count asynchronously in background
  incrementViewCount(params.slug).catch(() => {});

  return (
    <>
      <Header />
      <div className="pt-20">
        <BlogPost post={post} />
      </div>
      <Footer />
    </>
  );
}
