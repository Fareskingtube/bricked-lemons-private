import express from "express";
import { getProducts, getProductById, createProduct } from "../controllers/productControllers.js";

const router = express.Router()

router.get("/", getProducts)

router.get("/:id", getProductById)

router.post("/create", createProduct)

export default router;