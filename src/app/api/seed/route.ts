import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🌱 Seeding database...");

    // Create categories
    const electronics = await db.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
      },
    });

    const clothing = await db.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: {
        name: "Clothing",
        slug: "clothing",
      },
    });

    const accessories = await db.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
      },
    });

    const home = await db.category.upsert({
      where: { slug: "home-decor" },
      update: {},
      create: {
        name: "Home & Decor",
        slug: "home-decor",
      },
    });

    // Create products
    const products = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        price: 299.99,
        stock: 50,
        images: ["/products/headphones.jpg"],
        categoryId: electronics.id,
      },
      {
        name: "Smart Watch Pro",
        description: "Advanced smartwatch with health monitoring, GPS, and water resistance.",
        price: 449.99,
        stock: 30,
        images: ["/products/smartwatch.jpg"],
        categoryId: electronics.id,
      },
      {
        name: "Designer Leather Jacket",
        description: "Premium genuine leather jacket with modern cut and luxurious finish.",
        price: 599.99,
        stock: 20,
        images: ["/products/jacket.jpg"],
        categoryId: clothing.id,
      },
      {
        name: "Cashmere Sweater",
        description: "Ultra-soft 100% cashmere sweater for ultimate comfort and style.",
        price: 249.99,
        stock: 40,
        images: ["/products/sweater.jpg"],
        categoryId: clothing.id,
      },
      {
        name: "Luxury Sunglasses",
        description: "Polarized sunglasses with titanium frame and UV protection.",
        price: 189.99,
        stock: 60,
        images: ["/products/sunglasses.jpg"],
        categoryId: accessories.id,
      },
      {
        name: "Italian Leather Wallet",
        description: "Handcrafted Italian leather bifold wallet with RFID protection.",
        price: 129.99,
        stock: 80,
        images: ["/products/wallet.jpg"],
        categoryId: accessories.id,
      },
      {
        name: "Minimalist Table Lamp",
        description: "Modern LED table lamp with touch dimmer and wireless charging base.",
        price: 149.99,
        stock: 35,
        images: ["/products/lamp.jpg"],
        categoryId: home.id,
      },
      {
        name: "Artisan Ceramic Vase",
        description: "Handmade ceramic vase with unique glaze finish, perfect for any room.",
        price: 89.99,
        stock: 25,
        images: ["/products/vase.jpg"],
        categoryId: home.id,
      },
    ];

    for (const product of products) {
      await db.product.create({
        data: product,
      });
    }

    // Create a demo user
    await db.user.upsert({
      where: { email: "demo@example.com" },
      update: {},
      create: {
        email: "demo@example.com",
        name: "Demo User",
        password: "demo123",
        role: "CUSTOMER",
      },
    });

    // Create an admin user
    await db.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        name: "Admin User",
        password: "admin123",
        role: "ADMIN",
      },
    });

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
