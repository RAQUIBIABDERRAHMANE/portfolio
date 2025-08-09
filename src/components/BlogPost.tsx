"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Twitter, Facebook, Linkedin, MessageCircle, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface BlogPostProps {
  post: {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    tags: string;
    image: string;
    slug: string;
  };
}

export const BlogPost = ({ post }: BlogPostProps) => {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`,
      color: 'hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/30',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-300'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: 'hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-600/30',
      bgColor: 'bg-blue-600/20',
      borderColor: 'border-blue-600/30',
      textColor: 'text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      color: 'hover:bg-blue-700/20 hover:text-blue-500 hover:border-blue-700/30',
      bgColor: 'bg-blue-700/20',
      borderColor: 'border-blue-700/30',
      textColor: 'text-blue-500'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + currentUrl)}`,
      color: 'hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/30',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-300'
    }
  ];

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors relative z-10"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Blog
              </Link>
              
              <div className="mb-6">
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {post.title}
              </h1>
              
                             <p className="text-xl text-gray-300 mb-6">
                 {post.excerpt}
               </p>

               {/* Share Options */}
               <div className="mb-6 relative z-10">
                 <span className="text-white font-medium mb-3 block">Share this post:</span>
                 <div className="flex flex-wrap items-center gap-3">
                   {shareLinks.map((link) => {
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
                         <IconComponent className="w-4 h-4" />
                       </a>
                     );
                   })}
                   
                   <button
                     onClick={handleCopyLink}
                     className={`p-2 border rounded-lg transition-all duration-200 hover:scale-105 ${
                       copied 
                         ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                         : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white'
                     }`}
                     title={copied ? 'Link copied!' : 'Copy link'}
                   >
                     {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   </button>
                 </div>
               </div>
               
               <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                 <div className="flex items-center gap-2">
                   <User className="w-4 h-4" />
                   <span>{post.author}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4" />
                   <span>{new Date(post.date).toLocaleDateString('en-US', {
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric'
                   })}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Clock className="w-4 h-4" />
                   <span>{post.readTime}</span>
                 </div>
               </div>
            </motion.div>
          </div>
        </header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        >
          <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.article
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.article>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        >
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {post.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors cursor-pointer"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
        >
          <div className="border-t border-white/10 pt-8 relative z-10">
            <div className="flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};