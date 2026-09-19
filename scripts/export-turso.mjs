import { createClient } from '@libsql/client';
import fs from 'fs';

const url = "libsql://portfolio-db-vercel-icfg-5nxymqc2tltlkqfimh0btwhp.aws-us-east-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjY5Mjk0MjEsImlkIjoiZTVkN2EyMzEtMGU5YS00ODNlLTkzMDktODE4NmE2YzcyYmMzIiwicmlkIjoiMDc2OTExNmEtZDI2OS00Y2RhLWFhNGItY2U4YTc3ZjBlZmIwIn0.oUmOQdSD6ayWSqdthLtMGDLY7MVErhzx981jOc_EXJJmWu9SBzmUsT4Jf5OJtLPEO2jXz302f97GHKa4TXAEBw";

const client = createClient({ url, authToken });

async function exportTurso() {
  try {
    console.log("Connexion à Turso...");
    const tablesRes = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'libsql_%'");
    
    const dump = {};
    const schemas = {};

    for (const row of tablesRes.rows) {
      const tableName = row.name;
      console.log(`Export de la table : ${tableName}`);
      
      const dataRes = await client.execute(`SELECT * FROM "${tableName}"`);
      dump[tableName] = dataRes.rows;
      
      const schemaRes = await client.execute(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}'`);
      schemas[tableName] = schemaRes.rows[0].sql;
    }

    fs.writeFileSync('./database/turso-dump.json', JSON.stringify({ schemas, dump }, null, 2));
    console.log("✅ Export complet ! Fichier sauvegardé dans ./database/turso-dump.json");
  } catch (err) {
    console.error("Erreur durant l'export:", err);
  }
}

exportTurso();