import express from "express";
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	updateProductRating,
} from "../controllers/productControllers.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/create", createProduct);

router.patch("/:id", updateProduct);

router.patch("/:id/rating", updateProductRating);

export default router;
