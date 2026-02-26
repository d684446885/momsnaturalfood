
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  
  try {
    const res = await pool.query('SELECT id, name, images FROM "Product"');
    console.log(`Checking ${res.rows.length} products...`);

    for (const product of res.rows) {
      let updated = false;
      const newImages = product.images.map(img => {
        // If it's a local path like /uploads/123-456_name.jpg
        // and we know R2 has products/456-name.jpg
        if (img.startsWith('/uploads/') && img.includes('_')) {
          const parts = img.split('/');
          const fileName = parts[parts.length - 1];
          const subParts = fileName.split('-');
          if (subParts.length > 1) {
            // Take the part after the first dash
            const remainder = subParts.slice(1).join('-');
            // Replace first underscore with dash
            const r2Name = remainder.replace('_', '-');
            const newPath = `products/${r2Name}`;
            console.log(`Transforming ${img} -> ${newPath}`);
            updated = true;
            return newPath;
          }
        }
        return img;
      });

      if (updated) {
        await pool.query('UPDATE "Product" SET images = $1 WHERE id = $2', [newImages, product.id]);
        console.log(`Updated ${product.name}`);
      }
    }

    // Also check Settings for logoUrl
    const settingsRes = await pool.query('SELECT "logoUrl" FROM "Settings" WHERE id = \'global\'');
    if (settingsRes.rows.length > 0) {
        const logo = settingsRes.rows[0].logoUrl;
        if (logo && logo.startsWith('/uploads/')) {
            const fileName = logo.split('/').pop();
            const newLogo = `products/${fileName}`; // Assuming logo is also in products/
            await pool.query('UPDATE "Settings" SET "logoUrl" = $1 WHERE id = \'global\'', [newLogo]);
            console.log(`Updated settings logo: ${logo} -> ${newLogo}`);
        }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
