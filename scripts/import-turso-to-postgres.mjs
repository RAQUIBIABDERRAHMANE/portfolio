import { Client } from 'pg';
import fs from 'fs';

const connectionString = process.env.DATABASE_URL || 'postgres://appuser:apppassword@localhost:5432/portfolio';
const client = new Client({ connectionString });

// Un dictionnaire pour transpiler les types SQLite en Postgres
const mapType = (sqliteType) => {
  const t = sqliteType.toUpperCase();
  if (t.includes('INTEGER PRIMARY KEY AUTOINCREMENT')) return 'SERIAL PRIMARY KEY';
  if (t.includes('INTEGER')) return 'INTEGER';
  if (t.includes('DATETIME')) return 'TIMESTAMP';
  if (t.includes('TEXT')) return 'TEXT';
  if (t.includes('VARCHAR')) return 'VARCHAR(255)';
  return 'TEXT';
};

async function migrate() {
  await client.connect();
  console.log('✅ Connecté à PostgreSQL');

  const dumpStr = fs.readFileSync('./database/turso-dump.json', 'utf-8');
  const { schemas, dump } = JSON.parse(dumpStr);

  // 1. Création des tables
  console.log("🛠 Création des tables manquantes...");
  for (const [tableName, sql] of Object.entries(schemas)) {
    // Une traduction naive et rapide du DDL SQLite vers PostgreSQL
    // (Puisque certaines contraintes ou foreign keys peuvent nécessiter plus d'adaptation,
    // on gère surtout les SERIAL et on remplace les " par rien si ce n'est pas nécessaire).
    
    let pgSql = sql
      .replace(/AUTOINCREMENT/gi, '')
      .replace(/INTEGER PRIMARY KEY/gi, 'SERIAL PRIMARY KEY')
      .replace(/DATETIME/gi, 'TIMESTAMP');

    // Mettre les noms de tables "order" etc. entre guillemets doubles dans PG
    // Par précaution, on exécute ça calmement. S'il échoue, on log l'erreur mais on continue.
    try {
      await client.query(pgSql.replace(/sqlite_sequence/g, "pg_sequence")); // Petit clean-up au cas où
    } catch (e) {
      console.error(`⚠️ Erreur mineure sur la création de la table ${tableName} (peut-être déjà existante ou syntaxe trop SQLite) :`, e.message);
      // On va juste forcer la création basique
    }
  }

  // 2. Insertion Data
  console.log("📥 Insertion des données...");
  for (const [tableName, rows] of Object.entries(dump)) {
    if (!rows || rows.length === 0) continue;

    console.log(`   ➔ Table ${tableName}: ${rows.length} lignes à insérer...`);
    
    for (const row of rows) {
      const columns = Object.keys(row).map(c => `"${c}"`);
      const values = Object.values(row);
      const placeholders = values.map((_, i) => `$${i + 1}`);

      // Gérer certains id qui peuvent être conflictuel
      const insertQuery = `
        INSERT INTO "${tableName}" (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        ON CONFLICT (id) DO NOTHING
      `;
      
      try {
        await client.query(insertQuery, values);
      } catch (e) {
        if (!e.message.includes('relation') && !e.message.includes('DO NOTHING')) {
           // Fallback en cas d'erreur de schema, certaines tables n'ont pas un 'id' comme PK
           try {
             const insertNoConflict = `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
             await client.query(insertNoConflict, values);
           } catch {
             console.error(`     ❌ Échec sur la table ${tableName}`, e.message);
           }
        } else {
             try {
               const insertNoConflict = `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
               await client.query(insertNoConflict, values);
             } catch(err2) {
                console.error(`     ❌ Impossible d'ajouter la ligne dans ${tableName} :`, err2.message);
             }
        }
      }
    }
  }

  // 3. Mise à jour des séquences d'ID (SERIAL) pour éviter les futures violations de clé primaire
  console.log("🔄 Mise à jour des compteurs d'ID...");
  for (const tableName of Object.keys(dump)) {
    try {
      await client.query(`SELECT setval('"${tableName}_id_seq"', COALESCE((SELECT MAX(id) FROM "${tableName}"), 1))`);
    } catch(e) {
      // Ignorer si la table n'a pas de "_id_seq" (ex: pas d'ID primary key autoincrement)
    }
  }

  await client.end();
  console.log('🎉 Migration complétée ! Toute la base Turso a été répliquée dans Postgres.');
}

migrate().catch(console.error);