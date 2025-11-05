import fs from 'fs';
import path from 'path';

const BLOGS_FILE_PATH = path.join(process.cwd(), 'src/data/blogs.json');

// Interface pour les blogs
interface Blog {
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

interface BlogsData {
  blogs: Blog[];
}

const USE_DB = process.env.USE_DB === 'true';

let pool: any = null;
if (USE_DB) {
  try {
    // importer dynamiquement pour éviter les erreurs quand mysql2 n'est pas installé
    // utiliser chemin relatif pour require dans ce module
    // @ts-ignore
    pool = require('./db').default;
  } catch (err) {
    console.warn('USE_DB=true mais la connexion MySQL n\'a pas pu être initialisée:', err);
    pool = null;
  }
}

// Helper: map DB rows to Blog interface
function mapRowToBlog(row: any): Blog {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    date: row.date,
    read_time: row.read_time || row.readTime || '5 min read',
    category: row.category,
    tags: row.tags || '',
    image: row.image || '',
    meta_description: row.meta_description || row.metaDescription || '',
    meta_keywords: row.meta_keywords || row.metaKeywords || '',
    is_published: Boolean(row.is_published || row.isPublished),
    is_featured: Boolean(row.is_featured || row.isFeatured),
    view_count: row.view_count || 0,
    created_at: row.created_at || row.createdAt,
    updated_at: row.updated_at || row.updatedAt,
  };
}

// Lire tous les blogs (fallback file-based)
export async function readBlogs(): Promise<Blog[]> {
  if (USE_DB && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM blogs');
      // @ts-ignore
      return rows.map(mapRowToBlog);
    } catch (error) {
      console.error('Error reading blogs from DB:', error);
      // fallback to file
    }
  }

  try {
    const fileContent = fs.readFileSync(BLOGS_FILE_PATH, 'utf8');
    const data: BlogsData = JSON.parse(fileContent);
    return data.blogs;
  } catch (error) {
    console.error('Error reading blogs file:', error);
    return [];
  }
}

// Écrire tous les blogs (file-based only)
export async function writeBlogs(blogs: Blog[]): Promise<boolean> {
  try {
    const data: BlogsData = { blogs };
    fs.writeFileSync(BLOGS_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing blogs file:', error);
    return false;
  }
}

// Obtenir tous les blogs publiés
export async function getPublishedBlogs(): Promise<Blog[]> {
  if (USE_DB && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM blogs WHERE is_published = 1 ORDER BY date DESC');
      // @ts-ignore
      return rows.map(mapRowToBlog);
    } catch (error) {
      console.error('Error fetching published blogs from DB:', error);
    }
  }

  const blogs = await readBlogs();
  return blogs.filter(blog => blog.is_published);
}

// Obtenir les blogs mis en avant
export async function getFeaturedBlogs(limit?: number): Promise<Blog[]> {
  if (USE_DB && pool) {
    try {
      let sql = 'SELECT * FROM blogs WHERE is_featured = 1 AND is_published = 1 ORDER BY date DESC';
      if (limit) sql += ' LIMIT ' + Number(limit);
      const [rows] = await pool.query(sql);
      // @ts-ignore
      return rows.map(mapRowToBlog);
    } catch (error) {
      console.error('Error fetching featured blogs from DB:', error);
    }
  }

  const blogs = await readBlogs();
  const featuredBlogs = blogs.filter(blog => blog.is_featured && blog.is_published);
  if (limit) return featuredBlogs.slice(0, limit);
  return featuredBlogs;
}

// Obtenir un blog par slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (USE_DB && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ? AND is_published = 1 LIMIT 1', [slug]);
      // @ts-ignore
      if (rows.length === 0) return null;
      // @ts-ignore
      return mapRowToBlog(rows[0]);
    } catch (error) {
      console.error('Error fetching blog by slug from DB:', error);
    }
  }

  const blogs = await readBlogs();
  return blogs.find(blog => blog.slug === slug && blog.is_published) || null;
}

// Obtenir un blog par ID
export async function getBlogById(id: number): Promise<Blog | null> {
  if (USE_DB && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ? LIMIT 1', [id]);
      // @ts-ignore
      if (rows.length === 0) return null;
      // @ts-ignore
      return mapRowToBlog(rows[0]);
    } catch (error) {
      console.error('Error fetching blog by id from DB:', error);
    }
  }

  const blogs = await readBlogs();
  return blogs.find(blog => blog.id === id) || null;
}

