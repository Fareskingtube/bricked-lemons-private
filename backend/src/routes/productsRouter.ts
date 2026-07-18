import express from "express";
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	updateProductRating,
} from "../controllers/productControllers.js";
import { upload } from "../middleware/upload.ts";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", upload.array("image", 5), createProduct);

router.patch("/:id", updateProduct);

router.patch("/:id/rating", updateProductRating);

export default router;
