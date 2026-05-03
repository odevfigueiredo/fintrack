import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import type { DashboardSummary } from "@fintrack/shared";
import { CategoryChart, IncomeExpenseChart } from "@/components/charts";
import { Button, Card, EmptyState, ErrorText, StatCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { countPendingTransactions } from "@/lib/local-db";
import { syncPendingTransactions } from "@/lib/sync";
import { formatCurrency, formatDate } from "@/lib/format";
import { ScrollView, Text, View } from "@/tw";

export default function HomeScreen() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const syncResult = await syncPendingTransactions().catch(() => null);
      const data = await apiFetch<DashboardSummary>("/dashboard/summary");
      setSummary(data);
      setPending(syncResult?.remaining ?? (await countPendingTransactions()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar o dashboard");
      setPending(await countPendingTransactions());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScrollView className="flex-1 bg-ink-950" contentContainerClassName="gap-5 p-5 pb-10" contentInsetAdjustmentBehavior="automatic">
      <View className="gap-1">
        <Text className="text-3xl font-semibold text-white">FinTrack</Text>
        <Text className="text-sm text-slate-400">Resumo do seu dinheiro agora.</Text>
      </View>

      <ErrorText message={error} />

      {pending > 0 ? (
        <Card className="gap-3 border-cyan-300/20 bg-cyan-300/10">
          <Text className="text-sm font-semibold text-cyan-100">{pending} transação pendente de sincronização</Text>
          <Button loading={loading} onPress={load}>
            Sincronizar
          </Button>
        </Card>
      ) : null}

      <View className="gap-3">
        <View className="flex-row gap-3">
          <StatCard label="Saldo atual" value={summary?.balance ?? 0} />
        </View>
        <View className="flex-row gap-3">
          <StatCard label="Receitas" value={summary?.monthIncome ?? 0} tone="positive" />
          <StatCard label="Despesas" value={summary?.monthExpense ?? 0} tone="negative" />
        </View>
      </View>

      <Card>
        <Text className="text-sm text-slate-400">Maior categoria de despesa</Text>
        <Text className="mt-2 text-xl font-semibold text-white">{summary?.highestExpenseCategory?.categoryName ?? "Sem dados"}</Text>
        <Text className="mt-1 text-sm text-slate-400">{formatCurrency(summary?.highestExpenseCategory?.amount ?? 0)}</Text>
      </Card>

      <View className="gap-3">
        <Button onPress={() => router.push("/(app)/new-transaction")}>Nova transação</Button>
        <View className="flex-row gap-3">
          <Button variant="secondary" className="flex-1" onPress={() => router.push("/(app)/transactions")}>
            Transações
          </Button>
          <Button variant="secondary" className="flex-1" onPress={() => router.push("/(app)/goals")}>
            Metas
          </Button>
        </View>
        <View className="flex-row gap-3">
          <Button variant="secondary" className="flex-1" onPress={() => router.push("/(app)/categories")}>
            Categorias
          </Button>
          <Button variant="secondary" className="flex-1" onPress={() => router.push("/(app)/profile")}>
            Perfil
          </Button>
        </View>
      </View>

      <Card className="gap-4">
        <Text className="text-lg font-semibold text-white">Receitas vs despesas</Text>
        {summary?.monthlySummary.length ? <IncomeExpenseChart data={summary.monthlySummary} /> : <EmptyState>Nenhum dado mensal.</EmptyState>}
      </Card>

      <Card className="gap-4">
        <Text className="text-lg font-semibold text-white">Despesas por categoria</Text>
        {summary?.categorySummary.length ? <CategoryChart data={summary.categorySummary} /> : <EmptyState>Nenhuma despesa no mes.</EmptyState>}
      </Card>

      <Card className="gap-4">
        <Text className="text-lg font-semibold text-white">Últimas transações</Text>
        {summary?.recentTransactions.length ? (
          <View className="gap-3">
            {summary.recentTransactions.map((transaction) => (
              <View key={transaction.id} className="flex-row items-center justify-between gap-3 border-b border-white/5 pb-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-white">{transaction.title}</Text>
                  <Text className="text-xs text-slate-400">
                    {transaction.category?.name ?? "Sem categoria"} - {formatDate(transaction.date)}
                  </Text>
                </View>
                <Text className={`font-semibold ${transaction.type === "income" ? "text-emerald-soft" : "text-rose-soft"}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState>As transações recentes aparecem aqui.</EmptyState>
        )}
      </Card>
    </ScrollView>
  );
}
