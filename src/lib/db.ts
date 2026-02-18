// Refresh comment to force Next.js to reload the DB client with new models - v18 (Hard Reset CertificationPage) - ${Math.random()}
global.prisma = undefined;
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Force a reset of the global prisma instance to pick up new models
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = undefined;
}

function createPrismaClient() {
  console.log("Initializing Prisma Client...");
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("DATABASE_URL is missing!");
    throw new Error("DATABASE_URL environment variable is not set");
  }

  try {
    console.log("Creating PG Pool...");
    const hasSslMode = connectionString.includes("sslmode=");
    const pool = new Pool({ 
      connectionString,
      ssl: hasSslMode ? { rejectUnauthorized: false } : false
    });
    
    pool.on('error', (err) => console.error('Unexpected error on idle client', err));

    console.log("Creating Prisma PG Adapter...");
    const adapter = new PrismaPg(pool);
    
    const client = new PrismaClient({
      adapter,
      log: ["query", "info", "warn", "error"],
    });

    console.log("Prisma Client Initialized Successfully");
    return client;
  } catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
    throw error;
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;