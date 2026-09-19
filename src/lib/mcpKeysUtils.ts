import db from './sqlite';
import crypto from 'crypto';

export interface McpKey {
  id: number;
  name: string;
  key_value: string;
  is_active: boolean;
  permissions: string;
  created_at: string;
  last_used_at: string | null;
}

let tableEnsured = false;

export async function initMcpKeysTable() {
  if (tableEnsured) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS mcp_keys (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      key_value TEXT UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      permissions TEXT DEFAULT '["admin"]',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_used_at TIMESTAMP
    )
  `);
  
  try {
    await db.execute(`ALTER TABLE mcp_keys ADD COLUMN permissions TEXT DEFAULT '["admin"]'`);
  } catch (error) {
    // Column likely already exists, ignore
  }
  
  tableEnsured = true;
}

export async function getAllMcpKeys(): Promise<McpKey[]> {
  await initMcpKeysTable();
  const result = await db.execute('SELECT * FROM mcp_keys ORDER BY created_at DESC');
  return result.rows as unknown as McpKey[];
}

export async function getMcpKeyById(id: number): Promise<McpKey | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM mcp_keys WHERE id = ?',
    args: [id]
  });
  return result.rows.length > 0 ? (result.rows[0] as unknown as McpKey) : null;
}

export async function addMcpKey(name: string, permissions: string[] = ['read_only']): Promise<McpKey> {
  await initMcpKeysTable();
  const cleanName = name.substring(0, 50);
  const keyValue = 'mk_' + crypto.randomBytes(24).toString('hex');
  const permsStr = JSON.stringify(permissions);
  
  await db.execute({
    sql: 'INSERT INTO mcp_keys (name, key_value, permissions) VALUES (?, ?, ?)',
    args: [cleanName, keyValue, permsStr]
  });
  const res = await db.execute({
    sql: 'SELECT * FROM mcp_keys WHERE key_value = ?',
    args: [keyValue]
  });
  return res.rows[0] as unknown as McpKey;
}

export async function updateMcpKey(id: number, isActive: boolean): Promise<McpKey | null> {
  await db.execute({
    sql: 'UPDATE mcp_keys SET is_active = ? WHERE id = ?',
    args: [isActive ? 1 : 0, id]
  });
  return getMcpKeyById(id);
}

export async function deleteMcpKey(id: number): Promise<boolean> {
  const result = await db.execute({
    sql: 'DELETE FROM mcp_keys WHERE id = ?',
    args: [id]
  });
  return result.rowsAffected > 0;
}

export async function validateMcpKey(keyValue: string): Promise<{ isValid: boolean; permissions: string[] }> {
  try {
      await initMcpKeysTable();
      const result = await db.execute({
        sql: 'SELECT id, is_active, permissions FROM mcp_keys WHERE key_value = ?',
        args: [keyValue]
      });
      if (result.rows && result.rows.length > 0) {
          const key: any = result.rows[0];
          if (key.is_active) {
              await db.execute({
                sql: 'UPDATE mcp_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?',
                args: [key.id]
              });
              let perms = ['admin'];
              try { perms = JSON.parse(key.permissions || '["admin"]'); } catch(e) {}
              return { isValid: true, permissions: perms };
          }
      }
      return { isValid: false, permissions: [] };
  } catch (e) {
      return { isValid: false, permissions: [] };
  }
}
