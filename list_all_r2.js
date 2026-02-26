
const { Pool } = require('pg');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

async function listAll() {
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

  let isTruncated = true;
  let nextContinuationToken = undefined;

  console.log('--- ALL R2 KEYS ---');
  while (isTruncated) {
    const res = await s3Client.send(new ListObjectsV2Command({
      Bucket: settings.r2BucketName,
      ContinuationToken: nextContinuationToken,
    }));

    if (res.Contents) {
      res.Contents.forEach(obj => console.log(obj.Key));
    }
    
    isTruncated = res.IsTruncated;
    nextContinuationToken = res.NextContinuationToken;
  }
  await pool.end();
}

listAll().catch(console.error).finally(() => process.exit());
