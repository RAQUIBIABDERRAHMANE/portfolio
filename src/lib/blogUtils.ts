import db from './sqlite';

export interface Blog {
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
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  created_at?: string;
  updated_at?: string;
}

// Ensure table exists
async function ensureBlogsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT,
      read_time TEXT DEFAULT '5 min read',
      category TEXT NOT NULL,
      tags TEXT,
      image TEXT,
      meta_description TEXT,
      meta_keywords TEXT,
      is_published INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add date column if it doesn't exist (migration for existing tables)
  try {
    await db.execute(`ALTER TABLE blogs ADD COLUMN date TEXT`);
  } catch (e) {
    // Column already exists, ignore
  }
}

// Get published blogs
export async function getPublishedBlogs(): Promise<Blog[]> {
  try {
    await ensureBlogsTable();
    const result = await db.execute('SELECT * FROM blogs WHERE is_published = 1 ORDER BY created_at DESC');
    return result.rows.map((row: any) => ({
      id: Number(row.id),
      title: String(row.title),
      slug: String(row.slug),
      excerpt: String(row.excerpt),
      content: String(row.content),
      author: String(row.author),
      date: String(row.date),
      read_time: String(row.read_time || '5 min read'),
      category: String(row.category),
      tags: String(row.tags || ''),
      image: String(row.image || ''),
      meta_description: String(row.meta_description || ''),
      meta_keywords: String(row.meta_keywords || ''),
      is_published: Boolean(row.is_published),
      is_featured: Boolean(row.is_featured),
      view_count: Number(row.view_count || 0),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }));
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    return [];
  }
}

// Get all blogs (admin)
export async function getAllBlogs(): Promise<Blog[]> {
  try {
    await ensureBlogsTable();
    const result = await db.execute('SELECT * FROM blogs ORDER BY created_at DESC');
    return result.rows.map((row: any) => ({
      id: Number(row.id),
      title: String(row.title),
      slug: String(row.slug),
      excerpt: String(row.excerpt),
      content: String(row.content),
      author: String(row.author),
      date: String(row.date),
      read_time: String(row.read_time || '5 min read'),
      category: String(row.category),
      tags: String(row.tags || ''),
      image: String(row.image || ''),
      meta_description: String(row.meta_description || ''),
      meta_keywords: String(row.meta_keywords || ''),
      is_published: Boolean(row.is_published),
      is_featured: Boolean(row.is_featured),
      view_count: Number(row.view_count || 0),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }));
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    return [];
  }
}

// Get featured blogs
export async function getFeaturedBlogs(limit?: number): Promise<Blog[]> {
  try {
    await ensureBlogsTable();
    let sql = 'SELECT * FROM blogs WHERE is_featured = 1 AND is_published = 1 ORDER BY created_at DESC';
    if (limit) sql += ` LIMIT ${Number(limit)}`;
    const result = await db.execute(sql);
    return result.rows.map((row: any) => ({
      id: Number(row.id),
      title: String(row.title),
      slug: String(row.slug),
      excerpt: String(row.excerpt),
      content: String(row.content),
      author: String(row.author),
      date: String(row.date),
      read_time: String(row.read_time || '5 min read'),
      category: String(row.category),
      tags: String(row.tags || ''),
      image: String(row.image || ''),
      meta_description: String(row.meta_description || ''),
      meta_keywords: String(row.meta_keywords || ''),
      is_published: Boolean(row.is_published),
      is_featured: Boolean(row.is_featured),
      view_count: Number(row.view_count || 0),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }));
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return [];
  }
}

// Get blog by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    await ensureBlogsTable();
    const result = await db.execute({
      sql: 'SELECT * FROM blogs WHERE slug = ? AND is_published = 1 LIMIT 1',
      args: [slug]
    });
    if (result.rows.length === 0) return null;
    const row = result.rows[0] as any;
    return {
      id: Number(row.id),
      title: String(row.title),
      slug: String(row.slug),
      excerpt: String(row.excerpt),
      content: String(row.content),
      author: String(row.author),
      date: String(row.date),
      read_time: String(row.read_time || '5 min read'),
      category: String(row.category),
      tags: String(row.tags || ''),
      image: String(row.image || ''),
      meta_description: String(row.meta_description || ''),
      meta_keywords: String(row.meta_keywords || ''),
      is_published: Boolean(row.is_published),
      is_featured: Boolean(row.is_featured),
      view_count: Number(row.view_count || 0),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    };
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

