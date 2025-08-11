"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, Clock, User, Tag, Twitter, Facebook, Linkedin, MessageCircle, Copy, Check, Share2 } from "lucide-react";
import Link from "next/link";

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
  meta_description: string;
}

export const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedPostId, setCopiedPostId] = useState<number | null>(null);
  const postsPerPage = 9;

  // Fetch all blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
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

  // Get unique categories
  const categories = useMemo(() => {
    const cats = blogPosts.map(post => post.category);
    return [...new Set(cats)];
  }, [blogPosts]);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.tags || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10"></div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-6">Blog</h1>
              <p className="text-xl text-gray-300">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-16 pt-32 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-white mb-6">Blog</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore insights, tutorials, and thoughts on web development, technology, and the future of digital experiences.
            </p>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-300 mb-4">No blog posts found.</p>
              <p className="text-gray-400">Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
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

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(post.tags || '').split(',').filter(tag => tag.trim()).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

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
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium group-hover:gap-3 transition-all duration-300"
                    >
                      Read More
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
