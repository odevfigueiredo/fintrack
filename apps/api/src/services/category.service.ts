import type { CreateCategoryInput, UpdateCategoryInput } from "@fintrack/shared";
import { AppError } from "../errors/app-error";
import { serializeCategory } from "../lib/serializers";
import { categoryRepository } from "../repositories/category.repository";

export const categoryService = {
  async list(userId: string) {
    const categories = await categoryRepository.listForUser(userId);
    return categories.map(serializeCategory);
  },

  async create(userId: string, input: CreateCategoryInput) {
    const category = await categoryRepository.create(userId, input);
    return serializeCategory(category);
  },

  async update(userId: string, categoryId: string, input: UpdateCategoryInput) {
    const category = await categoryRepository.findOwned(userId, categoryId);

    if (!category) {
      throw new AppError("Categoria não encontrada ou não editável", 404);
    }

    const updated = await categoryRepository.update(userId, categoryId, input);
    return serializeCategory(updated);
  },

  async delete(userId: string, categoryId: string) {
    const category = await categoryRepository.findOwned(userId, categoryId);

    if (!category) {
      throw new AppError("Categoria não encontrada ou não removível", 404);
    }

    await categoryRepository.delete(userId, categoryId);
  }
};
