import type { ApiTransaction } from "@fintrack/shared";
import { describe, expect, it } from "vitest";
import { buildDashboardSummary } from "../services/dashboard.service";

function tx(overrides: Partial<ApiTransaction>): ApiTransaction {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    title: overrides.title ?? "Transacao",
    amount: overrides.amount ?? 100,
    type: overrides.type ?? "expense",
    categoryId: overrides.categoryId ?? "cat-food",
    category: overrides.category ?? {
      id: overrides.categoryId ?? "cat-food",
      name: "Alimentacao",
      color: "#22C55E",
      type: overrides.type ?? "expense"
    },
    date: overrides.date ?? "2026-04-15T12:00:00.000Z",
    description: null,
    createdAt: "2026-04-15T12:00:00.000Z",
    updatedAt: "2026-04-15T12:00:00.000Z"
  };
}

describe("buildDashboardSummary", () => {
  it("calcula saldo, totais do mes e maior categoria de despesa", () => {
    const summary = buildDashboardSummary(
      [
        tx({ type: "income", amount: 5000, categoryId: "salary", category: { id: "salary", name: "Salario", color: "#14B8A6", type: "income" } }),
        tx({ type: "expense", amount: 1200, categoryId: "home", category: { id: "home", name: "Moradia", color: "#A78BFA", type: "expense" } }),
        tx({ type: "expense", amount: 300, categoryId: "food" }),
        tx({ type: "expense", amount: 500, categoryId: "home", category: { id: "home", name: "Moradia", color: "#A78BFA", type: "expense" } }),
        tx({ type: "expense", amount: 100, date: "2026-03-12T12:00:00.000Z" })
      ],
      new Date("2026-04-20T12:00:00.000Z")
    );

    expect(summary.balance).toBe(2900);
    expect(summary.monthIncome).toBe(5000);
    expect(summary.monthExpense).toBe(2000);
    expect(summary.highestExpenseCategory?.categoryName).toBe("Moradia");
    expect(summary.highestExpenseCategory?.amount).toBe(1700);
    expect(summary.monthlySummary).toHaveLength(6);
  });
});