// Ajouter un nouveau blog
export async function addBlog(blogData: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<Blog | null> {
  if (USE_DB && pool) {
    try {
      const sql = `INSERT INTO blogs (title, slug, excerpt, content, category, author, read_time, tags, is_published, is_featured, image, meta_description, meta_keywords, date, view_count, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`;
      const params = [
        blogData.title,
        blogData.slug,
        blogData.excerpt,
        blogData.content,
        blogData.category,
        blogData.author,
        blogData.read_time || '5 min read',
        blogData.tags || '',
        blogData.is_published ? 1 : 0,
        blogData.is_featured ? 1 : 0,
        blogData.image || '',
        blogData.meta_description || blogData.excerpt,
        blogData.meta_keywords || '',
        blogData.date || new Date().toISOString().split('T')[0],
      ];

      const [result] = await pool.query(sql, params);
      // @ts-ignore
      const insertId = result.insertId;
      return await getBlogById(insertId);
    } catch (error) {
      console.error('Error adding blog to DB:', error);
      return null;
    }
  }

  try {
    const blogs = await readBlogs();
    // Vérifier si le slug existe déjà
    const existingBlog = blogs.find(blog => blog.slug === blogData.slug);
    if (existingBlog) {
      throw new Error('Un blog avec ce slug existe déjà');
    }

    const newId = blogs.length > 0 ? Math.max(...blogs.map(blog => blog.id)) + 1 : 1;
    const newBlog: Blog = {
      ...blogData,
      id: newId,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    blogs.unshift(newBlog);
    const success = await writeBlogs(blogs);
    return success ? newBlog : null;
  } catch (error) {
    console.error('Error adding blog:', error);
    return null;
  }
}

// Mettre à jour un blog
export async function updateBlog(id: number, updates: Partial<Omit<Blog, 'id' | 'created_at'>>): Promise<Blog | null> {
  if (USE_DB && pool) {
    try {
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
      if (typeof updates.is_published === 'boolean') { fields.push('is_published = ?'); params.push(updates.is_published ? 1 : 0); }
      if (typeof updates.is_featured === 'boolean') { fields.push('is_featured = ?'); params.push(updates.is_featured ? 1 : 0); }
      if (updates.image) { fields.push('image = ?'); params.push(updates.image); }
      if (updates.meta_description) { fields.push('meta_description = ?'); params.push(updates.meta_description); }
      if (updates.meta_keywords) { fields.push('meta_keywords = ?'); params.push(updates.meta_keywords); }

      if (fields.length === 0) return await getBlogById(id);

      const sql = `UPDATE blogs SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      params.push(id);
      await pool.query(sql, params);
      return await getBlogById(id);
    } catch (error) {
      console.error('Error updating blog in DB:', error);
      return null;
    }
  }

  try {
    const blogs = await readBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === id);
    if (blogIndex === -1) return null;

    if (updates.slug) {
      const existingBlog = blogs.find(blog => blog.slug === updates.slug && blog.id !== id);
      if (existingBlog) throw new Error('Un blog avec ce slug existe déjà');
    }

    blogs[blogIndex] = {
      ...blogs[blogIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const success = await writeBlogs(blogs);
    return success ? blogs[blogIndex] : null;
  } catch (error) {
    console.error('Error updating blog:', error);
    return null;
  }
}

// Supprimer un blog
export async function deleteBlog(id: number): Promise<boolean> {
  if (USE_DB && pool) {
    try {
      await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting blog from DB:', error);
      return false;
    }
  }

  try {
    const blogs = await readBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);
    if (filteredBlogs.length === blogs.length) return false;
    return await writeBlogs(filteredBlogs as Blog[]);
  } catch (error) {
    console.error('Error deleting blog:', error);
    return false;
  }
}

// Incrémenter le nombre de vues
export async function incrementViewCount(slug: string): Promise<boolean> {
  if (USE_DB && pool) {
    try {
      await pool.query('UPDATE blogs SET view_count = view_count + 1 WHERE slug = ?', [slug]);
      return true;
    } catch (error) {
      console.error('Error incrementing view count in DB:', error);
      return false;
    }
  }

  try {
    const blogs = await readBlogs();
    const blogIndex = blogs.findIndex(blog => blog.slug === slug);
    if (blogIndex === -1) return false;
    blogs[blogIndex].view_count += 1;
    blogs[blogIndex].updated_at = new Date().toISOString();
    return await writeBlogs(blogs);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return false;
  }
}

// Obtenir le prochain ID disponible
export async function getNextId(): Promise<number> {
  const blogs = await readBlogs();
  return blogs.length > 0 ? Math.max(...blogs.map(blog => blog.id)) + 1 : 1;
}