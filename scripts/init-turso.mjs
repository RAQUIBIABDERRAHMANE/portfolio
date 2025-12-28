import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local');
    process.exit(1);
}

const db = createClient({
    url,
    authToken,
});

async function init() {
    console.log('Initializing Turso Database...');

    try {
        console.log('Creating users table...');
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

        console.log('Creating subscriptions table...');
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
            console.log('Added password column to users table.');
        } catch (e) {
            console.log('Password column already exists or table is new.');
        }

        console.log('Database initialization complete!');
    } catch (error) {
        console.error('Initialization failed:', error);
        process.exit(1);
    }
}

init();
