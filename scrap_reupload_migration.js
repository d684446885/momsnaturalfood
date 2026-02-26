
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
    return;
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

  try {
    const res = await pool.query('SELECT id, name, images FROM "Product"');
    console.log(`Processing ${res.rows.length} products...`);

    for (const product of res.rows) {
      let productUpdated = false;
      const newImages = [...product.images];

      for (let i = 0; i < newImages.length; i++) {
        const img = newImages[i];
        
        // Skip if already in R2 format (but verify)
        if (img.startsWith('products/')) {
            continue;
        }

        if (img.startsWith('/uploads/') && img.includes('_')) {
          const fileName = img.split('/').pop();
          const subParts = fileName.split('-');
          if (subParts.length > 1) {
            const remainder = subParts.slice(1).join('-');
            const r2Key = `products/${remainder.replace('_', '-')}`;

            // Check if exists in R2
            let existsInR2 = false;
            try {
              await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: r2Key }));
              existsInR2 = true;
              console.log(`[R2_MATCH] ${img} -> ${r2Key}`);
            } catch (e) {
              console.log(`[R2_MISS] ${r2Key} not in bucket.`);
            }

            if (existsInR2) {
              newImages[i] = r2Key;
              productUpdated = true;
            } else {
              // Try to find locally and reupload
              // We need to know which local file matches.
              // Let's check for the original filename in public/uploads
              const localCandidates = [
                path.join(process.cwd(), 'public', 'uploads', fileName),
                path.join(process.cwd(), 'public', 'uploads', remainder),
                path.join(process.cwd(), 'public', 'uploads', remainder.replace('_', '-'))
              ];

              let foundLocally = false;
              for (const localPath of localCandidates) {
                if (fs.existsSync(localPath)) {
                  console.log(`[LOCAL_FOUND] Reuploading ${localPath} to R2 as ${r2Key}`);
                  const body = fs.readFileSync(localPath);
                  await s3.send(new PutObjectCommand({
                    Bucket: bucket,
                    Key: r2Key,
                    Body: body,
                    ContentType: fileName.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
                  }));
                  newImages[i] = r2Key;
                  productUpdated = true;
                  foundLocally = true;
                  break;
                }
              }

              if (!foundLocally) {
                console.warn(`[NOT_FOUND] Could not find ${img} locally or in R2.`);
              }
            }
          }
        }
      }

      if (productUpdated) {
        await pool.query('UPDATE "Product" SET images = $1 WHERE id = $2', [newImages, product.id]);
        console.log(`Updated Product: ${product.name}`);
      }
    }

    // Handle Settings Logo
    const logo = settings.logoUrl;
    if (logo && logo.startsWith('/uploads/')) {
        const fileName = logo.split('/').pop();
        const r2Key = `products/${fileName}`;
        try {
            await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: r2Key }));
            await pool.query('UPDATE "Settings" SET "logoUrl" = $1 WHERE id = \'global\'', [r2Key]);
            console.log(`Updated Logo: ${logo} -> ${r2Key}`);
        } catch (e) {
            console.warn(`Logo ${r2Key} not found in R2.`);
        }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
