-- Create blogs table for portfolio blog system
-- This table stores all blog post information

CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    read_time VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[], -- Array of tags
    image VARCHAR(500), -- URL or path to featured image
    meta_description VARCHAR(500), -- SEO meta description
    meta_keywords VARCHAR(500), -- SEO meta keywords
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(is_featured);

-- Create index on tags array for efficient searching
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON blogs USING GIN(tags);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON blogs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - you can remove this section)
INSERT INTO blogs (
    title, 
    slug, 
    excerpt, 
    content, 
    author, 
    date, 
    read_time, 
    category, 
    tags, 
    image, 
    meta_description,
    is_featured
) VALUES 
(
    'Getting Started with Next.js 14',
    'getting-started-with-nextjs-14',
    'Learn the fundamentals of Next.js 14 and build your first modern web application with the latest features and best practices.',
    '<h2>Introduction</h2><p>Next.js 14 brings exciting new features that make building modern web applications easier than ever...</p><h2>Key Features</h2><ul><li>App Router</li><li>Server Components</li><li>Improved Performance</li></ul>',
    'John Doe',
    '2024-01-15',
    '5 min read',
    'Web Development',
    ARRAY['Next.js', 'React', 'JavaScript', 'Web Development'],
    '/images/nextjs-blog.jpg',
    'Learn Next.js 14 fundamentals and build modern web applications with the latest features and best practices.',
    true
),
(
    'Mastering TypeScript for React Developers',
    'mastering-typescript-for-react-developers',
    'Take your React development to the next level with TypeScript. Learn type safety, interfaces, and advanced patterns.',
    '<h2>Why TypeScript?</h2><p>TypeScript adds static typing to JavaScript, making your code more reliable and maintainable...</p><h2>Basic Types</h2><p>Let''s explore the fundamental types in TypeScript...</p>',
    'John Doe',
    '2024-01-10',
    '8 min read',
    'Programming',
    ARRAY['TypeScript', 'React', 'JavaScript', 'Programming'],
    '/images/typescript-blog.jpg',
    'Master TypeScript for React development with type safety, interfaces, and advanced patterns.',
    true
),
(
    'Building Beautiful UIs with Tailwind CSS',
    'building-beautiful-uis-with-tailwind-css',
    'Discover how to create stunning user interfaces using Tailwind CSS utility-first approach and modern design principles.',
    '<h2>What is Tailwind CSS?</h2><p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML...</p><h2>Getting Started</h2><p>Let''s set up Tailwind CSS in your project...</p>',
    'John Doe',
    '2024-01-05',
    '6 min read',
    'Design',
    ARRAY['CSS', 'Tailwind CSS', 'Design', 'Frontend'],
    '/images/tailwind-blog.jpg',
    'Learn to build beautiful UIs with Tailwind CSS utility-first approach and modern design principles.',
    false
);

-- Create a view for published blogs only
CREATE VIEW published_blogs AS
SELECT * FROM blogs WHERE is_published = true;

-- Create a view for featured blogs
CREATE VIEW featured_blogs AS
SELECT * FROM blogs WHERE is_featured = true AND is_published = true;

-- Grant permissions (adjust as needed for your database setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON blogs TO your_app_user;
-- GRANT USAGE, SELECT ON blogs_id_seq TO your_app_user;
