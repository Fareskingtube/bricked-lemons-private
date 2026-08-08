import express from "express";
import { createOrder, getOrders } from "../controllers/orderControllers.ts";
import { protect } from "../middleware/auth.ts";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartControllers.ts";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/", protect, updateCartItem);
router.delete("/", protect, removeFromCart);

export default router;
