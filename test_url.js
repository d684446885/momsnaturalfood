
async function test() {
  const url = 'https://pub-dde9baaa3a24c5c60912214.r2.dev/products/1771531140924_6_Pack_Gluten_Free_Fig-Walnut_Granola_BITES.jpg';
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`URL: ${url}`);
    console.log(`Status: ${res.status}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

test();
