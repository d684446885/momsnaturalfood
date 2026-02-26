
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

async function list() {
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

    const res = await s3Client.send(new ListObjectsV2Command({
      Bucket: settings.r2BucketName,
      MaxKeys: 100,
    }));

    console.log('--- R2 OBJECTS ---');
    if (res.Contents) {
      res.Contents.forEach(obj => console.log(obj.Key));
    } else {
      console.log('No objects found');
    }

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

list();
