import Database from 'better-sqlite3';
import fs from 'fs';

// Assurez-vous que c'est le bon chemin vers votre fichier SQLite local
const dbPath = './database/users.sqlite'; 
const db = new Database(dbPath, { readonly: true });

// Récupérer toutes les tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

const dump = {};
for (const table of tables) {
  // Ignorer les tables internes s'il y en a
  if (table.name === 'sqlite_sequence' || table.name === 'libsql_wasm_func_table') continue;
  
  const rows = db.prepare(`SELECT * FROM ${table.name}`).all();
  dump[table.name] = rows;
}

fs.writeFileSync('./database/sqlite-dump.json', JSON.stringify(dump, null, 2));
console.log('✅ Base de données sauvegardée dans ./database/sqlite-dump.json');
