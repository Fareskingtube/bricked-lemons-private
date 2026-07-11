import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { Request, Response } from "express";

// Mocking the Prisma client methods used in the getProducts controller
const mockFindMany = jest.fn() as unknown as jest.MockedFunction<(...args: any[]) => Promise<any>>;
const mockCount = jest.fn() as unknown as jest.MockedFunction<(...args: any[]) => Promise<number>>;


jest.unstable_mockModule("../config/db.js", () => ({
  __esModule: true,
  prisma: {
    product: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));


const { getProducts } = await import("../controllers/productControllers.js");

describe("Products Controller - Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.MockedFunction<any>;
  let statusMock: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();

    req = { query: {} };
    jsonMock = jest.fn().mockImplementation(() => ({} as Response));
    statusMock = jest.fn().mockImplementation(() => ({ json: jsonMock } as any));

    res = {
      status: statusMock as any,
    };
  });

  it("should successfully return a paginated list of products with default params", async () => {
    const mockProducts = [
      { id: 1, name: "Lemon Keyboard", price: 45.00, category: "Electronics", createdAt: new Date() }
    ];
    
    mockFindMany.mockResolvedValue(mockProducts);
    mockCount.mockResolvedValue(1);

    await getProducts(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      pagination: {
        totalItems: 1,
        currentPage: 1,
        totalPages: 1,
        limit: 20,
      },
      data: mockProducts,
    });
  });

  it("should accurately forward query search filters and custom limits", async () => {
    req.query = { search: "Lemon", category: "Fruit", page: "2", limit: "5", sort: "price_asc" };

    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await getProducts(req as Request, res as Response);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        name: { contains: "Lemon", mode: "insensitive" },
        category: "Fruit",
      },
      orderBy: { price: "asc" },
      skip: 5,
      take: 5,
    });
    
    expect(statusMock).toHaveBeenCalledWith(200);
  });

  it("should apply descending price sorting when sort parameter is price_desc", async () => {
    req.query = { sort: "price_desc" };
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await getProducts(req as Request, res as Response);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { price: "desc" },
      })
    );
  });

  it("should gracefully capture database execution exceptions and return a 500 state", async () => {
    mockFindMany.mockRejectedValue(new Error("Database connection dropped"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    await getProducts(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Server encountered an error while retrieving products.",
    });
  });
});