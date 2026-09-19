import Database from 'better-sqlite3';
const db = new Database('./database/users.sqlite', { readonly: true });
const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table'").all();
console.log(JSON.stringify(tables, null, 2));
