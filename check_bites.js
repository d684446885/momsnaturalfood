
const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const res = await pool.query('SELECT name, images FROM "Product" WHERE name LIKE \'%BITES%\' LIMIT 3');
  res.rows.forEach(r => {
    console.log(`NAME: ${r.name}`);
    console.log(`IMAGES: ${JSON.stringify(r.images)}`);
  });
  await pool.end();
}

check();
