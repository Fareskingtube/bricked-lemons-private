import express from "express";
import dotenv from "dotenv";
import ProductRouter from "./routes/productsRouter.js";
import AuthRouter from "./routes/authRouter.js";
import OrderRouter from "./routes/orderRoutes.ts";
import { connectDBs, disconnectDBs } from "./config/dbs.ts";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

const CORS_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173/";

app.use(
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
	}),
);

const PORT = process.env.PORT || 5000;

app.use("/api/products", ProductRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/orders", OrderRouter);

let server: ReturnType<typeof app.listen>;

connectDBs().then(() => {
	server = app.listen(PORT, () => {
		console.log(`Server is running at: http:localhost:${PORT}`);
	});
});

// Three error handling functions got from https://github.com/machadop1407/NodeJS-ExpressJS-BackendCourse/blob/main/src/server.js
// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection:", err);
	server.close(async () => {
		await disconnectDBs();
		process.exit(1);
	});
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
	console.error("Uncaught Exception:", err);
	await disconnectDBs();
	process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
	console.log("SIGTERM received, shutting down gracefully");
	server.close(async () => {
		await disconnectDBs();
		process.exit(0);
	});
});
