import { createCategorySchema, updateCategorySchema } from "@fintrack/shared";
import type { Request, Response } from "express";
import { requireParam, requireUserId } from "../lib/request";
import { categoryService } from "../services/category.service";

export const categoryController = {
  async list(request: Request, response: Response) {
    const categories = await categoryService.list(requireUserId(request));
    return response.json(categories);
  },

  async create(request: Request, response: Response) {
    const input = createCategorySchema.parse(request.body);
    const category = await categoryService.create(requireUserId(request), input);
    return response.status(201).json(category);
  },

  async update(request: Request, response: Response) {
    const input = updateCategorySchema.parse(request.body);
    const category = await categoryService.update(requireUserId(request), requireParam(request, "id"), input);
    return response.json(category);
  },

  async delete(request: Request, response: Response) {
    await categoryService.delete(requireUserId(request), requireParam(request, "id"));
    return response.status(204).send();
  }
};
