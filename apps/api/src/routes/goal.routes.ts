import { Router } from "express";
import { goalController } from "../controllers/goal.controller";
import { asyncHandler } from "../middlewares/async-handler";
import { requireAuth } from "../middlewares/auth";

export const goalRoutes = Router();

goalRoutes.use(requireAuth);
goalRoutes.get("/", asyncHandler(goalController.list));
goalRoutes.post("/", asyncHandler(goalController.create));
goalRoutes.put("/:id", asyncHandler(goalController.update));
goalRoutes.delete("/:id", asyncHandler(goalController.delete));
