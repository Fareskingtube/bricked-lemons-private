import type { Request, Response, CookieOptions } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";

// I use HTTP only cookies I AM SUPERIOR
const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict",
	maxAge: 30 * 1440000, // 30 Days
};

// Generating JWT token
// TODO: needs testing
const generateToken = (id: string, role: string) => {
	// Parsing JWT_SECRET with base64 and casting it to Secret
	const secret: Secret = Buffer.from(process.env.JWT_SECRET!, "base64");

	return jwt.sign({ id, role }, secret, {
		algorithm: "HS512",
		expiresIn: "30d",
	});
};

export const register = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password)
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });

		// I don't need email : email I AM SUPERIOR
		const userExists = await prisma.user.findUnique({
			where: { email },
		});

		// if user exists return HTTP 400 Bad Request
		if (userExists)
			return res.status(400).json({ message: "Email already in use" });

		// Hashing password to store safely on database
		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = await prisma.user.create({
			data: { username, email, password: hashedPassword },
		});

		const token = generateToken(newUser.id, newUser.role);

		res.cookie("token", token, cookieOptions);

		return res.status(201).json({ message: "User created" });
	} catch (error) {
		console.error(error);
	}
};
export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password)
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });

		const user = await prisma.user.findUnique({
			where: { email },
		});

		//  if email doesn't return a valid user return HTTP 401 Unauthorized
		if (!user)
			return res.status(401).json({ message: "Invalid email or password" });

		// Comparing if password is a match
		const isMatch = await bcrypt.compare(password, user.password);

		//  if password and hashed password on db don't match return HTTP 401 Unauthorized
		if (!isMatch)
			return res.status(401).json({ message: "Invalid email or password" });

		const token = generateToken(user.id, user.role);

		res.cookie("token", token, cookieOptions);

		return res.status(200).json({ message: "User logged in successfully", user });
	} catch (error) {
		console.error(error);
	}
};

export const logout = async (req: Request, res: Response) => {
	res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
	return res.status(200).json({ message: "Logged out in successfully" });
	// Return user info from protect middleware
};

export const getProfile = async (req: Request, res: Response) => {
	res.json(req.user);
	// Return user info from protect middleware
};

