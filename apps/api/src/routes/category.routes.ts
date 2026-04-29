import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { asyncHandler } from "../middlewares/async-handler";
import { requireAuth } from "../middlewares/auth";

export const categoryRoutes = Router();

categoryRoutes.use(requireAuth);
categoryRoutes.get("/", asyncHandler(categoryController.list));
categoryRoutes.post("/", asyncHandler(categoryController.create));
categoryRoutes.put("/:id", asyncHandler(categoryController.update));
categoryRoutes.delete("/:id", asyncHandler(categoryController.delete));
