import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express from "express";
import ProductRouter from "../routes/productsRouter.js";

// 🚀 CHANGE THE PATTERN: Wrap mock setups inside vi.hoisted()
const { mockFindMany, mockCount } = vi.hoisted(() => {
  return {
    mockFindMany: vi.fn(),
    mockCount: vi.fn(),
  };
});

// Now this factory can safely read them without a ReferenceError
vi.mock("../config/db.js", () => ({
  __esModule: true,
  prisma: {
    product: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

// Set up the Express sandbox app
const app = express();
app.use(express.json());
app.use("/api/products", ProductRouter);

describe("GET /api/products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a paginated list of products matching the filters", async () => {
    const sampleDbProducts = [
      {
        id: 1,
        name: "Mechanical Keyboard",
        price: 89.99,
        category: "Electronics",
        createdAt: new Date(),
      },
    ];

    mockFindMany.mockResolvedValue(sampleDbProducts);
    mockCount.mockResolvedValue(1);

    const response = await request(app).get(
      "/api/products?search=Keyboard&category=Electronics&page=1&limit=5"
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe("Mechanical Keyboard");
    expect(response.body.pagination).toEqual({
      totalItems: 1,
      currentPage: 1,
      totalPages: 1,
      limit: 5,
    });
  });

  it("should successfully fallback to default sort, page, and limits when no params are provided", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body.pagination).toEqual({
      totalItems: 0,
      currentPage: 1,
      totalPages: 0,
      limit: 10,
    });
  });

  it("should catch database errors cleanly and return a 500 status code", async () => {
    mockFindMany.mockRejectedValue(new Error("Database connection timed out"));

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body.message).toBe("Server encountered an error while retrieving products.");
  });
});