const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  
  // Load R2 keys
  const r2Content = fs.readFileSync('r2_keys_list_utf8.txt', 'utf8');
  const r2Keys = r2Content.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('[') && !line.startsWith('---'));

  console.log(`Loaded ${r2Keys.length} R2 keys.`);

  function normalize(s) {
    if (!s) return '';
    // Strip timestamps (usually 13 digits) to be even safer, but let's try just stripping non-alphanumeric first
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function findBestMatch(dbUrl) {
    if (!dbUrl) return dbUrl;
    
    // If it's already an absolute URL to R2, we might want to strip it to make it relative
    if (dbUrl.startsWith('http')) {
       for (const key of r2Keys) {
         if (dbUrl.endsWith(key)) return key;
       }
       return dbUrl; // Keep as is if it's external or we can't find relative key
    }

    const fileName = dbUrl.split('/').pop();
    const dbNormalized = normalize(fileName);
    
    // Try to find a match in R2 keys
    for (const key of r2Keys) {
      const keyFileName = key.split('/').pop();
      const keyNormalized = normalize(keyFileName);
      
      // Check if one contains the other (to handle cases where one has extra timestamps)
      if (dbNormalized.includes(keyNormalized) || keyNormalized.includes(dbNormalized)) {
        return key;
      }
    }
    
    return dbUrl; // No match found
  }

  // 1. Products
  const products = await pool.query('SELECT id, name, images FROM "Product"');
  for (const p of products.rows) {
    const newImages = p.images.map(findBestMatch);
    if (JSON.stringify(newImages) !== JSON.stringify(p.images)) {
      await pool.query('UPDATE "Product" SET images = $1 WHERE id = $2', [newImages, p.id]);
      console.log(`Fixed Product: ${p.name}`);
    }
  }

  // 2. HomePage
  const home = await pool.query('SELECT * FROM "HomePage" WHERE id = \'global\'');
  if (home.rows.length > 0) {
    const h = home.rows[0];
    const updates = {};
    const fields = ['heroBackgroundUrl', 'ctaMediaUrl', 'whyBackgroundUrl', 'promoSectionBgUrl'];
    for (const f of fields) {
      if (h[f]) {
        const newVal = findBestMatch(h[f]);
        if (newVal !== h[f]) updates[f] = newVal;
      }
    }
    
    if (h.whyCards) {
      const cards = typeof h.whyCards === 'string' ? JSON.parse(h.whyCards) : h.whyCards;
      let updated = false;
      for (const card of (cards || [])) {
        if (card.url) {
          const newVal = findBestMatch(card.url);
          if (newVal !== card.url) { card.url = newVal; updated = true; }
        }
      }
      if (updated) updates.whyCards = cards;
    }

    if (h.promoCards) {
      const cards = typeof h.promoCards === 'string' ? JSON.parse(h.promoCards) : h.promoCards;
      let updated = false;
      for (const card of (cards || [])) {
        if (card.videoUrl) {
          const newVal = findBestMatch(card.videoUrl);
          if (newVal !== card.videoUrl) { card.videoUrl = newVal; updated = true; }
        }
      }
      if (updated) updates.promoCards = cards;
    }

    if (Object.keys(updates).length > 0) {
      const keys = Object.keys(updates);
      const values = keys.map(k => {
        if (k === 'whyCards' || k === 'promoCards') return JSON.stringify(updates[k]);
        return updates[k];
      });
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await pool.query(`UPDATE "HomePage" SET ${setClause} WHERE id = 'global'`, values);
      console.log('Fixed HomePage');
    }
  }

  // 3. AboutPage
  const about = await pool.query('SELECT * FROM "AboutPage" WHERE id = \'global\'');
  if (about.rows.length > 0) {
    const a = about.rows[0];
    const updates = {};
    const fields = ['heroBackgroundUrl', 'storyImageUrl', 'missionImageUrl', 'qualityBackgroundUrl'];
    for (const f of fields) {
      if (a[f]) {
        const newVal = findBestMatch(a[f]);
        if (newVal !== a[f]) updates[f] = newVal;
      }
    }
    if (Object.keys(updates).length > 0) {
      const keys = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await pool.query(`UPDATE "AboutPage" SET ${setClause} WHERE id = 'global'`, values);
      console.log('Fixed AboutPage');
    }
  }

  // 4. ContactPage
  const contact = await pool.query('SELECT * FROM "ContactPage" WHERE id = \'global\'');
  if (contact.rows.length > 0) {
    const c = contact.rows[0];
    if (c.heroBackgroundUrl) {
      const newVal = findBestMatch(c.heroBackgroundUrl);
      if (newVal !== c.heroBackgroundUrl) {
        await pool.query('UPDATE "ContactPage" SET "heroBackgroundUrl" = $1 WHERE id = \'global\'', [newVal]);
        console.log('Fixed ContactPage');
      }
    }
  }

  // 5. Certifications
  const certs = await pool.query('SELECT id, title, "imageUrl" FROM "certification"');
  for (const c of certs.rows) {
    const newVal = findBestMatch(c.imageUrl);
    if (newVal !== c.imageUrl) {
      await pool.query('UPDATE "certification" SET "imageUrl" = $1 WHERE id = $2', [newVal, c.id]);
      console.log(`Fixed Certification: ${c.title}`);
    }
  }

  // 6. Deals
  const deals = await pool.query('SELECT id, title, images FROM "Deal"');
  for (const d of deals.rows) {
    const newImages = d.images.map(findBestMatch);
    if (JSON.stringify(newImages) !== JSON.stringify(d.images)) {
      await pool.query('UPDATE "Deal" SET images = $1 WHERE id = $2', [newImages, d.id]);
      console.log(`Fixed Deal: ${d.title}`);
    }
  }

  // 7. Settings (Logo)
  const resSet = await pool.query('SELECT "logoUrl" FROM "Settings" WHERE id = \'global\'');
  if (resSet.rows[0] && resSet.rows[0].logoUrl) {
    const newVal = findBestMatch(resSet.rows[0].logoUrl);
    if (newVal !== resSet.rows[0].logoUrl) {
      await pool.query('UPDATE "Settings" SET "logoUrl" = $1 WHERE id = \'global\'', [newVal]);
      console.log('Fixed Logo');
    }
  }

  await pool.end();
  console.log('Super R2 Fixer finished!');
}

main().catch(console.error);
