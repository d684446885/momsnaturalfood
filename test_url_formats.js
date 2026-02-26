
async function test() {
  const accountId = 'dde9baaa3a24c5c60912214'; // Extract from the URL seen before
  const bucketName = 'momsnaturalfoods';
  const fileName = 'products/1771531140924_6_Pack_Gluten_Free_Fig-Walnut_Granola_BITES.jpg';
  
  const urls = [
    `https://pub-${accountId}.r2.dev/${fileName}`,
    `https://${bucketName}.${accountId}.r2.dev/${fileName}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`URL: ${url} -> Status: ${res.status}`);
    } catch (err) {
      console.log(`URL: ${url} -> Error: ${err.message}`);
    }
  }
}

test();
