import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/async-handler";
import { requireAuth } from "../middlewares/auth";

export const authRoutes = Router();

authRoutes.post("/register", asyncHandler(authController.register));
authRoutes.post("/login", asyncHandler(authController.login));
authRoutes.get("/me", requireAuth, asyncHandler(authController.me));
