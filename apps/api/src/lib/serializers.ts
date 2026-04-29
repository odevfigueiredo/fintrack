import type { Category, Goal, Transaction } from "@prisma/client";
import type { ApiCategory, ApiGoal, ApiTransaction } from "@fintrack/shared";

type TransactionWithCategory = Transaction & {
  category?: Category;
};

export function serializeCategory(category: Category): ApiCategory {
  return {
    id: category.id,
    name: category.name,
    color: category.color,
    type: category.type,
    isDefault: category.userId === null,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  };
}

export function serializeTransaction(transaction: TransactionWithCategory): ApiTransaction {
  return {
    id: transaction.id,
    title: transaction.title,
    amount: Number(transaction.amount),
    type: transaction.type,
    categoryId: transaction.categoryId,
    category: transaction.category
      ? {
          id: transaction.category.id,
          name: transaction.category.name,
          color: transaction.category.color,
          type: transaction.category.type
        }
      : undefined,
    date: transaction.date.toISOString(),
    description: transaction.description,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString()
  };
}

export function serializeGoal(goal: Goal): ApiGoal {
  const targetAmount = Number(goal.targetAmount);
  const currentAmount = Number(goal.currentAmount);

  return {
    id: goal.id,
    title: goal.title,
    targetAmount,
    currentAmount,
    deadline: goal.deadline.toISOString(),
    progress: targetAmount === 0 ? 0 : Math.min(100, Math.round((currentAmount / targetAmount) * 100)),
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString()
  };
}
