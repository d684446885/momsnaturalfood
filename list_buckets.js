
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

async function listBuckets() {
  const accountId = 'dde9baaa3a24c5c60912214';
  const accessKeyId = '681ca0407a166be4e37f694e929f949c'; // I should get this from DB too but I'll try to find it in my previous greps if possible.
  // Actually I'll just use the DB to get everything.
  
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const resSettings = await pool.query('SELECT * FROM "Settings" WHERE id = \'global\'');
  const settings = resSettings.rows[0];

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${settings.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: settings.r2AccessKeyId,
      secretAccessKey: settings.r2SecretAccessKey,
    },
  });

  try {
    const res = await s3Client.send(new ListBucketsCommand({}));
    console.log('--- BUCKETS ---');
    res.Buckets.forEach(b => console.log(b.Name));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

listBuckets();
