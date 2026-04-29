import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";
import { asyncHandler } from "../middlewares/async-handler";
import { requireAuth } from "../middlewares/auth";

export const transactionRoutes = Router();

transactionRoutes.use(requireAuth);
transactionRoutes.get("/", asyncHandler(transactionController.list));
transactionRoutes.post("/", asyncHandler(transactionController.create));
transactionRoutes.get("/:id", asyncHandler(transactionController.get));
transactionRoutes.put("/:id", asyncHandler(transactionController.update));
transactionRoutes.delete("/:id", asyncHandler(transactionController.delete));
