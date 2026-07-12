import { admin, protect } from "../middleware/auth.js";
import {
	register,
	login,
	getProfile,
	logout,
	getCompanySecret,
} from "./../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protect, getProfile);

router.get("/admin", protect, admin, getCompanySecret);

export default router;
