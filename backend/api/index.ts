import app from "../src/index.js";
import { connectDBs } from "../src/config/dbs.js";
import type { Request, Response, NextFunction } from "express";

let dbConnected: Promise<void> | null = null;

app.use((req: Request, res: Response, next: NextFunction) => {
	if (!dbConnected) {
		dbConnected = connectDBs();
	}
	dbConnected.then(() => next()).catch(next);
});

export default app;
