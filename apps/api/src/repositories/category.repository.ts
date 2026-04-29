import type { CategoryType } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const categoryRepository = {
  listForUser(userId: string) {
    return prisma.category.findMany({
      where: {
        OR: [{ userId: null }, { userId }]
      },
      orderBy: [{ userId: "asc" }, { name: "asc" }]
    });
  },

  findAccessible(userId: string, categoryId: string) {
    return prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ userId: null }, { userId }]
      }
    });
  },

  findOwned(userId: string, categoryId: string) {
    return prisma.category.findFirst({
      where: {
        id: categoryId,
        userId
      }
    });
  },

  create(userId: string, data: { name: string; color: string; type: CategoryType }) {
    return prisma.category.create({
      data: {
        ...data,
        userId
      }
    });
  },

  update(userId: string, categoryId: string, data: Partial<{ name: string; color: string; type: CategoryType }>) {
    return prisma.category.update({
      where: {
        id: categoryId,
        userId
      },
      data
    });
  },

  delete(userId: string, categoryId: string) {
    return prisma.category.delete({
      where: {
        id: categoryId,
        userId
      }
    });
  }
};
