import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://appuser:apppassword@localhost:5432/portfolio';
const client = new Client({ connectionString });

async function checkData() {
  await client.connect();
  const tables = [
    'users', 'subscriptions', 'page_settings', 'employment_submissions', 
    'blogs', 'projects', 'availability_slots', 'reservations', 
    'analytics_pageviews', 'contributions', 'contact_messages'
  ];
  
  console.log("📊 Vérification des données dans PostgreSQL :");
  for (const table of tables) {
    try {
      const res = await client.query(`SELECT COUNT(*) FROM "${table}"`);
      console.log(`- ${table} : ${res.rows[0].count} lignes`);
    } catch (e) {
      console.log(`- ${table} : ERREUR (${e.message})`);
    }
  }
  await client.end();
}

checkData().catch(console.error);