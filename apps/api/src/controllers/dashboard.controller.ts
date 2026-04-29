import type { Request, Response } from "express";
import { requireUserId } from "../lib/request";
import { dashboardService } from "../services/dashboard.service";

export const dashboardController = {
  async summary(request: Request, response: Response) {
    const summary = await dashboardService.summary(requireUserId(request));
    return response.json(summary);
  }
};
