import express from "express";
import { createOrder } from "../controllers/odrderControllers.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

router.post("/", protect, createOrder);

export default router;
