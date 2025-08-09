-- Create blogs table for portfolio blog system (MySQL/phpMyAdmin compatible)
-- Copy and paste this entire script into phpMyAdmin SQL tab

CREATE TABLE IF NOT EXISTS `blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` longtext NOT NULL,
  `author` varchar(100) NOT NULL,
  `date` date NOT NULL DEFAULT CURRENT_DATE,
  `read_time` varchar(20) NOT NULL,
  `category` varchar(100) NOT NULL,
  `tags` text,
  `image` varchar(500) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `meta_keywords` varchar(500) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category` (`category`),
  KEY `date` (`date`),
  KEY `is_published` (`is_published`),
  KEY `is_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO `blogs` (`title`, `slug`, `excerpt`, `content`, `author`, `date`, `read_time`, `category`, `tags`, `image`, `meta_description`, `is_featured`) VALUES
('Getting Started with Next.js 14', 'getting-started-with-nextjs-14', 'Learn the fundamentals of Next.js 14 and build your first modern web application with the latest features and best practices.', '<h2>Introduction</h2><p>Next.js 14 brings exciting new features that make building modern web applications easier than ever...</p><h2>Key Features</h2><ul><li>App Router</li><li>Server Components</li><li>Improved Performance</li></ul>', 'John Doe', '2024-01-15', '5 min read', 'Web Development', 'Next.js,React,JavaScript,Web Development', '/images/nextjs-blog.jpg', 'Learn Next.js 14 fundamentals and build modern web applications with the latest features and best practices.', 1),
('Mastering TypeScript for React Developers', 'mastering-typescript-for-react-developers', 'Take your React development to the next level with TypeScript. Learn type safety, interfaces, and advanced patterns.', '<h2>Why TypeScript?</h2><p>TypeScript adds static typing to JavaScript, making your code more reliable and maintainable...</p><h2>Basic Types</h2><p>Let''s explore the fundamental types in TypeScript...</p>', 'John Doe', '2024-01-10', '8 min read', 'Programming', 'TypeScript,React,JavaScript,Programming', '/images/typescript-blog.jpg', 'Master TypeScript for React development with type safety, interfaces, and advanced patterns.', 1),
('Building Beautiful UIs with Tailwind CSS', 'building-beautiful-uis-with-tailwind-css', 'Discover how to create stunning user interfaces using Tailwind CSS utility-first approach and modern design principles.', '<h2>What is Tailwind CSS?</h2><p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML...</p><h2>Getting Started</h2><p>Let''s set up Tailwind CSS in your project...</p>', 'John Doe', '2024-01-05', '6 min read', 'Design', 'CSS,Tailwind CSS,Design,Frontend', '/images/tailwind-blog.jpg', 'Learn to build beautiful UIs with Tailwind CSS utility-first approach and modern design principles.', 0);
