"use client";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, User, Twitter, Facebook, Linkedin, MessageCircle, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

// Blog post interface
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  read_time: string;
  category: string;
  tags: string;
  image: string;
}

export const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedPostId, setCopiedPostId] = useState<number | null>(null);

  // Fetch featured blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs/featured');
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data.blogs);
        } else {
          console.error('Failed to fetch blogs');
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleCopyLink = async (slug: string, postId: number) => {
    const url = `${window.location.origin}/blog/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const getShareLinks = (post: BlogPost) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`;
    const title = post.title;
    
    return [
      {
        name: 'Twitter',
        icon: Twitter,
        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        color: 'hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/30',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-300'
      },
      {
        name: 'Facebook',
        icon: Facebook,
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        color: 'hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-600/30',
        bgColor: 'bg-blue-600/20',
        borderColor: 'border-blue-600/30',
        textColor: 'text-blue-400'
      },
      {
        name: 'LinkedIn',
        icon: Linkedin,
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        color: 'hover:bg-blue-700/20 hover:text-blue-500 hover:border-blue-700/30',
        bgColor: 'bg-blue-700/20',
        borderColor: 'border-blue-700/30',
        textColor: 'text-blue-500'
      },
      {
        name: 'WhatsApp',
        icon: MessageCircle,
        href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
        color: 'hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/30',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-300'
      }
    ];
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const hoverVariants = {
    hover: { y: -5, transition: { duration: 0.2 } },
  };

  // Show loading state
  if (loading) {
    return (
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Latest from the{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Blog
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Loading latest blog posts...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no blogs
  if (blogPosts.length === 0) {
    return (
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Latest from the{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Blog
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              No blog posts available at the moment. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20">
      {/* Background shadow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/40 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Latest from the{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Blog
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Insights, tutorials, and thoughts on web development, technology, and the future of digital experiences.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
          >
            {/* Shadow effect for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/10 to-gray-900/30 rounded-3xl transform translate-y-8 scale-95 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/5 to-gray-900/20 rounded-3xl transform translate-y-16 scale-90 pointer-events-none"></div>
            
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                whileHover="hover"
                variants={hoverVariants}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 relative z-10 shadow-2xl"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Share Buttons */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Share:</span>
                      {getShareLinks(post).map((link) => {
                        const IconComponent = link.icon;
                        return (
                          <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 ${link.bgColor} ${link.borderColor} ${link.textColor} border rounded-lg transition-all duration-200 ${link.color} hover:scale-105`}
                            title={`Share on ${link.name}`}
                          >
                            <IconComponent className="w-3 h-3" />
                          </a>
                        );
                      })}
                      
                      <button
                        onClick={() => handleCopyLink(post.slug, post.id)}
                        className={`p-2 border rounded-lg transition-all duration-200 hover:scale-105 ${
                          copiedPostId === post.id 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white'
                        }`}
                        title={copiedPostId === post.id ? 'Link copied!' : 'Copy link'}
                      >
                        {copiedPostId === post.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  
                  <motion.a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium group-hover:gap-3 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <a
              href="/blog"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Posts
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
