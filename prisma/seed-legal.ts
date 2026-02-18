import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ 
  connectionString,
  ssl: connectionString?.includes("sslmode=require") ? { rejectUnauthorized: false } : false
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Legal pages...");

  const pages = [
    {
      title: "Shipping Info",
      slug: "shipping-info",
      content: `
        <h2>Shipment processing time</h2>
        <p>All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.</p>
        <p>If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.</p>
        
        <h2>Shipping rates & delivery estimates</h2>
        <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
        <ul>
          <li><strong>Standard Shipping:</strong> 3-5 business days - €4.95</li>
          <li><strong>Express Shipping:</strong> 1-2 business days - €12.95</li>
          <li><strong>Free Shipping:</strong> On orders over €50</li>
        </ul>

        <h2>Shipment confirmation & Order tracking</h2>
        <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>
      `
    },
    {
      title: "Returns Policy",
      slug: "returns-policy",
      content: `
        <h2>Returns</h2>
        <p>Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.</p>
        <p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>

        <h2>Refunds (if applicable)</h2>
        <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.</p>
        <p>If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>

        <h2>Shipping</h2>
        <p>To return your product, you should mail your product to our physical address.</p>
        <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
      `
    },
    {
      title: "Privacy & Terms",
      slug: "privacy-terms",
      content: `
        <h2>Privacy Policy</h2>
        <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from MoM's NaturalFood.</p>
        
        <h2>Personal Information We Collect</h2>
        <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>

        <h2>Terms of Service</h2>
        <p>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service.</p>
      `
    }
  ];

  for (const page of pages) {
    await prisma.legalPage.upsert({
      where: { slug: page.slug },
      update: { content: page.content.trim() },
      create: { 
        title: page.title,
        slug: page.slug,
        content: page.content.trim()
      }
    });
  }

  console.log("Legal seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
