import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const gateways = await db.paymentGateway.findMany();
  console.log("Gateways:", JSON.stringify(gateways, null, 2));
}

main();
