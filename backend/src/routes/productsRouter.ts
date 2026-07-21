import express from "express";
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	createReview,
	getProductReviews,
} from "../controllers/productControllers.js";
import { upload } from "../middleware/upload.ts";
import { admin, protect } from "../middleware/auth.ts";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", upload.array("image", 5), protect, admin, createProduct);

// router.patch("/:id", updateProduct);

router.post("/:id/rating", protect, createReview);
router.get("/:id/rating", getProductReviews);

export default router;
