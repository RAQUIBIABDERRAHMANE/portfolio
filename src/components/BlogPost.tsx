"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Twitter, Facebook, Linkedin, MessageCircle, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { TableOfContents } from './TableOfContents';
import 'highlight.js/styles/github-dark.css';

interface BlogPostProps {
  post: {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    read_time: string;
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
                   <span>{post.read_time}</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Desktop Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <TableOfContents content={post.content} />
            </div>

            {/* Main Content */}
            <motion.article
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="lg:col-span-3 order-1 lg:order-2"
            >
              <motion.div
                variants={itemVariants}
                className="prose prose-lg prose-invert max-w-none prose-slate
                  prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-700 prose-h2:pb-2
                  prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6
                  prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-5
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-li:text-gray-300 prose-li:mb-2
                  prose-strong:text-white prose-strong:font-semibold
                  prose-code:bg-gray-800 prose-code:text-blue-300 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                  prose-pre:code:bg-transparent prose-pre:code:p-0 prose-pre:code:text-gray-300
                  prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400 prose-blockquote:my-6
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-table:border-collapse prose-th:border prose-th:border-gray-600 prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-white
                  prose-td:border prose-td:border-gray-600 prose-td:p-3 prose-td:text-gray-300"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    h1: ({ children }) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                      return (
                        <h1 id={id} className="text-4xl font-bold text-white mb-6 mt-8 leading-tight scroll-mt-8">
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children }) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                      return (
                        <h2 id={id} className="text-3xl font-bold text-white mb-5 mt-8 border-b border-gray-700 pb-2 leading-tight scroll-mt-8">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                      return (
                        <h3 id={id} className="text-2xl font-semibold text-white mb-4 mt-6 leading-tight scroll-mt-8">
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children }) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                      return (
                        <h4 id={id} className="text-xl font-semibold text-white mb-3 mt-5 scroll-mt-8">
                          {children}
                        </h4>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-gray-300 leading-relaxed mb-4 text-lg">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-300 mb-4 ml-4 space-y-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-gray-300 mb-4 ml-4 space-y-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-300 mb-2 leading-relaxed">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">
                        {children}
                      </strong>
                    ),
                    code: ({ children, className, ...props }) => (
                      <code 
                        className={`bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm font-mono ${className || ''}`}
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-6 relative">
                        <div className="absolute top-2 right-2 text-xs text-gray-500 uppercase tracking-wide">
                          Code
                        </div>
                        {children}
                      </pre>
                    ),
                    a: ({ children, href }) => (
                      <a 
                        href={href} 
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-6 bg-gray-800/30 py-4 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-6">
                        <table className="min-w-full border-collapse border border-gray-600 rounded-lg overflow-hidden">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-800">
                        {children}
                      </thead>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-600 p-3 text-left font-semibold text-white">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-600 p-3 text-gray-300">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </motion.div>
            </motion.article>
          </div>
        </div>

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