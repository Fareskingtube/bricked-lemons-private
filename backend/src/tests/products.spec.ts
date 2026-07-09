import request from "supertest";
import express from "express";
import { mockDeep } from "jest-mock-extended";
import ProductRouter from "../routes/productsRouter.js";

// Mock your local Prisma client path before importing anything that uses it
import { PrismaClient } from "../generated/prisma/client.js";
const prismaMock = mockDeep<PrismaClient>();

jest.mock("../prisma.js", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

const app = express();
app.use(express.json());
app.use("/api/products", ProductRouter);

describe("GET /api/products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve products filtering by category and applying pagination", async () => {
    const mockDbProducts = [
      { id: 1, name: "Mechanical Keyboard", price: 89.99, category: "Electronics", createdAt: new Date() },
    ];

    prismaMock.product.findMany.mockResolvedValue(mockDbProducts);
    prismaMock.product.count.mockResolvedValue(1);

    const response = await request(app).get("/api/products?category=Electronics&page=1&limit=5");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.pagination).toEqual({
      totalItems: 1,
      currentPage: 1,
      totalPages: 1,
      limit: 5,
    });
  });

  it("should return a 500 error if the database operation fails", async () => {
    prismaMock.product.findMany.mockRejectedValue(new Error("Database disconnected"));

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body.message).toContain("Server encountered an error");
  });
});