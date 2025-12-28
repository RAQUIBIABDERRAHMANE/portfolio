import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({ url, authToken });

async function verify() {
    try {
        const result = await db.execute('SELECT name FROM sqlite_master WHERE type="table"');
        console.log('Tables in database:', result.rows.map(r => r.name));

        const usersCount = await db.execute('SELECT COUNT(*) as count FROM users');
        console.log('Total users:', usersCount.rows[0].count);
    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verify();
