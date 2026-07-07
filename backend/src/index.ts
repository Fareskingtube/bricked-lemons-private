import express from "express";
import dotenv from "dotenv";
import ProductRouter from "./routes/productsRouter.js";

const app = express();

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/products", ProductRouter);

app.listen(PORT, () => {
	console.log(`Server is running at: http:localhost:${PORT}`);
});
