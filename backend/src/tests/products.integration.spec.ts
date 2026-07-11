import {
	describe,
	it,
	expect,
	beforeEach,
	afterEach,
	afterAll,
} from "@jest/globals";
import request from "supertest";
import express from "express";
import productsRouter from "../routes/productsRouter.js";
import { prisma } from "../config/db.js";

// Setup an isolated instance of express for testing the router
const app = express();
app.use(express.json());
app.use("/api/products", productsRouter);

describe("Products API - Integration Tests", () => {
	// Wipe the database table clean before and after every single test run
	beforeEach(async () => {
		await prisma.product.deleteMany();
	});

	afterEach(async () => {
		await prisma.product.deleteMany();
	});

	it("GET /api/products - should return empty pagination data when no items exist", async () => {
		const response = await request(app).get("/api/products");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			success: true,
			pagination: {
				totalItems: 0,
				currentPage: 1,
				totalPages: 0,
				limit: 10,
			},
			data: [],
		});
		afterAll(async () => {
			await prisma.$disconnect();
		});
	});

	it("GET /api/products - should apply search, category, and sorting filters against real data", async () => {
		// Seed test data directly into the test database
		await prisma.product.createMany({
			data: [
				{
					name: "Sour Bricked Lemon",
					price: 5.99,
					category: "Fruits",
					imageLink: "",
				},
				{
					name: "Sweet Yellow Lemon",
					price: 2.99,
					category: "Fruits",
					imageLink: "",
				},
				{
					name: "Mechanical Keyboard",
					price: 89.99,
					category: "Electronics",
					imageLink: "",
				},
			],
		});

		// Request with query params
		const response = await request(app)
			.get("/api/products")
			.query({ search: "Lemon", category: "Fruits", sort: "price_asc" });

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveLength(2);

		// Check sorting (price_asc means Sweet Yellow Lemon at $2.99 comes first)
		expect(response.body.data[0].name).toBe("Sweet Yellow Lemon");
		expect(response.body.data[1].name).toBe("Sour Bricked Lemon");
		expect(response.body.pagination.totalItems).toBe(2);
	});
});
