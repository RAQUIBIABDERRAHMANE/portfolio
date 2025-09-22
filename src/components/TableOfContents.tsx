"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { List, ChevronRight } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Extraire les titres du contenu markdown
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extractedHeadings: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      extractedHeadings.push({ id, text, level });
    }

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(heading => 
        document.getElementById(heading.id)
      ).filter(Boolean);

      const currentHeading = headingElements.find(element => {
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentHeading) {
        setActiveHeading(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-8">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg mb-4 hover:bg-gray-800/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <List className="w-4 h-4" />
          <span className="text-sm font-medium">Table des matières</span>
        </div>
        <ChevronRight 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
        />
      </button>

      {/* Table of Contents */}
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 'auto',
          opacity: isOpen ? 1 : 1 
        }}
        className={`${isOpen ? 'block' : 'hidden lg:block'}`}
      >
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <List className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-medium text-white">Table des matières</h3>
          </div>
          
          <nav className="space-y-2">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`
                  block w-full text-left text-sm transition-colors hover:text-blue-300
                  ${activeHeading === heading.id 
                    ? 'text-blue-400 font-medium' 
                    : 'text-gray-400'
                  }
                `}
                style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      </motion.div>
    </div>
  );
};