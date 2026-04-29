import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { asyncHandler } from "../middlewares/async-handler";
import { requireAuth } from "../middlewares/auth";

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth);
dashboardRoutes.get("/summary", asyncHandler(dashboardController.summary));
