import fs from 'fs';
import path from 'path';
import db from '../src/lib/sqlite.js';

const blogsJsonPath = path.join(process.cwd(), 'src', 'data', 'blogs.json');

async function seedBlogs() {
  try {
    console.log('Starting blog migration to database...');

    // Create blogs table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        date TEXT NOT NULL,
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

    // Read blogs.json
    const blogsData = JSON.parse(fs.readFileSync(blogsJsonPath, 'utf-8'));
    const blogs = blogsData.blogs || [];

    console.log(`Found ${blogs.length} blogs to migrate...`);

    let successCount = 0;
    let errorCount = 0;

    for (const blog of blogs) {
      try {
        await db.execute({
          sql: `INSERT OR REPLACE INTO blogs (id, title, slug, excerpt, content, author, date, read_time, category, tags, image, meta_description, meta_keywords, is_published, is_featured, view_count, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            blog.id,
            blog.title,
            blog.slug,
            blog.excerpt,
            blog.content,
            blog.author || 'Abdo Raquibi',
            blog.date || new Date().toISOString().split('T')[0],
            blog.read_time || '5 min read',
            blog.category || 'General',
            blog.tags || '',
            blog.image || '',
            blog.meta_description || blog.excerpt,
            blog.meta_keywords || '',
            blog.is_published ? 1 : 0,
            blog.is_featured ? 1 : 0,
            blog.view_count || 0,
            blog.created_at || new Date().toISOString(),
            blog.updated_at || new Date().toISOString()
          ]
        });
        successCount++;
        console.log(`✓ Migrated: ${blog.title}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Failed to migrate "${blog.title}":`, error);
      }
    }

    console.log(`\nMigration complete!`);
    console.log(`Successfully migrated: ${successCount} blogs`);
    if (errorCount > 0) {
      console.log(`Failed: ${errorCount} blogs`);
    }

    // Backup original JSON file
    const backupPath = blogsJsonPath + '.backup';
    fs.copyFileSync(blogsJsonPath, backupPath);
    console.log(`\nOriginal blogs.json backed up to: ${backupPath}`);

    // Delete the original JSON file
    fs.unlinkSync(blogsJsonPath);
    console.log('Original blogs.json file deleted.');

    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

seedBlogs();
