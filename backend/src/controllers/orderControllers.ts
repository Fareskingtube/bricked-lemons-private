import type { Request, Response } from "express";
import type { Product } from "../generated/prisma-postgres/index.js";
import { prismaPg } from "../config/dbs.ts";

interface CreateOrderItemInput {
	product: Product;
	quantity: number;
}

interface CreateOrderInput {
	items: CreateOrderItemInput[];
}

export const createOrder = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { items }: CreateOrderInput = req.body;

	if (!userId) {
		return res.status(401).json({ message: "Invalid User ID please login" });
	}

	if (!items || items.length === 0) {
		return res
			.status(400)
			.json({ message: "Order must contain at least one item" });
	}

	try {
		const productIds = items.map((item) => item.product.id);
		const products = await prismaPg.product.findMany({
			where: { id: { in: productIds } },
		});

		if (products.length !== productIds.length) {
			return res
				.status(400)
				.json({ message: "One or more products not found" });
		}

		// Creating a hash map of each productId and it's price
		const priceMap = new Map(
			products.map((product) => [product.id, product.price]),
		);

        // Calculating total price of order
		let totalAmount = 0;
		const orderItemsData = items.map((item) => {
			const price = priceMap.get(item.product.id)!;
			totalAmount += Number(price) * item.quantity;
			return {
				productId: item.product.id,
				quantity: item.quantity,
				price,
			};
		});

        // Creating order with Pending status
		const order = await prismaPg.order.create({
			data: {
				userId: userId,
				totalAmount: totalAmount,
				status: "PENDING",
				items: {
					create: orderItemsData,
				},
			},
			include: { items: { include: { product: true } } },
		});
		res.status(201).json({message: "Order created successfully", order});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error", error });
	}
};

export const getOrders = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		return res.status(401).json({ message: "Invalid User ID please login" });
	}

	try {
		const orders = await prismaPg.order.findMany({
			where: { userId },
			include: { items: { include: { product: true } } },
			orderBy: { createdAt: "desc" },
		});

		res.status(200).json({ orders });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error", error });
	}
};
