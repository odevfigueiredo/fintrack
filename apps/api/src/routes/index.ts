import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { categoryRoutes } from "./category.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { goalRoutes } from "./goal.routes";
import { transactionRoutes } from "./transaction.routes";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/transactions", transactionRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/goals", goalRoutes);
routes.use("/dashboard", dashboardRoutes);
