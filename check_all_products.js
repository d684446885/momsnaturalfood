
const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('SELECT name, images FROM "Product"');
    console.log(`TOTAL PRODUCTS: ${res.rows.length}`);
    res.rows.forEach(p => {
      console.log(`NAME: ${p.name}`);
      console.log(`IMAGES: ${JSON.stringify(p.images)}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
