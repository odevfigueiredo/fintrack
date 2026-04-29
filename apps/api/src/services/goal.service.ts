import type { CreateGoalInput, UpdateGoalInput } from "@fintrack/shared";
import { AppError } from "../errors/app-error";
import { serializeGoal } from "../lib/serializers";
import { goalRepository } from "../repositories/goal.repository";

export const goalService = {
  async list(userId: string) {
    const goals = await goalRepository.listForUser(userId);
    return goals.map(serializeGoal);
  },

  async create(userId: string, input: CreateGoalInput) {
    const goal = await goalRepository.create(userId, {
      ...input,
      currentAmount: input.currentAmount ?? 0
    });

    return serializeGoal(goal);
  },

  async update(userId: string, id: string, input: UpdateGoalInput) {
    const current = await goalRepository.findById(userId, id);

    if (!current) {
      throw new AppError("Meta nao encontrada", 404);
    }

    const goal = await goalRepository.update(userId, id, input);
    return serializeGoal(goal);
  },

  async delete(userId: string, id: string) {
    const current = await goalRepository.findById(userId, id);

    if (!current) {
      throw new AppError("Meta nao encontrada", 404);
    }

    await goalRepository.delete(userId, id);
  }
};
