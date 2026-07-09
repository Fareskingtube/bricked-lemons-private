import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import { prisma } from "../config/db.js"; // 🚀 Loading your REAL prisma instance
import ProductRouter from "../routes/productsRouter.js";

const app = express();
app.use(express.json());
app.use("/api/products", ProductRouter);

describe("Product API - Integration Tests (Docker DB)", () => {
  
  // Clean the database before and after every single test run
  beforeEach(async () => {
    await prisma.product.deleteMany();
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
  });

  it("should pull real product records from the Docker database with filtering", async () => {
    // 1. Seed real data into your Docker database
    await prisma.product.createMany({
      data: [
        { name: "Gaming Mouse", price: 49.99, category: "Electronics" },
        { name: "Mechanical Keyboard", price: 99.99, category: "Electronics" },
        { name: "Office Chair", price: 149.99, category: "Furniture" },
      ],
    });

    // 2. Execute the actual HTTP request against the sandbox router
    const response = await request(app).get(
      "/api/products?search=Keyboard&category=Electronics"
    );

    // 3. Assert on the real data returned by Prisma
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe("Mechanical Keyboard");
    expect(response.body.pagination.totalItems).toBe(1);
  });

  it("should handle default pagination correctly on an empty database setup", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
    expect(response.body.pagination.totalItems).toBe(0);
  });
});