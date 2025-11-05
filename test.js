import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '100.99.43.78',
  user: 'abdoraquibi',
  password: '@@12raquibi',
  database: 'raquibiPortfolio',
  port: 3306,
});

(async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log(rows);
  } catch (err) {
    console.error('Connection failed:', err);
  }
})();
