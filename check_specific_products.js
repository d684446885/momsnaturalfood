
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    const res = await pool.query('SELECT name, images FROM "Product" WHERE name LIKE \'%BITES%\' OR name LIKE \'%Granola%\' LIMIT 10');
    console.log('--- PRODUCTS ---');
    res.rows.forEach(p => {
      console.log(`Product: ${p.name}`);
      console.log(`Images: ${JSON.stringify(p.images)}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
main();
