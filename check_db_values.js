
const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const resSettings = await pool.query('SELECT "logoUrl", "r2PublicUrl", "r2BucketName", "r2AccountId" FROM "Settings" WHERE id = \'global\'');
    console.log('--- SETTINGS ---');
    console.log(JSON.stringify(resSettings.rows[0], null, 2));

    const resProducts = await pool.query('SELECT name, images FROM "Product" LIMIT 5');
    console.log('\n--- PRODUCTS ---');
    resProducts.rows.forEach(p => {
      console.log(`${p.name}: ${JSON.stringify(p.images)}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
