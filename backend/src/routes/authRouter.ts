import { protect } from "../middleware/auth.js";
import {
	register,
	login,
	getProfile,
	logout,
} from "./../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protect, getProfile);

export default router;
