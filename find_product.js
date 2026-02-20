
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_7BDdmAj0NvLb@ep-delicate-scene-ai5y8879-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=verify-full"
    }
  }
});

async function main() {
  const product = await prisma.product.findFirst();
  console.log(JSON.stringify(product, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
