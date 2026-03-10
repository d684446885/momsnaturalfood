
const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('SELECT * FROM "Settings" WHERE id = \'global\'');
    const s = res.rows[0];
    console.log('logoUrl:', s.logoUrl);
    console.log('r2PublicUrl:', s.r2PublicUrl);
    console.log('storageType:', s.storageType);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
