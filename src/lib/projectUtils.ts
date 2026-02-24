import db from './sqlite';

export interface ProjectDownloadFile {
  name: string;       // display name, e.g. "Download APK"
  filename: string;   // stored filename, e.g. "app-v1.0.apk"
  url: string;        // public URL, e.g. "/uploads/projects/app-v1.0.apk"
  size?: number;      // bytes
}

export interface Project {
  id: number;
  title: string;
  company: string;
  year: string;
  description: string;
  results: string;        // JSON array of { title: string }
  link: string;
  link_text: string;
  image_url: string;
  color: string;
  download_files: string; // JSON array of ProjectDownloadFile
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// Ensure table exists
async function ensureProjectsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      year TEXT NOT NULL,
      description TEXT DEFAULT '',
      results TEXT DEFAULT '[]',
      link TEXT DEFAULT '',
      link_text TEXT DEFAULT 'View Project',
      image_url TEXT DEFAULT '',
      color TEXT DEFAULT 'from-cyan-500 to-blue-500',
      download_files TEXT DEFAULT '[]',
      is_published INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Migration: add column for existing tables
  try {
    await db.execute(`ALTER TABLE projects ADD COLUMN download_files TEXT DEFAULT '[]'`);
  } catch { /* column already exists */ }
}

function mapRow(row: any): Project {
  return {
    id: Number(row.id),
    title: String(row.title),
    company: String(row.company),
    year: String(row.year),
    description: String(row.description || ''),
    results: String(row.results || '[]'),
    link: String(row.link || ''),
    link_text: String(row.link_text || 'View Project'),
    image_url: String(row.image_url || ''),
    color: String(row.color || 'from-cyan-500 to-blue-500'),
    download_files: String(row.download_files || '[]'),
    is_published: Boolean(row.is_published),
    is_featured: Boolean(row.is_featured),
    sort_order: Number(row.sort_order || 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

// Get all published projects (public)
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    await ensureProjectsTable();
    // Use != 0 to match both integer 1 and any truthy stored value
    const result = await db.execute(
      'SELECT * FROM projects WHERE is_published != 0 ORDER BY sort_order ASC, created_at DESC'
    );
    console.log('[getPublishedProjects] found', result.rows.length, 'rows');
    return result.rows.map(mapRow);
  } catch (error) {
    console.error('Error fetching published projects:', error);
    return [];
  }
}

// Get all projects (admin)
export async function getAllProjects(): Promise<Project[]> {
  try {
    await ensureProjectsTable();
    const result = await db.execute(
      'SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC'
    );
    return result.rows.map(mapRow);
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
}

// Get project by ID
export async function getProjectById(id: number): Promise<Project | null> {
  try {
    await ensureProjectsTable();
    const result = await db.execute({
      sql: 'SELECT * FROM projects WHERE id = ? LIMIT 1',
      args: [id],
    });
    if (result.rows.length === 0) return null;
    return mapRow(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project by id:', error);
    return null;
  }
}

// Add project
export async function addProject(
  data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project | null> {
  try {
    await ensureProjectsTable();
    const result = await db.execute({
      sql: `INSERT INTO projects
              (title, company, year, description, results, link, link_text, image_url, color, download_files, is_published, is_featured, sort_order, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        data.title,
        data.company,
        data.year,
        data.description || '',
        data.results || '[]',
        data.link || '',
        data.link_text || 'View Project',
        data.image_url || '',
        data.color || 'from-cyan-500 to-blue-500',
        data.download_files || '[]',
        data.is_published ? 1 : 0,
        data.is_featured ? 1 : 0,
        data.sort_order ?? 0,
      ],
    });
    return getProjectById(Number(result.lastInsertRowid));
  } catch (error) {
    console.error('Error adding project:', error);
    return null;
  }
}

// Update project
export async function updateProject(
  id: number,
  updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
): Promise<Project | null> {
  try {
    await ensureProjectsTable();
    const fields: string[] = [];
    const params: any[] = [];

    if (updates.title !== undefined)       { fields.push('title = ?');       params.push(updates.title); }
    if (updates.company !== undefined)     { fields.push('company = ?');     params.push(updates.company); }
    if (updates.year !== undefined)        { fields.push('year = ?');        params.push(updates.year); }
    if (updates.description !== undefined) { fields.push('description = ?'); params.push(updates.description); }
    if (updates.results !== undefined)     { fields.push('results = ?');     params.push(updates.results); }
    if (updates.link !== undefined)        { fields.push('link = ?');        params.push(updates.link); }
    if (updates.link_text !== undefined)   { fields.push('link_text = ?');   params.push(updates.link_text); }
    if (updates.image_url !== undefined)   { fields.push('image_url = ?');   params.push(updates.image_url); }
    if (updates.color !== undefined)       { fields.push('color = ?');       params.push(updates.color); }
    if (updates.download_files !== undefined) { fields.push('download_files = ?'); params.push(updates.download_files); }
    if (typeof updates.is_published === 'boolean') { fields.push('is_published = ?'); params.push(updates.is_published ? 1 : 0); }
    if (typeof updates.is_featured === 'boolean')  { fields.push('is_featured = ?');  params.push(updates.is_featured ? 1 : 0); }
    if (updates.sort_order !== undefined)  { fields.push('sort_order = ?');  params.push(updates.sort_order); }

    if (fields.length === 0) return await getProjectById(id);

    const sql = `UPDATE projects SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    params.push(id);
    await db.execute({ sql, args: params });
    return await getProjectById(id);
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
}

// Delete project
export async function deleteProject(id: number): Promise<boolean> {
  try {
    await ensureProjectsTable();
    await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id] });
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}
