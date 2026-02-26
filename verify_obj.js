
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

async function check() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    if (!settings) return;

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${settings.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: settings.r2AccessKeyId,
        secretAccessKey: settings.r2SecretAccessKey,
      },
    });

    const key = 'products/1771531140924_6_Pack_Gluten_Free_Fig-Walnut_Granola_BITES.jpg';
    const res = await s3Client.send(new GetObjectCommand({
      Bucket: settings.r2BucketName,
      Key: key,
    }));

    console.log(`Success: Found object ${key} in bucket ${settings.r2BucketName}`);
    console.log(`Content Type: ${res.ContentType}`);
  } catch (err) {
    console.error(`Failed: ${err.message}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

check();
