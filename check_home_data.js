
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const res = await pool.query('SELECT * FROM "HomePage" WHERE id = \'global\'');
  console.log(JSON.stringify(res.rows[0], null, 2));
  await pool.end();
}
main();
