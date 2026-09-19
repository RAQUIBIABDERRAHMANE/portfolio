import { Client } from 'pg';
import fs from 'fs';

const connectionString = process.env.DATABASE_URL || 'postgres://appuser:apppassword@localhost:5432/portfolio';
const client = new Client({ connectionString });

async function fix() {
    await client.connect();
    console.log("🛠 Final tables patch");

    await client.query('ALTER TABLE employment_submissions ADD COLUMN IF NOT EXISTS "idNumber" TEXT');
    await client.query('ALTER TABLE employment_submissions ADD COLUMN IF NOT EXISTS "resumePath" TEXT');
    
    await client.query('ALTER TABLE contributions ADD COLUMN IF NOT EXISTS "is_active" INTEGER');
    await client.query('ALTER TABLE contributions ADD COLUMN IF NOT EXISTS "sort_order" INTEGER');
    await client.query('ALTER TABLE contributions ADD COLUMN IF NOT EXISTS "links" TEXT');

    try { await client.query('ALTER TABLE subscriptions DROP CONSTRAINT "subscriptions_user_id_fkey"'); } catch(e) {}
    
    // retry inserts
    const dumpStr = fs.readFileSync('./database/turso-dump.json', 'utf-8');
    const { dump } = JSON.parse(dumpStr);

    for (const tableName of ['subscriptions', 'employment_submissions', 'contributions']) {
        const rows = dump[tableName];
        if (!rows || rows.length === 0) continue;
        
        for (const row of rows) {
        const columns = Object.keys(row).map(c => `"${c}"`);
        const values = Object.values(row);
        const placeholders = values.map((_, i) => `$${i + 1}`);
            try {
                const query = `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) ON CONFLICT DO NOTHING`;
                await client.query(query, values);
            } catch (e) {}
        }
    }
    console.log("✅ Done");
    await client.end();
}
fix();