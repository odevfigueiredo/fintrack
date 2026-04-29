import type { Prisma, TransactionType } from "@prisma/client";
import type { TransactionQuery } from "@fintrack/shared";
import { monthRange } from "../lib/date-range";
import { prisma } from "../lib/prisma";

function buildWhere(userId: string, filters: TransactionQuery = {}) {
  const where: Prisma.TransactionWhereInput = { userId };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.month) {
    const { start, end } = monthRange(filters.month);
    where.date = { gte: start, lt: end };
  }

  if (filters.startDate || filters.endDate) {
    where.date = {
      ...(typeof where.date === "object" ? where.date : {}),
      ...(filters.startDate ? { gte: filters.startDate } : {}),
      ...(filters.endDate ? { lte: filters.endDate } : {})
    };
  }

  return where;
}

export const transactionRepository = {
  listForUser(userId: string, filters: TransactionQuery = {}) {
    return prisma.transaction.findMany({
      where: buildWhere(userId, filters),
      include: { category: true },
      orderBy: { date: "desc" }
    });
  },

  findById(userId: string, id: string) {
    return prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: true }
    });
  },

  create(
    userId: string,
    data: {
      title: string;
      amount: number;
      type: TransactionType;
      categoryId: string;
      date: Date;
      description?: string | null;
    }
  ) {
    return prisma.transaction.create({
      data: {
        ...data,
        userId
      },
      include: { category: true }
    });
  },

  update(
    userId: string,
    id: string,
    data: Partial<{
      title: string;
      amount: number;
      type: TransactionType;
      categoryId: string;
      date: Date;
      description: string | null;
    }>
  ) {
    return prisma.transaction.update({
      where: {
        id,
        userId
      },
      data,
      include: { category: true }
    });
  },

  delete(userId: string, id: string) {
    return prisma.transaction.delete({
      where: {
        id,
        userId
      }
    });
  }
};
