import express from "express";
import { createOrder, getOrders } from "../controllers/orderControllers.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);

export default router;
