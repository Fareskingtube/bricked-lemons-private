import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { Request, Response } from "express";

process.env.JWT_SECRET = Buffer.from(
	"test-secret-key-for-jwt-signing",
).toString("base64");

const mockFindUnique = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockCreate = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockBcryptHash = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockBcryptCompare = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => Promise<any>
>;
const mockJwtSign = jest.fn() as unknown as jest.MockedFunction<
	(...args: any[]) => any
>;

jest.unstable_mockModule("../config/db.js", () => ({
	__esModule: true,
	prisma: {
		user: {
			findUnique: mockFindUnique,
			create: mockCreate,
		},
	},
}));

jest.unstable_mockModule("bcrypt", () => ({
	__esModule: true,
	default: {
		hash: mockBcryptHash,
		compare: mockBcryptCompare,
	},
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
	__esModule: true,
	default: {
		sign: mockJwtSign,
	},
}));

const { register, login, logout, getProfile } =
	await import("../controllers/authController.ts");

describe("Auth Controller - register", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let jsonMock: jest.MockedFunction<any>;
	let statusMock: jest.MockedFunction<any>;
	let cookieMock: jest.MockedFunction<any>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = { body: {} };
		jsonMock = jest.fn().mockImplementation(() => ({}) as Response);
		statusMock = jest
			.fn()
			.mockImplementation(() => ({ json: jsonMock }) as any);
		cookieMock = jest.fn();

		res = {
			status: statusMock as any,
			json: jsonMock as any,
			cookie: cookieMock as any,
		};
	});

	it("should return 400 if a required field is missing", async () => {
		req.body = { username: "alex", email: "alex@example.com" }; // no password

		await register(req as Request, res as Response);

		expect(mockCreate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "Please provide all required fields",
		});
	});

	it("should return 400 if the email is already in use", async () => {
		req.body = {
			username: "alex",
			email: "alex@example.com",
			password: "password123",
		};
		mockFindUnique.mockResolvedValue({
			id: "existing-id",
			email: "alex@example.com",
		});

		await register(req as Request, res as Response);

		expect(mockCreate).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
		expect(jsonMock).toHaveBeenCalledWith({ message: "Email already in use" });
	});

	it("should hash the password, create the user, set a cookie, and return 201", async () => {
		req.body = {
			username: "alex",
			email: "alex@example.com",
			password: "password123",
		};
		mockFindUnique.mockResolvedValue(null);
		mockBcryptHash.mockResolvedValue("hashed-password");
		mockCreate.mockResolvedValue({
			id: "new-id",
			username: "alex",
			email: "alex@example.com",
			password: "hashed-password",
			role: "USER",
		});
		mockJwtSign.mockReturnValue("signed-jwt-token");

		await register(req as Request, res as Response);

		expect(mockBcryptHash).toHaveBeenCalledWith("password123", 12);
		expect(mockCreate).toHaveBeenCalledWith({
			data: {
				username: "alex",
				email: "alex@example.com",
				password: "hashed-password",
			},
		});
		expect(mockJwtSign).toHaveBeenCalledWith(
			{ id: "new-id", role: "USER" },
			expect.anything(),
			{ algorithm: "HS512", expiresIn: "30d" },
		);
		expect(cookieMock).toHaveBeenCalledWith(
			"token",
			"signed-jwt-token",
			expect.objectContaining({ httpOnly: true, sameSite: "strict" }),
		);
		expect(statusMock).toHaveBeenCalledWith(201);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "User created",
			user: { id: "new-id", username: "alex", role: "USER" },
		});
	});

	it("should NOT return a password field in the response body", async () => {
		req.body = {
			username: "alex",
			email: "alex@example.com",
			password: "password123",
		};
		mockFindUnique.mockResolvedValue(null);
		mockBcryptHash.mockResolvedValue("hashed-password");
		mockCreate.mockResolvedValue({
			id: "new-id",
			username: "alex",
			email: "alex@example.com",
			password: "hashed-password",
			role: "USER",
		});
		mockJwtSign.mockReturnValue("signed-jwt-token");

		await register(req as Request, res as Response);

		const responseBody = jsonMock.mock.calls[0][0];
		expect(responseBody.user.password).toBeUndefined();
	});

	it("should return 500 if prisma throws an error", async () => {
		req.body = {
			username: "alex",
			email: "alex@example.com",
			password: "password123",
		};
		mockFindUnique.mockRejectedValue(new Error("Database connection dropped"));
		jest.spyOn(console, "error").mockImplementation(() => {});

		await register(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(500);
		expect(jsonMock).toHaveBeenCalledWith(
			expect.objectContaining({ message: "Internal server error" }),
		);
	});
	it("should return 400 if email or password is missing", async () => {
		req.body = { email: "alex@example.com" }; // no password

		await login(req as Request, res as Response);

		expect(mockFindUnique).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(400);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "Please provide all required fields",
		});
	});

	it("should return 401 if no user is found for the given email", async () => {
		req.body = { email: "nouser@example.com", password: "password123" };
		mockFindUnique.mockResolvedValue(null);

		await login(req as Request, res as Response);

		expect(mockBcryptCompare).not.toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(401);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "Invalid email or password",
		});
	});

	it("should return 401 if the password doesn't match", async () => {
		req.body = { email: "alex@example.com", password: "wrongpassword" };
		mockFindUnique.mockResolvedValue({
			id: "id1",
			username: "alex",
			email: "alex@example.com",
			password: "hashed-password",
			role: "USER",
		});
		mockBcryptCompare.mockResolvedValue(false);

		await login(req as Request, res as Response);

		expect(statusMock).toHaveBeenCalledWith(401);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "Invalid email or password",
		});
	});

	it("should set a cookie and return 200 on successful login", async () => {
		req.body = { email: "alex@example.com", password: "password123" };
		mockFindUnique.mockResolvedValue({
			id: "id1",
			username: "alex",
			email: "alex@example.com",
			password: "hashed-password",
			role: "USER",
		});
		mockBcryptCompare.mockResolvedValue(true);
		mockJwtSign.mockReturnValue("signed-jwt-token");

		await login(req as Request, res as Response);

		expect(mockBcryptCompare).toHaveBeenCalledWith(
			"password123",
			"hashed-password",
		);
		expect(cookieMock).toHaveBeenCalledWith(
			"token",
			"signed-jwt-token",
			expect.objectContaining({ httpOnly: true, sameSite: "strict" }),
		);
		expect(statusMock).toHaveBeenCalledWith(200);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "User logged in successfully",
			user: { id: "id1", username: "alex", role: "USER" },
		});
	});

	it("should set the cookie with a 30-day maxAge", async () => {
		req.body = {
			username: "alex",
			email: "alex@example.com",
			password: "password123",
		};
		mockFindUnique.mockResolvedValue(null);
		mockBcryptHash.mockResolvedValue("hashed-password");
		mockCreate.mockResolvedValue({
			id: "id1",
			username: "alex",
			email: "alex@example.com",
			role: "USER",
		});
		mockJwtSign.mockReturnValue("signed-jwt-token");

		await register(req as Request, res as Response);

		const [, , options] = cookieMock.mock.calls[0];
		expect(options.maxAge).toBe(30 * 86400000); // 30 days in ms
	});
});
describe("Auth Controller - logout", () => {
	it("should clear the token cookie and return 200", async () => {
		const cookieMock = jest.fn();
		const jsonMock = jest.fn().mockImplementation(() => ({}) as Response);
		const statusMock = jest
			.fn()
			.mockImplementation(() => ({ json: jsonMock }) as any);

		const req = {} as Request;
		const res = {
			status: statusMock,
			cookie: cookieMock,
		} as unknown as Response;

		await logout(req, res);

		expect(cookieMock).toHaveBeenCalledWith(
			"token",
			"",
			expect.objectContaining({ maxAge: 1 }),
		);
		expect(statusMock).toHaveBeenCalledWith(200);
		expect(jsonMock).toHaveBeenCalledWith({
			message: "Logged out in successfully",
		});
	});
});

describe("Auth Controller - getProfile", () => {
	it("should return req.user as the response body", async () => {
		const jsonMock = jest.fn();
		const statusMock = jest
			.fn()
			.mockImplementation(() => ({ json: jsonMock }) as any);
		const req = {
			user: { id: "id1", username: "alex", role: "USER" },
		} as unknown as Request;
		const res = { json: jsonMock, status: statusMock } as unknown as Response;

		await getProfile(req, res);

		expect(statusMock).toHaveBeenCalledWith(200);
		expect(jsonMock).toHaveBeenCalledWith({
			id: "id1",
			username: "alex",
			role: "USER",
		});
	});
});
