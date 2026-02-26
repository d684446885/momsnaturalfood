
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const res = await pool.query('SELECT name, "imageUrl" FROM "Category"');
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}
main();
