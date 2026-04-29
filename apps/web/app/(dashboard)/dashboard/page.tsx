"use client";

import { useEffect, useState } from "react";
import type { DashboardSummary } from "@fintrack/shared";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { CategoryChart, IncomeExpenseChart } from "@/components/charts";
import { Button, Card, EmptyState, ErrorBanner, StatCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<DashboardSummary>("/dashboard/summary");
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar o dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="grid gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Resumo financeiro, tendencias e ultimas movimentacoes.</p>
        </div>
        <Button variant="secondary" onClick={load} loading={loading}>
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </header>

      <ErrorBanner message={error} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saldo atual" value={summary?.balance ?? 0} />
        <StatCard label="Receitas no mes" value={summary?.monthIncome ?? 0} tone="positive" />
        <StatCard label="Despesas no mes" value={summary?.monthExpense ?? 0} tone="negative" />
        <Card>
          <p className="text-sm text-slate-400">Maior categoria de despesa</p>
          <p className="mt-3 text-xl font-semibold tracking-normal text-white">{summary?.highestExpenseCategory?.categoryName ?? "Sem dados"}</p>
          <p className="mt-1 text-sm text-slate-400">{formatCurrency(summary?.highestExpenseCategory?.amount ?? 0)}</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-normal text-white">Receitas vs despesas</h2>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-soft" />
                Receita
              </span>
              <span className="inline-flex items-center gap-2">
                <ArrowDownRight className="h-3.5 w-3.5 text-rose-soft" />
                Despesa
              </span>
            </div>
          </div>
          {summary?.monthlySummary.length ? <IncomeExpenseChart data={summary.monthlySummary} /> : <EmptyState>Nenhum dado mensal ainda.</EmptyState>}
        </Card>

        <Card>
          <h2 className="mb-5 text-lg font-semibold tracking-normal text-white">Despesas por categoria</h2>
          {summary?.categorySummary.length ? <CategoryChart data={summary.categorySummary} /> : <EmptyState>Nenhuma despesa no mes.</EmptyState>}
        </Card>
      </section>

      <Card>
        <h2 className="mb-5 text-lg font-semibold tracking-normal text-white">Ultimas transacoes</h2>
        {summary?.recentTransactions.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr className="border-b border-white/10">
                  <th className="py-3 pr-4 font-medium">Titulo</th>
                  <th className="py-3 pr-4 font-medium">Categoria</th>
                  <th className="py-3 pr-4 font-medium">Data</th>
                  <th className="py-3 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4 text-slate-100">{transaction.title}</td>
                    <td className="py-3 pr-4 text-slate-400">{transaction.category?.name ?? "Sem categoria"}</td>
                    <td className="py-3 pr-4 text-slate-400">{formatDate(transaction.date)}</td>
                    <td className={`py-3 text-right font-medium ${transaction.type === "income" ? "text-emerald-soft" : "text-rose-soft"}`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState>As transacoes recentes aparecem aqui.</EmptyState>
        )}
      </Card>
    </div>
  );
}
