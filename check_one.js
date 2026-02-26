
const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const res = await pool.query('SELECT name, images FROM "Product" WHERE name LIKE \'%HAZELNUT%\' LIMIT 1');
  console.log(JSON.stringify(res.rows[0], null, 2));
  await pool.end();
}

check();
