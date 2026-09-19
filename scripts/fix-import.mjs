import { Client } from 'pg';
import fs from 'fs';

const connectionString = process.env.DATABASE_URL || 'postgres://appuser:apppassword@localhost:5432/portfolio';
const client = new Client({ connectionString });

async function migrate() {
  await client.connect();

  const dumpStr = fs.readFileSync('./database/turso-dump.json', 'utf-8');
  const { dump } = JSON.parse(dumpStr);

  console.log("🛠 Ajustement des tables...");
  
  try {
     await client.query('ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS role TEXT');
     await client.query('ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP');
  } catch(e) {}
  try {
     await client.query('ALTER TABLE employment_submissions ADD COLUMN IF NOT EXISTS "fullName" TEXT');
     await client.query('ALTER TABLE employment_submissions ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP');
     await client.query('ALTER TABLE employment_submissions ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP');
  } catch(e) {}
  try {
     await client.query('ALTER TABLE contributions ADD COLUMN IF NOT EXISTS "techStack" TEXT');
  } catch(e) {}

  console.log("📥 Reprise de l'insertion des données échouées...");
  
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
      } catch (e) {
          if(!e.message.includes('unique constraint') && !e.message.includes('DO NOTHING')) {
            try {
              const insertNoConflict = `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
              await client.query(insertNoConflict, values);
            } catch(e2) {
               console.error(`❌ Échec final sur ${tableName} (${row.id}) :`, e2.message);
            }
          }
      }
    }
  }
  
  console.log("✅ Modifications terminées");
  await client.end();
}

migrate().catch(console.error);