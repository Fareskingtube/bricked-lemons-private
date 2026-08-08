import type { Request, Response } from "express";
import { prismaPg } from "../config/dbs.ts";

export const getCart = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		return res.status(401).json({ message: "Invalid User ID please login" });
	}
	try {
		const cart = await prismaPg.cart.findFirst({
			where: { userId },
			include: { items: true },
		});
		return res.status(200).json(cart);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error", error });
	}
};

export const addToCart = async (req: Request, res: Response) => {
	const { productId } = req.body;
	const userId = req.user?.id;

	if (!userId) {
		return res.status(401).json({ message: "Invalid User ID please login" });
	}
	if (!productId) {
		return res
			.status(401)
			.json({ message: "Invalid product ID please try again" });
	}
	try {
		const product = await prismaPg.product.findFirst({
			where: { id: productId },
		});

		if (!product) {
			return res.status(404).json({ message: "Products not found" });
		}
		const oldCartItems = await prismaPg.cartItem.findMany({
			where: { cart: { userId } },
			select: { price: true, quantity: true },
		});

		const cart = await prismaPg.cart.upsert({
			where: { userId },
			update: {},
			create: { userId: userId, totalAmount: 0 },
		});

		const cartItem = await prismaPg.cartItem.upsert({
			where: {
				cartId_productId: {
					cartId: cart.id,
					productId: product.id,
				},
			},
			update: {
				quantity: { increment: 1 },
			},
			create: {
				cartId: cart.id,
				price: product.price,
				productId: product.id,
				quantity: 1,
			},
		});

		// IDK how this works but hopefully it does
		const items = await prismaPg.cartItem.findMany({
			where: { cartId: cart.id },
			select: { price: true, quantity: true },
		});
		const totalAmount = items.reduce(
			(acc, item) => acc + item.price.mul(item.quantity).toNumber(),
			0,
		);

		const updatedCart = await prismaPg.cart.update({
			where: { id: cart.id },
			data: { totalAmount },
			include: { items: true },
		});

		return res.json({ message: "Product added successfully", updatedCart });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error", error });
	}
};

export const removeFromCart = async (req: Request, res: Response) => {};

export const updateCartItem = async (req: Request, res: Response) => {};
