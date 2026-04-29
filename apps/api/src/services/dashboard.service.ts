import type { ApiTransaction, DashboardCategorySlice, DashboardMonthlyPoint, DashboardSummary } from "@fintrack/shared";
import { lastMonths } from "../lib/date-range";
import { serializeTransaction } from "../lib/serializers";
import { transactionRepository } from "../repositories/transaction.repository";

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function currentMonthKey(now: Date) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 7);
}

function transactionMonth(transaction: ApiTransaction) {
  return transaction.date.slice(0, 7);
}

export function buildDashboardSummary(transactions: ApiTransaction[], now = new Date()): DashboardSummary {
  const currentMonth = currentMonthKey(now);
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const balance = transactions.reduce((total, transaction) => {
    return total + (transaction.type === "income" ? transaction.amount : -transaction.amount);
  }, 0);

  const monthTransactions = transactions.filter((transaction) => transactionMonth(transaction) === currentMonth);
  const monthIncome = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const monthExpense = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const categoryMap = new Map<string, DashboardCategorySlice>();

  for (const transaction of monthTransactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    const categoryId = transaction.categoryId;
    const current = categoryMap.get(categoryId);
    const amount = (current?.amount ?? 0) + transaction.amount;

    categoryMap.set(categoryId, {
      categoryId,
      categoryName: transaction.category?.name ?? "Sem categoria",
      color: transaction.category?.color ?? "#38BDF8",
      amount: roundMoney(amount)
    });
  }

  const categorySummary = [...categoryMap.values()].sort((a, b) => b.amount - a.amount);
  const monthlyKeys = lastMonths(6, now);
  const monthlySummary: DashboardMonthlyPoint[] = monthlyKeys.map((month) => {
    const monthItems = transactions.filter((transaction) => transactionMonth(transaction) === month);
    return {
      month,
      income: roundMoney(
        monthItems.filter((transaction) => transaction.type === "income").reduce((total, transaction) => total + transaction.amount, 0)
      ),
      expense: roundMoney(
        monthItems.filter((transaction) => transaction.type === "expense").reduce((total, transaction) => total + transaction.amount, 0)
      )
    };
  });

  return {
    balance: roundMoney(balance),
    monthIncome: roundMoney(monthIncome),
    monthExpense: roundMoney(monthExpense),
    highestExpenseCategory: categorySummary[0] ?? null,
    recentTransactions,
    monthlySummary,
    categorySummary
  };
}

export const dashboardService = {
  async summary(userId: string) {
    const transactions = await transactionRepository.listForUser(userId, {});
    return buildDashboardSummary(transactions.map(serializeTransaction));
  }
};
