
const { Pool } = require('pg');
const { S3Client, HeadObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  
  const resSettings = await pool.query('SELECT * FROM "Settings" WHERE id = \'global\'');
  const settings = resSettings.rows[0];

  if (!settings || !settings.r2AccountId) {
    console.error("R2 Settings missing");
    process.exit(1);
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${settings.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: settings.r2AccessKeyId,
      secretAccessKey: settings.r2SecretAccessKey,
    },
  });

  const bucket = settings.r2BucketName;

  const fixUrl = async (url) => {
    if (!url) return url;
    if (url.startsWith('http')) return url;
    
    let targetR2Key = null;
    let localFile = null;

    if (url.startsWith('/uploads/')) {
        const fileName = url.split('/').pop();
        const subParts = fileName.split('-');
        if (subParts.length > 1 && fileName.includes('_')) {
            // Pattern: products/TIMESTAMP-NAME.EXT
            const remainder = subParts.slice(1).join('-');
            targetR2Key = `products/${remainder.replace('_', '-')}`;
        } else {
            // Pattern: products/FILENAME
            targetR2Key = `products/${fileName}`;
        }
        localFile = fileName;
    } else if (url.startsWith('products/')) {
        // Already maybe fine, but let's check
        targetR2Key = url;
    }

    if (!targetR2Key) return url;

    // Check R2
    try {
        await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: targetR2Key }));
        console.log(`[R2_OK] ${url} -> ${targetR2Key}`);
        return targetR2Key;
    } catch (e) {
        // Try to upload
        const localPaths = [
            path.join(process.cwd(), 'public', 'uploads', localFile || ''),
            path.join(process.cwd(), 'public', 'uploads', targetR2Key.split('/').pop()),
        ];
        
        for (const lp of localPaths) {
            if (lp && fs.existsSync(lp)) {
                console.log(`[UPLOADING] ${lp} -> ${targetR2Key}`);
                const body = fs.readFileSync(lp);
                const ext = path.extname(lp).toLowerCase();
                const contentType = ext === '.webp' ? 'image/webp' : (ext === '.mp4' ? 'video/mp4' : 'image/jpeg');
                
                await s3.send(new PutObjectCommand({
                    Bucket: bucket,
                    Key: targetR2Key,
                    Body: body,
                    ContentType: contentType
                }));
                return targetR2Key;
            }
        }
        console.warn(`[MISSING] ${url} (target: ${targetR2Key})`);
        return url;
    }
  };

  try {
    // 1. Products
    const products = await pool.query('SELECT id, name, images FROM "Product"');
    for (const p of products.rows) {
        const newImages = await Promise.all(p.images.map(fixUrl));
        if (JSON.stringify(newImages) !== JSON.stringify(p.images)) {
            await pool.query('UPDATE "Product" SET images = $1 WHERE id = $2', [newImages, p.id]);
            console.log(`Fixed Product: ${p.name}`);
        }
    }

    // 2. Settings
    if (settings.logoUrl) {
        const newLogo = await fixUrl(settings.logoUrl);
        if (newLogo !== settings.logoUrl) {
            await pool.query('UPDATE "Settings" SET "logoUrl" = $1 WHERE id = \'global\'', [newLogo]);
            console.log(`Fixed Logo`);
        }
    }

    // 3. HomePage
    const home = await pool.query('SELECT * FROM "HomePage" WHERE id = \'global\'');
    if (home.rows.length > 0) {
        const h = home.rows[0];
        const updates = {};
        const fields = ['heroBackgroundUrl', 'ctaMediaUrl', 'whyBackgroundUrl', 'promoSectionBgUrl'];
        for (const f of fields) {
            if (h[f]) {
                const newVal = await fixUrl(h[f]);
                if (newVal !== h[f]) updates[f] = newVal;
            }
        }
        
        // Json fields
        if (h.whyCards) {
            const cards = typeof h.whyCards === 'string' ? JSON.parse(h.whyCards) : h.whyCards;
            let cardsUpdated = false;
            for (const card of (cards || [])) {
                if (card.imageUrl) {
                    const newVal = await fixUrl(card.imageUrl);
                    if (newVal !== card.imageUrl) {
                        card.imageUrl = newVal;
                        cardsUpdated = true;
                    }
                }
            }
            if (cardsUpdated) updates.whyCards = cards;
        }

        if (h.promoCards) {
            const cards = typeof h.promoCards === 'string' ? JSON.parse(h.promoCards) : h.promoCards;
            let cardsUpdated = false;
            for (const card of (cards || [])) {
                if (card.imageUrl) {
                    const newVal = await fixUrl(card.imageUrl);
                    if (newVal !== card.imageUrl) {
                        card.imageUrl = newVal;
                        cardsUpdated = true;
                    }
                }
            }
            if (cardsUpdated) updates.promoCards = cards;
        }

        if (Object.keys(updates).length > 0) {
            const setClause = Object.keys(updates).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
            await pool.query(`UPDATE "HomePage" SET ${setClause} WHERE id = 'global'`, Object.values(updates));
            console.log(`Fixed HomePage`);
        }
    }

    // 4. AboutPage
    const about = await pool.query('SELECT * FROM "AboutPage" WHERE id = \'global\'');
    if (about.rows.length > 0) {
        const a = about.rows[0];
        const updates = {};
        const fields = ['heroBackgroundUrl', 'storyImageUrl', 'missionImageUrl', 'qualityBackgroundUrl'];
        for (const f of fields) {
            if (a[f]) {
                const newVal = await fixUrl(a[f]);
                if (newVal !== a[f]) updates[f] = newVal;
            }
        }
        if (Object.keys(updates).length > 0) {
            const setClause = Object.keys(updates).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
            await pool.query(`UPDATE "AboutPage" SET ${setClause} WHERE id = 'global'`, Object.values(updates));
            console.log(`Fixed AboutPage`);
        }
    }

    // 5. ContactPage
    const contact = await pool.query('SELECT * FROM "ContactPage" WHERE id = \'global\'');
    if (contact.rows.length > 0) {
        const c = contact.rows[0];
        if (c.heroBackgroundUrl) {
            const newVal = await fixUrl(c.heroBackgroundUrl);
            if (newVal !== c.heroBackgroundUrl) {
                await pool.query('UPDATE "ContactPage" SET "heroBackgroundUrl" = $1 WHERE id = \'global\'', [newVal]);
                console.log(`Fixed ContactPage`);
            }
        }
    }

    // 6. Certifications
    const certs = await pool.query('SELECT id, title, "imageUrl" FROM "certification"');
    for (const c of certs.rows) {
        const newVal = await fixUrl(c.imageUrl);
        if (newVal !== c.imageUrl) {
            await pool.query('UPDATE "certification" SET "imageUrl" = $1 WHERE id = $2', [newVal, c.id]);
            console.log(`Fixed Certification: ${c.title}`);
        }
    }

    // 7. Deals
    const deals = await pool.query('SELECT id, title, images FROM "Deal"');
    for (const d of deals.rows) {
        const newImages = await Promise.all(d.images.map(fixUrl));
        if (JSON.stringify(newImages) !== JSON.stringify(d.images)) {
            await pool.query('UPDATE "Deal" SET images = $1 WHERE id = $2', [newImages, d.id]);
            console.log(`Fixed Deal: ${d.title}`);
        }
    }

    console.log("Migration finished successfully!");

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
