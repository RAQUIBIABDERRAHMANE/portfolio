import { Client } from 'pg';
import fs from 'fs';

// Configuration de la connexion PostgreSQL (doit correspondre à votre docker-compose ou base distante)
const connectionString = process.env.DATABASE_URL || 'postgres://appuser:apppassword@localhost:5432/portfolio';

const client = new Client({ connectionString });

async function migrate() {
  await client.connect();
  console.log('✅ Connecté à PostgreSQL');

  const dumpStr = fs.readFileSync('./database/sqlite-dump.json', 'utf-8');
  const dump = JSON.parse(dumpStr);

  // 1. Création des tables dans PostgreSQL
  const createTablesSql = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      "fullName" VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255),
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "deletedAt" TIMESTAMP DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      subscription TEXT NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS analytics_pageviews (
      id SERIAL PRIMARY KEY,
      pathname VARCHAR(255) NOT NULL,
      referrer TEXT,
      country VARCHAR(255),
      country_code VARCHAR(10),
      user_agent TEXT,
      ip_hash TEXT,
      session_id TEXT,
      device_type VARCHAR(50),
      browser VARCHAR(100),
      user_id INTEGER,
      user_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      author VARCHAR(255) NOT NULL,
      date TEXT,
      read_time VARCHAR(50) DEFAULT '5 min read',
      category VARCHAR(255) NOT NULL,
      tags TEXT,
      image TEXT,
      meta_description TEXT,
      meta_keywords TEXT,
      is_published INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await client.query(createTablesSql);
  console.log('✅ Tables créées ou vérifiées');

  // 2. Insertion des données
  for (const user of dump.users || []) {
    await client.query(
      `INSERT INTO users (id, "fullName", phone, email, password, "createdAt", "deletedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [user.id, user.fullName, user.phone, user.email, user.password, user.createdAt, user.deletedAt]
    );
  }
  console.log(`✅ ${dump.users?.length || 0} utilisateurs migrés`);

  for (const sub of dump.subscriptions || []) {
    await client.query(
      `INSERT INTO subscriptions (id, user_id, subscription, "createdAt")
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [sub.id, sub.user_id, sub.subscription, sub.createdAt]
    );
  }
  console.log(`✅ ${dump.subscriptions?.length || 0} abonnements migrés`);

  for (const av of dump.analytics_pageviews || []) {
    await client.query(
      `INSERT INTO analytics_pageviews (id, pathname, referrer, country, country_code, user_agent, ip_hash, session_id, device_type, browser, user_id, user_name, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO NOTHING`,
      [av.id, av.pathname, av.referrer, av.country, av.country_code, av.user_agent, av.ip_hash, av.session_id, av.device_type, av.browser, av.user_id, av.user_name, av.created_at]
    );
  }
  console.log(`✅ ${dump.analytics_pageviews?.length || 0} logs analytiques migrés`);

  for (const blog of dump.blogs || []) {
    await client.query(
      `INSERT INTO blogs (id, title, slug, excerpt, content, author, date, read_time, category, tags, image, meta_description, meta_keywords, is_published, is_featured, view_count, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       ON CONFLICT (id) DO NOTHING`,
      [blog.id, blog.title, blog.slug, blog.excerpt, blog.content, blog.author, blog.date, blog.read_time, blog.category, blog.tags, blog.image, blog.meta_description, blog.meta_keywords, blog.is_published, blog.is_featured, blog.view_count, blog.created_at, blog.updated_at]
    );
  }
  console.log(`✅ ${dump.blogs?.length || 0} blogs migrés`);

  // Optionnel : remettre à jour les séquences PRIMARY KEY si on a inséré des ID explicitement
  await client.query(`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));`);
  await client.query(`SELECT setval('subscriptions_id_seq', COALESCE((SELECT MAX(id) FROM subscriptions), 1));`);
  await client.query(`SELECT setval('analytics_pageviews_id_seq', COALESCE((SELECT MAX(id) FROM analytics_pageviews), 1));`);
  await client.query(`SELECT setval('blogs_id_seq', COALESCE((SELECT MAX(id) FROM blogs), 1));`);
  
  await client.end();
  console.log('🎉 Migration complétée !');
}

migrate().catch(console.error);