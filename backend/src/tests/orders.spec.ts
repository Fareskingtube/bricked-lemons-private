import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { Request, Response } from "express";

const mockProductFindMany = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockOrderCreate = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;

jest.unstable_mockModule("../config/dbs.js", () => ({
	__esModule: true,
	prismaPg: {
		product: {
			findMany: mockProductFindMany,
		},
		order: {
			create: mockOrderCreate,
		},
	},
}));

// NOTE: the source file is named `odrderControllers.ts` (typo preserved
// intentionally to match the actual filename used by the router).
const { createOrder } = await import("../controllers/odrderControllers.js");

function makeRes() {
	const jsonMock = jest.fn().mockImplementation(() => ({}) as Response);
	const statusMock = jest
		.fn()
		.mockImplementation(() => ({ json: jsonMock }) as any);
	return { res: { status: statusMock } as Partial<Response>, jsonMock, statusMock };
}

describe("Order Controller - createOrder", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let jsonMock: jest.MockedFunction<any>;
	let statusMock: jest.MockedFunction<any>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = {
			user: { id: "user-1" } as any,
			body: {
				items: [
					{ product: { id: "product-1" }, quantity: 2 },
					{ product: { id: "product-2" }, quantity: 1 },
				],
			},
		};
		({ res, jsonMock, statusMock } = makeRes());
	});

	it("should return 401 when there is no authenticated user", async () => {
		delete req.user;

		await createOrder(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(401);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "Invalid User ID please login",
		});
		expect(mockOrderCreate).not.toHaveBeenCalled();
	});

	it("should return 400 when items are missing", async () => {
		req.body = {};

		await createOrder(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(400);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "Order must contain at least one item",
		});
		expect(mockOrderCreate).not.toHaveBeenCalled();
	});

	it("should return 400 when items is an empty array", async () => {
		req.body = { items: [] };

		await createOrder(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(400);
		expect(mockOrderCreate).not.toHaveBeenCalled();
	});

	it("should return 400 when one or more products are not found", async () => {
		mockProductFindMany.mockResolvedValue([
			{ id: "product-1", price: 10 },
			// product-2 missing
		]);

		await createOrder(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(400);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "One or more products not found",
		});
		expect(mockOrderCreate).not.toHaveBeenCalled();
	});

	it("should create an order, compute totals correctly, and return 201", async () => {
		mockProductFindMany.mockResolvedValue([
			{ id: "product-1", price: 10 },
			{ id: "product-2", price: 25 },
		]);

		const mockOrder = {
			id: "order-1",
			userId: "user-1",
			status: "PENDING",
			totalAmount: 45,
			items: [
				{ productId: "product-1", quantity: 2, price: 10, product: {} },
				{ productId: "product-2", quantity: 1, price: 25, product: {} },
			],
		};
		mockOrderCreate.mockResolvedValue(mockOrder);

		await createOrder(req as Request, res as Response);

		expect(mockProductFindMany).toHaveBeenCalledWith({
			where: { id: { in: ["product-1", "product-2"] } },
		});
		expect(mockOrderCreate).toHaveBeenCalledWith({
			data: {
				userId: "user-1",
				totalAmount: 45, // (10 * 2) + (25 * 1)
				status: "PENDING",
				items: {
					create: [
						{ productId: "product-1", quantity: 2, price: 10 },
						{ productId: "product-2", quantity: 1, price: 25 },
					],
				},
			},
			include: { items: { include: { product: true } } },
		});
		expect(statusMock).toHaveBeenCalledWith(201);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "Order created successfully",
			order: mockOrder,
		});
	});

	it("should gracefully capture database exceptions and return a 500 state", async () => {
		mockProductFindMany.mockRejectedValue(new Error("Database connection dropped"));
		jest.spyOn(console, "error").mockImplementation(() => {});

		await createOrder(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(500);
		expect(jsonMock).toHaveBeenCalledWith(
			expect.objectContaining({ message: "Internal server error" }),
		);
	});
});