// Get blog by ID
export async function getBlogById(id: number): Promise<Blog | null> {
  try {
    await ensureBlogsTable();
    const result = await db.execute({
      sql: 'SELECT * FROM blogs WHERE id = ? LIMIT 1',
      args: [id]
    });
    if (result.rows.length === 0) return null;
    const row = result.rows[0] as any;
    return {
      id: Number(row.id),
      title: String(row.title),
      slug: String(row.slug),
      excerpt: String(row.excerpt),
      content: String(row.content),
      author: String(row.author),
      date: String(row.date),
      read_time: String(row.read_time || '5 min read'),
      category: String(row.category),
      tags: String(row.tags || ''),
      image: String(row.image || ''),
      meta_description: String(row.meta_description || ''),
      meta_keywords: String(row.meta_keywords || ''),
      is_published: Boolean(row.is_published),
      is_featured: Boolean(row.is_featured),
      view_count: Number(row.view_count || 0),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    };
  } catch (error) {
    console.error('Error fetching blog by id:', error);
    return null;
  }
}

// Add blog
export async function addBlog(blogData: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<Blog | null> {
  try {
    await ensureBlogsTable();
    const result = await db.execute({
      sql: `INSERT INTO blogs (title, slug, excerpt, content, author, date, read_time, category, tags, image, meta_description, meta_keywords, is_published, is_featured, view_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        blogData.title,
        blogData.slug,
        blogData.excerpt,
        blogData.content,
        blogData.author,
        blogData.date || new Date().toISOString().split('T')[0],
        blogData.read_time || '5 min read',
        blogData.category,
        blogData.tags || '',
        blogData.image || '',
        blogData.meta_description || blogData.excerpt,
        blogData.meta_keywords || '',
        blogData.is_published ? 1 : 0,
        blogData.is_featured ? 1 : 0,
      ]
    });
    return getBlogById(Number(result.lastInsertRowid));
  } catch (error) {
    console.error('Error adding blog:', error);
    return null;
  }
}

// Update blog
export async function updateBlog(id: number, updates: Partial<Omit<Blog, 'id' | 'created_at' | 'updated_at'>>): Promise<Blog | null> {
  try {
    await ensureBlogsTable();
    const fields: string[] = [];
    const params: any[] = [];
    
    if (updates.title) { fields.push('title = ?'); params.push(updates.title); }
    if (updates.slug) { fields.push('slug = ?'); params.push(updates.slug); }
    if (updates.excerpt) { fields.push('excerpt = ?'); params.push(updates.excerpt); }
    if (updates.content) { fields.push('content = ?'); params.push(updates.content); }
    if (updates.category) { fields.push('category = ?'); params.push(updates.category); }
    if (updates.author) { fields.push('author = ?'); params.push(updates.author); }
    if (updates.read_time) { fields.push('read_time = ?'); params.push(updates.read_time); }
    if (updates.tags) { fields.push('tags = ?'); params.push(updates.tags); }
    if (updates.date) { fields.push('date = ?'); params.push(updates.date); }
    if (typeof updates.is_published === 'boolean') { fields.push('is_published = ?'); params.push(updates.is_published ? 1 : 0); }
    if (typeof updates.is_featured === 'boolean') { fields.push('is_featured = ?'); params.push(updates.is_featured ? 1 : 0); }
    if (updates.image) { fields.push('image = ?'); params.push(updates.image); }
    if (updates.meta_description) { fields.push('meta_description = ?'); params.push(updates.meta_description); }
    if (updates.meta_keywords) { fields.push('meta_keywords = ?'); params.push(updates.meta_keywords); }

    if (fields.length === 0) return await getBlogById(id);

    const sql = `UPDATE blogs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    params.push(id);
    await db.execute({ sql, args: params });
    return await getBlogById(id);
  } catch (error) {
    console.error('Error updating blog:', error);
    return null;
  }
}

// Delete blog
export async function deleteBlog(id: number): Promise<boolean> {
  try {
    await ensureBlogsTable();
    await db.execute({
      sql: 'DELETE FROM blogs WHERE id = ?',
      args: [id]
    });
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    return false;
  }
}

// Increment view count
export async function incrementViewCount(slug: string): Promise<boolean> {
  try {
    await ensureBlogsTable();
    await db.execute({
      sql: 'UPDATE blogs SET view_count = view_count + 1 WHERE slug = ?',
      args: [slug]
    });
    return true;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return false;
  }
}
