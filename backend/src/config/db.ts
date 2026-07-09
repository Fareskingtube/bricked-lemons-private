import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({
	adapter,
	log:
		process.env.NODE_ENV === "development"
			? ["query", "error", "warn"]
			: ["error"],
});

export const connectDB = async () => {
	try {
		await prisma.$connect();
		console.log("DB Connected Successfully");
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Database connection error: ", error.message);
		} else {
			// Handles fallback cases if a non-Error
			console.error("An unexpected error occurred:", String(error));
			process.exit(1);
		}
	}
};

export const disconnectDB = async () => {
	try {
		await prisma.$disconnect();
		console.log("Disconnected From DB");
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Database connection error: ", error.message);
		} else {
			// Handles fallback cases if a non-Error
			console.error("An unexpected error occurred:", String(error));
			process.exit(1);
		}
	}
};
