import db from './src/lib/sqlite.js';

async function check() {
  const result = await db.execute('SELECT * FROM contributions');
  console.log("All:", JSON.stringify(result.rows, null, 2));
  
  const active = await db.execute('SELECT * FROM contributions WHERE is_active != 0');
  console.log("Active Count:", active.rows.length);
}
check();
