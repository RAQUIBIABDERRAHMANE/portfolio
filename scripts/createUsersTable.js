// Script to create the users table in the database
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

async function createUsersTable() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'raquibiPortfolio',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Connected to database');

    // Read SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, 'database', 'users_table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute SQL
    await connection.query(sql);
    console.log('✅ Users table created successfully');

    // Check if table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "users"');
    if (tables.length > 0) {
      console.log('✅ Verified: users table exists');
      
      // Show table structure
      const [columns] = await connection.query('DESCRIBE users');
      console.log('\n📋 Table structure:');
      console.table(columns);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

createUsersTable();
