import { createGoalSchema, updateGoalSchema } from "@fintrack/shared";
import type { Request, Response } from "express";
import { requireParam, requireUserId } from "../lib/request";
import { goalService } from "../services/goal.service";

export const goalController = {
  async list(request: Request, response: Response) {
    const goals = await goalService.list(requireUserId(request));
    return response.json(goals);
  },

  async create(request: Request, response: Response) {
    const input = createGoalSchema.parse(request.body);
    const goal = await goalService.create(requireUserId(request), input);
    return response.status(201).json(goal);
  },

  async update(request: Request, response: Response) {
    const input = updateGoalSchema.parse(request.body);
    const goal = await goalService.update(requireUserId(request), requireParam(request, "id"), input);
    return response.json(goal);
  },

  async delete(request: Request, response: Response) {
    await goalService.delete(requireUserId(request), requireParam(request, "id"));
    return response.status(204).send();
  }
};
