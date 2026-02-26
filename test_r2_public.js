
async function test() {
  const url = 'https://pub-dde9b50a57b84dbaa3a24c5c60912214.r2.dev/products/1771531166676-fltxrj.webp';
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`URL: ${url} -> Status: ${res.status}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}
test();
