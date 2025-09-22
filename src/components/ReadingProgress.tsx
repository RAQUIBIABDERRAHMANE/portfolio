"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ReadingProgressProps {
  target: React.RefObject<HTMLElement>;
}

export const ReadingProgress = ({ target }: ReadingProgressProps) => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      if (!target.current) return;

      const element = target.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const windowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

      if (totalHeight > 0) {
        setReadingProgress((windowScrollTop / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', updateReadingProgress);
    updateReadingProgress();

    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, [target]);

  return (
    <motion.div 
      className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        style={{ width: `${readingProgress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

export const ReadingTime = ({ content }: { content: string }) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);

  return (
    <span className="text-gray-400 text-sm">
      {readingTime} min de lecture
    </span>
  );
};