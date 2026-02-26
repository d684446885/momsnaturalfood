
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing!");
  }

  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('--- Connected to DB ---');

  const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  
  if (!settings || !settings.r2AccountId || !settings.r2AccessKeyId || !settings.r2SecretAccessKey || !settings.r2BucketName) {
    console.error('R2 Settings not fully configured');
    await prisma.$disconnect();
    await pool.end();
    return;
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${settings.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: settings.r2AccessKeyId,
      secretAccessKey: settings.r2SecretAccessKey,
    },
  });

  const products = await prisma.product.findMany();
  console.log(`Processing ${products.length} products...`);

  for (const product of products) {
    let updated = false;
    const newImages = [...product.images];

    for (let i = 0; i < newImages.length; i++) {
        const imageUrl = newImages[i];
        
        // If image is local (relative path starting with / or just the filename)
        // Or if it's already an R2 URL but we want to "re-upload" (reupload usually implies refresh)
        // But user said "reupload media", so let's look for local files first.
        
        if (!imageUrl.startsWith('http') || imageUrl.includes('localhost')) {
            const fileName = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
            // Handle cases where the path might be deeper
            const fullPath = path.join(process.cwd(), 'public', fileName);

            if (fs.existsSync(fullPath)) {
                console.log(`Uploading ${fileName} for product ${product.name}...`);
                const fileBuffer = fs.readFileSync(fullPath);
                const baseName = path.basename(fileName);
                const r2Key = `products/${Date.now()}-${baseName}`;

                try {
                    await s3Client.send(new PutObjectCommand({
                        Bucket: settings.r2BucketName,
                        Key: r2Key,
                        Body: fileBuffer,
                        ContentType: 'image/jpeg',
                    }));

                    const publicUrl = settings.r2PublicUrl 
                        ? `${settings.r2PublicUrl.endsWith('/') ? settings.r2PublicUrl.slice(0, -1) : settings.r2PublicUrl}/${r2Key}`
                        : `https://${settings.r2BucketName}.${settings.r2AccountId}.r2.dev/${r2Key}`;

                    newImages[i] = publicUrl;
                    updated = true;
                    console.log(`Successfully uploaded to ${publicUrl}`);
                } catch (err) {
                    console.error(`Failed to upload ${fileName}:`, err);
                }
            } else {
                console.warn(`File not found locally: ${fullPath}`);
            }
        }
    }

    if (updated) {
        await prisma.product.update({
            where: { id: product.id },
            data: { images: newImages }
        });
        console.log(`Updated product ${product.name} in database.`);
    }
  }

  console.log('Migration complete.');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
