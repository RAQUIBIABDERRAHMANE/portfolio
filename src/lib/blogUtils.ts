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
  created_at: string;
  updated_at: string;
}

interface BlogsData {
  blogs: Blog[];
}

// Lire tous les blogs
export function readBlogs(): Blog[] {
  try {
    const fileContent = fs.readFileSync(BLOGS_FILE_PATH, 'utf8');
    const data: BlogsData = JSON.parse(fileContent);
    return data.blogs;
  } catch (error) {
    console.error('Error reading blogs file:', error);
    return [];
  }
}

// Écrire tous les blogs
export function writeBlogs(blogs: Blog[]): boolean {
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
export function getPublishedBlogs(): Blog[] {
  const blogs = readBlogs();
  return blogs.filter(blog => blog.is_published);
}

// Obtenir les blogs mis en avant
export function getFeaturedBlogs(limit?: number): Blog[] {
  const blogs = readBlogs();
  const featuredBlogs = blogs.filter(blog => blog.is_featured && blog.is_published);
  
  if (limit) {
    return featuredBlogs.slice(0, limit);
  }
  
  return featuredBlogs;
}

// Obtenir un blog par slug
export function getBlogBySlug(slug: string): Blog | null {
  const blogs = readBlogs();
  return blogs.find(blog => blog.slug === slug && blog.is_published) || null;
}

// Obtenir un blog par ID
export function getBlogById(id: number): Blog | null {
  const blogs = readBlogs();
  return blogs.find(blog => blog.id === id) || null;
}

// Ajouter un nouveau blog
export function addBlog(blogData: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Blog | null {
  try {
    const blogs = readBlogs();
    
    // Vérifier si le slug existe déjà
    const existingBlog = blogs.find(blog => blog.slug === blogData.slug);
    if (existingBlog) {
      throw new Error('Un blog avec ce slug existe déjà');
    }
    
    // Générer le nouvel ID
    const newId = blogs.length > 0 ? Math.max(...blogs.map(blog => blog.id)) + 1 : 1;
    
    // Créer le nouveau blog
    const newBlog: Blog = {
      ...blogData,
      id: newId,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Ajouter au début de la liste (plus récent en premier)
    blogs.unshift(newBlog);
    
    // Sauvegarder
    const success = writeBlogs(blogs);
    return success ? newBlog : null;
  } catch (error) {
    console.error('Error adding blog:', error);
    return null;
  }
}

// Mettre à jour un blog
export function updateBlog(id: number, updates: Partial<Omit<Blog, 'id' | 'created_at'>>): Blog | null {
  try {
    const blogs = readBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === id);
    
    if (blogIndex === -1) {
      return null;
    }
    
    // Vérifier le slug si mis à jour
    if (updates.slug) {
      const existingBlog = blogs.find(blog => blog.slug === updates.slug && blog.id !== id);
      if (existingBlog) {
        throw new Error('Un blog avec ce slug existe déjà');
      }
    }
    
    // Mettre à jour le blog
    blogs[blogIndex] = {
      ...blogs[blogIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Sauvegarder
    const success = writeBlogs(blogs);
    return success ? blogs[blogIndex] : null;
  } catch (error) {
    console.error('Error updating blog:', error);
    return null;
  }
}

// Supprimer un blog
export function deleteBlog(id: number): boolean {
  try {
    const blogs = readBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);
    
    if (filteredBlogs.length === blogs.length) {
      return false; // Blog non trouvé
    }
    
    return writeBlogs(filteredBlogs);
  } catch (error) {
    console.error('Error deleting blog:', error);
    return false;
  }
}

// Incrémenter le nombre de vues
export function incrementViewCount(slug: string): boolean {
  try {
    const blogs = readBlogs();
    const blogIndex = blogs.findIndex(blog => blog.slug === slug);
    
    if (blogIndex === -1) {
      return false;
    }
    
    blogs[blogIndex].view_count += 1;
    blogs[blogIndex].updated_at = new Date().toISOString();
    
    return writeBlogs(blogs);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return false;
  }
}

// Obtenir le prochain ID disponible
export function getNextId(): number {
  const blogs = readBlogs();
  return blogs.length > 0 ? Math.max(...blogs.map(blog => blog.id)) + 1 : 1;
}