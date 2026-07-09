import express from "express";
import dotenv from "dotenv";
import ProductRouter from "./routes/productsRouter.js";
import { connectDB, disconnectDB } from "./config/db.js";

const app = express();

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/products", ProductRouter);


let server: ReturnType<typeof app.listen>;

connectDB().then(() => {
	server = app.listen(PORT, () => {
		console.log(`Server is running at: http:localhost:${PORT}`);
	});
});


// Three error handling functions got from https://github.com/machadop1407/NodeJS-ExpressJS-BackendCourse/blob/main/src/server.js
// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection:", err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
	console.error("Uncaught Exception:", err);
	await disconnectDB();
	process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
	console.log("SIGTERM received, shutting down gracefully");
	server.close(async () => {
		await disconnectDB();
		process.exit(0);
	});
});
