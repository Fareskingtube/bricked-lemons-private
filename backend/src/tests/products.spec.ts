import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { Request, Response } from "express";

// Mocking the Prisma client methods used in the getProducts controller
const mockFindMany = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockCount = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<number>
>;
const mockFindUnique = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockCreate = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockUpdate = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockR2Send = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockGetSignedUrl = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<string>
>;

jest.unstable_mockModule("../config/dbs.js", () => ({
	__esModule: true,
	prismaPg: {
		product: {
			findMany: mockFindMany,
			count: mockCount,
			findUnique: mockFindUnique,
			create: mockCreate,
			update: mockUpdate,
		},
	},
}));

jest.unstable_mockModule("../config/r2.js", () => ({
	__esModule: true,
	r2: { send: mockR2Send },
}));

jest.unstable_mockModule("../config/env.js", () => ({
	__esModule: true,
	requireEnv: jest.fn((key: string) => `mock-${key}`),
}));

jest.unstable_mockModule("@aws-sdk/s3-request-presigner", () => ({
	__esModule: true,
	getSignedUrl: mockGetSignedUrl,
}));

const {
	getProducts,
	getProductById,
	createProduct,
	updateProductRating,
	updateProduct,
} = await import("../controllers/productControllers.js");

describe("Products Controller - Unit Tests", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let jsonMock: jest.MockedFunction<any>;
	let statusMock: jest.MockedFunction<any>;

	beforeEach(() => {
		jest.clearAllMocks();

		req = {
			query: {},
			body: {},
			files: [
				{
					originalname: "keyboard.png",
					buffer: Buffer.from("fake image data"),
					mimetype: "image/png",
				} as Express.Multer.File,
			],
		};
		jsonMock = jest.fn().mockImplementation(() => ({}) as Response);
		mockGetSignedUrl.mockResolvedValue(
			"https://mock-bucket.example.com/products/mock-key.jpg",
		);
		mockR2Send.mockResolvedValue({});
		statusMock = jest
			.fn()
			.mockImplementation(() => ({ json: jsonMock }) as any);

		res = {
			status: statusMock as any,
		};
	});

	it("should successfully return a paginated list of products with default params", async () => {
		const mockProducts = [
			{
				id: 1,
				name: "Lemon Keyboard",
				price: 45.0,
				category: "Electronics",
				imageKeys: [expect.any(String)],
				imageUrls: [expect.any(String)],
				createdAt: new Date(),
			},
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
		req.query = {
			search: "Lemon",
			category: "Fruit",
			page: "2",
			limit: "5",
			orderBy: "price",
			orderDirection: "asc",
		};

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

	it("should apply ascending price sorting via orderBy/orderDirection", async () => {
		req.query = { orderBy: "price", orderDirection: "asc" };
		mockFindMany.mockResolvedValue([]);
		mockCount.mockResolvedValue(0);

		await getProducts(req as Request, res as Response);

		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({ orderBy: { price: "asc" } }),
		);
	});

	it("should apply descending price sorting via orderBy/orderDirection", async () => {
		req.query = { orderBy: "price", orderDirection: "desc" };
		mockFindMany.mockResolvedValue([]);
		mockCount.mockResolvedValue(0);

		await getProducts(req as Request, res as Response);

		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({ orderBy: { price: "desc" } }),
		);
	});

	it("should default to createdAt desc when no orderBy/orderDirection given", async () => {
		req.query = {};
		mockFindMany.mockResolvedValue([]);
		mockCount.mockResolvedValue(0);

		await getProducts(req as Request, res as Response);

		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({ orderBy: { createdAt: "desc" } }),
		);
	});

	it("should fall back to createdAt when orderBy is not an allowed field", async () => {
		req.query = { orderBy: "notARealField" };
		mockFindMany.mockResolvedValue([]);
		mockCount.mockResolvedValue(0);

		await getProducts(req as Request, res as Response);

		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({ orderBy: { createdAt: "desc" } }),
		);
	});

	it("should fall back to desc when orderDirection is invalid", async () => {
		req.query = { orderBy: "price", orderDirection: "sideways" };
		mockFindMany.mockResolvedValue([]);
		mockCount.mockResolvedValue(0);

		await getProducts(req as Request, res as Response);

		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({ orderBy: { price: "desc" } }),
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
	it("should filter by minPrice and maxPrice when both are provided", async () => {
		req.query = { minPrice: "10", maxPrice: "50" };
		mockFindMany.mockResolvedValue([]);
		mockCount.mockResolvedValue(0);

		await getProducts(req as Request, res as Response);

		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
					price: { gte: 10, lte: 50 },
				}),
			}),
		);
	});

	it("should filter by minPrice only when maxPrice is not provided", async () => {
		req.query = { minPrice: "20" };
		mockFindMany.mockResolvedValue([]);
		mockCount.mockResolvedValue(0);

		await getProducts(req as Request, res as Response);

		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
					price: { gte: 20 },
				}),
			}),
		);
	});

	it("should ignore non-numeric minPrice/maxPrice values", async () => {
		req.query = { minPrice: "abc", maxPrice: "xyz" };
		mockFindMany.mockResolvedValue([]);
		mockCount.mockResolvedValue(0);

		await getProducts(req as Request, res as Response);

		expect(mockFindMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: {}, // no price filter, no search/category either
			}),
		);
	});

	it("should return 413 and not query the database when limit exceeds 100", async () => {
		req.query = { limit: "150" };

		await getProducts(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(413);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "Page size larger than 100",
		});
		expect(mockFindMany).not.toHaveBeenCalled();
		expect(statusMock).not.toHaveBeenCalledWith(200);
	});
});
describe("Products Controller - getProductById", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let jsonMock: jest.MockedFunction<any>;
	let statusMock: jest.MockedFunction<any>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = { query: {} };
		jsonMock = jest.fn().mockImplementation(() => ({}) as Response);
		statusMock = jest
			.fn()
			.mockImplementation(() => ({ json: jsonMock }) as any);

		res = {
			status: statusMock as any,
		};
	});

	it("should return 400 if no id is provided in the request params", async () => {
		req.params = {};
		await getProductById(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(400);
		expect(jsonMock).toHaveBeenCalledWith({
			success: false,
			message: "Product ID is required.",
		});
	});

	it("should return the product when a valid id is provided", async () => {
		req.params = { id: "abc123" };
		const mockProduct = {
			id: "abc123",
			name: "Lemon Keyboard",
			price: 45.0,
			category: "Electronics",
		};
		mockFindUnique.mockResolvedValue(mockProduct);

		await getProductById(req as Request, res as Response);

		expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: "abc123" } });
		expect(statusMock).toHaveBeenCalledWith(200);
		expect(jsonMock).toHaveBeenCalledWith({
			success: true,
			data: mockProduct,
		});
	});

	it("should return 404 when the product does not exist", async () => {
		req.params = { id: "missing-id" };
		mockFindUnique.mockResolvedValue(null);

		await getProductById(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(404);
		expect(jsonMock).toHaveBeenCalledWith({
			success: false,
			message: "Product not found.",
		});
	});

	it("should gracefully capture database exceptions and return a 500 state", async () => {
		req.params = { id: "abc123" };
		mockFindUnique.mockRejectedValue(new Error("Database connection dropped"));
		jest.spyOn(console, "error").mockImplementation(() => {});

		await getProductById(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(500);
		expect(jsonMock).toHaveBeenCalledWith({
			success: false,
			message: "Server encountered an error while retrieving the product.",
		});
	});
});

