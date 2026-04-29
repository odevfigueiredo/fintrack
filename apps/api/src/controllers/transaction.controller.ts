import { createTransactionSchema, transactionQuerySchema, updateTransactionSchema } from "@fintrack/shared";
import type { Request, Response } from "express";
import { requireParam, requireUserId } from "../lib/request";
import { transactionService } from "../services/transaction.service";

export const transactionController = {
  async list(request: Request, response: Response) {
    const filters = transactionQuerySchema.parse(request.query);
    const transactions = await transactionService.list(requireUserId(request), filters);
    return response.json(transactions);
  },

  async create(request: Request, response: Response) {
    const input = createTransactionSchema.parse(request.body);
    const transaction = await transactionService.create(requireUserId(request), input);
    return response.status(201).json(transaction);
  },

  async get(request: Request, response: Response) {
    const transaction = await transactionService.get(requireUserId(request), requireParam(request, "id"));
    return response.json(transaction);
  },

  async update(request: Request, response: Response) {
    const input = updateTransactionSchema.parse(request.body);
    const transaction = await transactionService.update(requireUserId(request), requireParam(request, "id"), input);
    return response.json(transaction);
  },

  async delete(request: Request, response: Response) {
    await transactionService.delete(requireUserId(request), requireParam(request, "id"));
    return response.status(204).send();
  }
};
