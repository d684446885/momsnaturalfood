import { db } from './src/lib/db';

async function main() {
  console.log('Keys of db:', Object.keys(db).filter(k => !k.startsWith('_')));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
