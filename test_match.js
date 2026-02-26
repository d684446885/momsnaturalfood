function normalize(s) {
  if (!s) return '';
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const testPaths = [
  "/uploads/1771881231348-1771517949855_WhatsApp_Image_2026_02_18_at_8.08.31_PM.jpeg",
  "/uploads/1771881230287-1771522626290_1769284869.png"
];

const r2Keys = [
  "1771517949855-WhatsApp_Image_2026_02_18_at_8.08.31_PM.jpeg",
  "deals/1771522626290-1769284869.png"
];

for (const dbUrl of testPaths) {
  const fileName = dbUrl.split('/').pop();
  const dbNormalized = normalize(fileName);
  console.log(`DB: ${fileName} -> ${dbNormalized}`);
  
  for (const key of r2Keys) {
    const keyFileName = key.split('/').pop();
    const keyNormalized = normalize(keyFileName);
    console.log(`  KEY: ${key} -> ${keyNormalized}`);
    
    if (dbNormalized.includes(keyNormalized) || keyNormalized.includes(dbNormalized)) {
      console.log(`  MATCH FOUND: ${key}`);
    }
  }
}
