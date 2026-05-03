import type { CreateTransactionInput, TransactionQuery, UpdateTransactionInput } from "@fintrack/shared";
import { AppError } from "../errors/app-error";
import { serializeTransaction } from "../lib/serializers";
import { categoryRepository } from "../repositories/category.repository";
import { transactionRepository } from "../repositories/transaction.repository";

async function ensureCategoryMatches(userId: string, categoryId: string, type: "income" | "expense") {
  const category = await categoryRepository.findAccessible(userId, categoryId);

  if (!category) {
    throw new AppError("Categoria não encontrada", 404);
  }

  if (category.type !== type) {
    throw new AppError("O tipo da categoria não combina com a transação", 422);
  }

  return category;
}

export const transactionService = {
  async list(userId: string, filters: TransactionQuery) {
    const transactions = await transactionRepository.listForUser(userId, filters);
    return transactions.map(serializeTransaction);
  },

  async get(userId: string, id: string) {
    const transaction = await transactionRepository.findById(userId, id);

    if (!transaction) {
      throw new AppError("Transação não encontrada", 404);
    }

    return serializeTransaction(transaction);
  },

  async create(userId: string, input: CreateTransactionInput) {
    await ensureCategoryMatches(userId, input.categoryId, input.type);

    const transaction = await transactionRepository.create(userId, {
      ...input,
      description: input.description ?? null
    });

    return serializeTransaction(transaction);
  },

  async update(userId: string, id: string, input: UpdateTransactionInput) {
    const current = await transactionRepository.findById(userId, id);

    if (!current) {
      throw new AppError("Transação não encontrada", 404);
    }

    const nextCategoryId = input.categoryId ?? current.categoryId;
    const nextType = input.type ?? current.type;
    await ensureCategoryMatches(userId, nextCategoryId, nextType);

    const transaction = await transactionRepository.update(userId, id, {
      ...input,
      description: input.description === undefined ? undefined : input.description ?? null
    });

    return serializeTransaction(transaction);
  },

  async delete(userId: string, id: string) {
    const current = await transactionRepository.findById(userId, id);

    if (!current) {
      throw new AppError("Transação não encontrada", 404);
    }

    await transactionRepository.delete(userId, id);
  }
};
