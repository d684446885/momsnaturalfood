import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is missing");

  const pool = new Pool({ 
    connectionString,
    ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : false
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const email = "admin@momsnaturalfood.com";
  const password = "AdminPassword123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`🚀 Creating admin user: ${email}`);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN"
    },
    create: {
      email,
      name: "MoM's Admin",
      password: hashedPassword,
      role: "ADMIN"
    },
  });

  console.log("✅ Admin user created/updated successfully!");
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // We can't easily access the prisma instance here if it's inside main()
    // but the script will exit anyway. For a standalone script this is fine.
  });
