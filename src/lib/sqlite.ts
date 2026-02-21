import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || 'file:./database/users.sqlite';
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
  url,
  authToken,
});

// Initialize the database tables
export const initDb = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      subscription TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Migration for existing databases
  try {
    await db.execute('ALTER TABLE users ADD COLUMN password TEXT');
  } catch (e) {
    // Column might already exist
  }

  try {
    await db.execute('ALTER TABLE users ADD COLUMN deletedAt DATETIME DEFAULT NULL');
  } catch (e) {
    // Column might already exist
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS analytics_pageviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pathname TEXT NOT NULL,
      referrer TEXT,
      country TEXT,
      country_code TEXT,
      user_agent TEXT,
      ip_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_pageviews(created_at);
  `);
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_analytics_pathname ON analytics_pageviews(pathname);
  `);

  // Analytics column migrations
  const analyticsMigrations = [
    'ALTER TABLE analytics_pageviews ADD COLUMN session_id TEXT',
    'ALTER TABLE analytics_pageviews ADD COLUMN device_type TEXT',
    'ALTER TABLE analytics_pageviews ADD COLUMN browser TEXT',
  ];
  for (const sql of analyticsMigrations) {
    try { await db.execute(sql); } catch { /* already exists */ }
  }
};

// Auto-init only if in development or locally
if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
  initDb().catch(console.error);
}

export default db;
