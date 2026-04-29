import { prisma } from "../lib/prisma";

export const goalRepository = {
  listForUser(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { deadline: "asc" }
    });
  },

  findById(userId: string, id: string) {
    return prisma.goal.findFirst({
      where: { id, userId }
    });
  },

  create(
    userId: string,
    data: {
      title: string;
      targetAmount: number;
      currentAmount: number;
      deadline: Date;
    }
  ) {
    return prisma.goal.create({
      data: {
        ...data,
        userId
      }
    });
  },

  update(
    userId: string,
    id: string,
    data: Partial<{
      title: string;
      targetAmount: number;
      currentAmount: number;
      deadline: Date;
    }>
  ) {
    return prisma.goal.update({
      where: {
        id,
        userId
      },
      data
    });
  },

  delete(userId: string, id: string) {
    return prisma.goal.delete({
      where: {
        id,
        userId
      }
    });
  }
};
