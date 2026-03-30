import db from './sqlite';

export interface Contribution {
  id: number;
  title: string;
  description: string;
  techStack: string; // JSON array of strings
  stars: number;
  forks: number;
  link: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// Ensure table exists
async function ensureContributionsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      techStack TEXT DEFAULT '[]',
      stars INTEGER DEFAULT 0,
      forks INTEGER DEFAULT 0,
      link TEXT DEFAULT '',
      color TEXT DEFAULT 'from-cyan-500 to-blue-500',
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function mapRow(row: any): Contribution {
  return {
    id: Number(row.id),
    title: String(row.title),
    description: String(row.description || ''),
    techStack: String(row.techStack || '[]'),
    stars: Number(row.stars || 0),
    forks: Number(row.forks || 0),
    link: String(row.link || ''),
    color: String(row.color || 'from-cyan-500 to-blue-500'),
    is_active: Boolean(row.is_active),
    sort_order: Number(row.sort_order || 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

// Get all active contributions (public interface)
export async function getActiveContributions(): Promise<Contribution[]> {
  try {
    await ensureContributionsTable();
    const result = await db.execute(
      'SELECT * FROM contributions WHERE is_active != 0 ORDER BY sort_order ASC, created_at DESC'
    );
    return result.rows.map(mapRow);
  } catch (error) {
    console.error('Error fetching active contributions:', error);
    return [];
  }
}

// Get all contributions (admin interface)
export async function getAllContributions(): Promise<Contribution[]> {
  try {
    await ensureContributionsTable();
    const result = await db.execute(
      'SELECT * FROM contributions ORDER BY sort_order ASC, created_at DESC'
    );
    return result.rows.map(mapRow);
  } catch (error) {
    console.error('Error fetching all contributions:', error);
    return [];
  }
}

// Get contribution by ID
export async function getContributionById(id: number): Promise<Contribution | null> {
  try {
    await ensureContributionsTable();
    const result = await db.execute({
      sql: 'SELECT * FROM contributions WHERE id = ? LIMIT 1',
      args: [id],
    });
    if (result.rows.length === 0) return null;
    return mapRow(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contribution by id:', error);
    return null;
  }
}

// Add contribution
export async function addContribution(
  data: Omit<Contribution, 'id' | 'created_at' | 'updated_at'>
): Promise<Contribution | null> {
  try {
    await ensureContributionsTable();
    const result = await db.execute({
      sql: `INSERT INTO contributions
              (title, description, techStack, stars, forks, link, color, is_active, sort_order, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        data.title,
        data.description || '',
        data.techStack || '[]',
        data.stars ?? 0,
        data.forks ?? 0,
        data.link || '',
        data.color || 'from-cyan-500 to-blue-500',
        data.is_active ? 1 : 0,
        data.sort_order ?? 0,
      ],
    });
    return getContributionById(Number(result.lastInsertRowid));
  } catch (error) {
    console.error('Error adding contribution:', error);
    return null;
  }
}

// Update contribution
export async function updateContribution(
  id: number,
  updates: Partial<Omit<Contribution, 'id' | 'created_at' | 'updated_at'>>
): Promise<Contribution | null> {
  try {
    await ensureContributionsTable();
    const fields: string[] = [];
    const params: any[] = [];

    if (updates.title !== undefined)       { fields.push('title = ?');       params.push(updates.title); }
    if (updates.description !== undefined) { fields.push('description = ?'); params.push(updates.description); }
    if (updates.techStack !== undefined)   { fields.push('techStack = ?');   params.push(updates.techStack); }
    if (updates.stars !== undefined)       { fields.push('stars = ?');       params.push(updates.stars); }
    if (updates.forks !== undefined)       { fields.push('forks = ?');       params.push(updates.forks); }
    if (updates.link !== undefined)        { fields.push('link = ?');        params.push(updates.link); }
    if (updates.color !== undefined)       { fields.push('color = ?');       params.push(updates.color); }
    if (typeof updates.is_active === 'boolean') { fields.push('is_active = ?'); params.push(updates.is_active ? 1 : 0); }
    if (updates.sort_order !== undefined)  { fields.push('sort_order = ?');  params.push(updates.sort_order); }

    if (fields.length === 0) return await getContributionById(id);

    const sql = `UPDATE contributions SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    params.push(id);
    await db.execute({ sql, args: params });
    return await getContributionById(id);
  } catch (error) {
    console.error('Error updating contribution:', error);
    return null;
  }
}

// Delete contribution
export async function deleteContribution(id: number): Promise<boolean> {
  try {
    await ensureContributionsTable();
    await db.execute({ sql: 'DELETE FROM contributions WHERE id = ?', args: [id] });
    return true;
  } catch (error) {
    console.error('Error deleting contribution:', error);
    return false;
  }
}