describe("Products Controller - createProduct", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let jsonMock: jest.MockedFunction<any>;
	let statusMock: jest.MockedFunction<any>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = {
			body: {},
			files: [
				{
					originalname: "keyboard.png",
					buffer: Buffer.from("fake image data"),
					mimetype: "image/png",
				} as Express.Multer.File,
			],
		};
		mockR2Send.mockResolvedValue({});
		jsonMock = jest.fn().mockImplementation(() => ({}) as Response);
		statusMock = jest
			.fn()
			.mockImplementation(() => ({ json: jsonMock }) as any);

		res = {
			status: statusMock as any,
		};
	});

	it("should create a product and return 201 when all fields are provided", async () => {
		req.body = {
			name: "Lemon Keyboard",
			imageLink: "https://example.com/keyboard.png",
			price: "45.00",
			category: "Electronics",
		};

		const mockCreated = {
			id: "new-id",
			name: "Lemon Keyboard",
			price: 45.0,
			category: "Electronics",
			imageLink: "https://example.com/keyboard.png",
		};
		mockCreate.mockResolvedValue(mockCreated);

		await createProduct(req as Request, res as Response);

		expect(mockCreate).toHaveBeenCalledWith({
			data: {
				name: "Lemon Keyboard",
				price: 45.0,
				category: "Electronics",
				imageKeys: [expect.any(String)],
			},
		});
		expect(statusMock).toHaveBeenCalledWith(201);
		expect(jsonMock).toHaveBeenCalledWith({
			success: true,
			data: mockCreated,
		});
	});

	it("should return 400 when a required field is missing", async () => {
		req.body = {
			name: "Lemon Keyboard",
			imageLink: "https://example.com/keyboard.png",
			// price missing
			category: "Electronics",
		};

		await createProduct(req as Request, res as Response);

		expect(mockCreate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
		expect(jsonMock).toHaveBeenCalledWith({
			success: false,
			message: "give me all the data, you dumbass.",
		});
	});

	it("should gracefully capture database exceptions and return a 500 state", async () => {
		req.body = {
			name: "Lemon Keyboard",
			imageLink: "https://example.com/keyboard.png",
			price: "45.00",
			category: "Electronics",
		};
		mockCreate.mockRejectedValue(new Error("Database connection dropped"));
		jest.spyOn(console, "error").mockImplementation(() => {});

		await createProduct(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(500);
		expect(jsonMock).toHaveBeenCalledWith({
			success: false,
			message: "Server encountered an error while creating the product.",
		});
	});
	it("should return 400 when no image files are provided", async () => {
		req.body = {
			name: "Lemon Keyboard",
			price: "45.00",
			category: "Electronics",
		};
		req.files = [];

		await createProduct(req as Request, res as Response);

		expect(mockCreate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
	});
});

describe("Products Controller - updateProductRating", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let jsonMock: jest.MockedFunction<any>;
	let statusMock: jest.MockedFunction<any>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = { params: {}, body: {} };
		jsonMock = jest.fn().mockImplementation(() => ({}) as Response);
		statusMock = jest
			.fn()
			.mockImplementation(() => ({ json: jsonMock }) as any);
		res = { status: statusMock as any };
	});

	it("should update reviewRating and reviewCount when both are valid", async () => {
		req.params = { id: "abc123" };
		req.body = { reviewRating: 9, reviewCount: 50 };
		mockFindUnique.mockResolvedValue({ id: "abc123" });
		mockUpdate.mockResolvedValue({
			id: "abc123",
			reviewRating: 9,
			reviewCount: 50,
		});

		await updateProductRating(req as Request, res as Response);

		expect(mockUpdate).toHaveBeenCalledWith({
			where: { id: "abc123" },
			data: { reviewRating: 9, reviewCount: 50 },
		});
		expect(statusMock).toHaveBeenCalledWith(200);
	});

	it("should allow updating only reviewCount", async () => {
		req.params = { id: "abc123" };
		req.body = { reviewCount: 10 };
		mockFindUnique.mockResolvedValue({ id: "abc123" });
		mockUpdate.mockResolvedValue({ id: "abc123", reviewCount: 10 });

		await updateProductRating(req as Request, res as Response);

		expect(mockUpdate).toHaveBeenCalledWith({
			where: { id: "abc123" },
			data: { reviewCount: 10 },
		});
	});

	it("should return 400 if neither field is provided", async () => {
		req.params = { id: "abc123" };
		req.body = {};

		await updateProductRating(req as Request, res as Response);

		expect(mockUpdate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
	});

	it("should return 400 for an out-of-range reviewRating", async () => {
		req.params = { id: "abc123" };
		req.body = { reviewRating: 15 };

		await updateProductRating(req as Request, res as Response);

		expect(mockUpdate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
	});

	it("should return 404 if the product doesn't exist", async () => {
		req.params = { id: "missing-id" };
		req.body = { reviewRating: 5 };
		mockFindUnique.mockResolvedValue(null);

		await updateProductRating(req as Request, res as Response);

		expect(mockUpdate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(404);
	});

	it("should gracefully capture database exceptions and return a 500 state", async () => {
		req.params = { id: "abc123" };
		req.body = { reviewRating: 5 };
		mockFindUnique.mockResolvedValue({ id: "abc123" });
		mockUpdate.mockRejectedValue(new Error("Database connection dropped"));
		jest.spyOn(console, "error").mockImplementation(() => {});

		await updateProductRating(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(500);
	});
});

describe("Products Controller - updateProduct", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let jsonMock: jest.MockedFunction<any>;
	let statusMock: jest.MockedFunction<any>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = { params: {}, body: {} };
		jsonMock = jest.fn().mockImplementation(() => ({}) as Response);
		statusMock = jest
			.fn()
			.mockImplementation(() => ({ json: jsonMock }) as any);
		res = { status: statusMock as any };
	});

	it("should update the provided fields when the product exists", async () => {
		req.params = { id: "abc123" };
		req.body = { name: "New Name", price: "60.00" };
		mockFindUnique.mockResolvedValue({ id: "abc123" });
		mockUpdate.mockResolvedValue({
			id: "abc123",
			name: "New Name",
			price: 60.0,
		});

		await updateProduct(req as Request, res as Response);

		expect(mockUpdate).toHaveBeenCalledWith({
			where: { id: "abc123" },
			data: { name: "New Name", price: 60.0 },
		});
		expect(statusMock).toHaveBeenCalledWith(200);
		expect(jsonMock).toHaveBeenCalledWith({
			success: true,
			data: { id: "abc123", name: "New Name", price: 60.0 },
		});
	});

	it("should allow updating a single field", async () => {
		req.params = { id: "abc123" };
		req.body = { category: "Furniture" };
		mockFindUnique.mockResolvedValue({ id: "abc123" });
		mockUpdate.mockResolvedValue({ id: "abc123", category: "Furniture" });

		await updateProduct(req as Request, res as Response);

		expect(mockUpdate).toHaveBeenCalledWith({
			where: { id: "abc123" },
			data: { category: "Furniture" },
		});
	});

	it("should return 400 if no id is provided", async () => {
		req.params = {};
		req.body = { name: "New Name" };

		await updateProduct(req as Request, res as Response);

		expect(mockUpdate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
	});

	it("should return 400 if no fields are provided to update", async () => {
		req.params = { id: "abc123" };
		req.body = {};

		await updateProduct(req as Request, res as Response);

		expect(mockUpdate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
		expect(jsonMock).toHaveBeenCalledWith({
			success: false,
			message: "Provide at least one field to update.",
		});
	});

	it("should return 400 for an invalid price", async () => {
		req.params = { id: "abc123" };
		req.body = { price: "not-a-number" };

		await updateProduct(req as Request, res as Response);

		expect(mockUpdate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
	});

	it("should return 400 for a negative price", async () => {
		req.params = { id: "abc123" };
		req.body = { price: "-10" };

		await updateProduct(req as Request, res as Response);

		expect(mockUpdate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
	});

	it("should return 404 if the product doesn't exist", async () => {
		req.params = { id: "missing-id" };
		req.body = { name: "New Name" };
		mockFindUnique.mockResolvedValue(null);

		await updateProduct(req as Request, res as Response);

		expect(mockUpdate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(404);
	});

	it("should gracefully capture database exceptions and return a 500 state", async () => {
		req.params = { id: "abc123" };
		req.body = { name: "New Name" };
		mockFindUnique.mockResolvedValue({ id: "abc123" });
		mockUpdate.mockRejectedValue(new Error("Database connection dropped"));
		jest.spyOn(console, "error").mockImplementation(() => {});

		await updateProduct(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(500);
	});
});
