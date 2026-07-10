import { PrismaClient } from "../src/generated/prisma/index.js";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Set up the native pg connection pool using your environment variable
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Pass the adapter directly into the constructor to satisfy engineType = "client"
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding with Driver Adapter...");

  // Clean out existing data
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Seeding users...");
  await prisma.user.create({
    data: {
      username: "admin_citrus",
      email: "admin@brickedlemons.com",
      password: "hashed_password_here",
    },
  });

  await prisma.user.create({
    data: {
      username: "mohamed_lemon",
      email: "lemonlover@gmail.com",
      password: "hashed_password_here",
    },
  });

  console.log("📦 Seeding products...");
  await prisma.product.createMany({
    data: [
      { name: "Sour Bricked Lemon", price: 5.99, category: "Fruits" },
      { name: "Sweet Yellow Lemon", price: 2.99, category: "Fruits" },
      { name: "Mechanical Lemon Keyboard", price: 89.99, category: "Electronics" },
      { name: "Neon Lemon Desk Mat", price: 24.99, category: "Electronics" },
      { name: "Organic Lemonade 6-Pack", price: 12.49, category: "Beverages" },
    ],
  });

  console.log("🏁 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    throw new Error("Seed process terminated due to errors.");
  })
  .finally(async () => {
    // 3. Gracefully shut down both Prisma and the connection pool
    await prisma.$disconnect();
    await pool.end();
  });