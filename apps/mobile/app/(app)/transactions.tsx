import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import type { ApiTransaction } from "@fintrack/shared";
import { apiFetch } from "@/lib/api";
import { currentMonthInputValue, formatCurrency, formatDate } from "@/lib/format";
import { Button, Card, EmptyState, ErrorText, Field } from "@/components/ui";
import { Pressable, ScrollView, Text, View } from "@/tw";

export default function TransactionsScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [month, setMonth] = useState(currentMonthInputValue());
  const [type, setType] = useState<"" | "income" | "expense">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (month) params.set("month", month);
    if (type) params.set("type", type);

    try {
      setTransactions(await apiFetch<ApiTransaction[]>(`/transactions?${params.toString()}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar transacoes");
    } finally {
      setLoading(false);
    }
  }, [month, type]);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/transactions/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel remover");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-ink-950" contentContainerClassName="gap-5 p-5 pb-10" contentInsetAdjustmentBehavior="automatic">
      <View className="gap-1">
        <Text className="text-2xl font-semibold text-white">Transacoes</Text>
        <Text className="text-sm text-slate-400">Filtre por mes e tipo.</Text>
      </View>

      <ErrorText message={error} />

      <Card className="gap-4">
        <Field label="Mes" value={month} onChangeText={setMonth} placeholder="YYYY-MM" />
        <View className="flex-row gap-2">
          {[
            { label: "Todas", value: "" },
            { label: "Despesas", value: "expense" },
            { label: "Receitas", value: "income" }
          ].map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setType(item.value as "" | "income" | "expense")}
              className={`flex-1 rounded-md px-3 py-3 ${type === item.value ? "bg-cyan-primary" : "border border-white/10 bg-white/[0.05]"}`}
            >
              <Text className={`text-center text-sm font-semibold ${type === item.value ? "text-ink-950" : "text-slate-300"}`}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
        <Button loading={loading} onPress={() => router.push("/(app)/new-transaction")}>
          Nova transacao
        </Button>
      </Card>

      {transactions.length ? (
        <View className="gap-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="gap-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-white">{transaction.title}</Text>
                  <Text className="mt-1 text-xs text-slate-400">
                    {transaction.category?.name ?? "Sem categoria"} - {formatDate(transaction.date)}
                  </Text>
                </View>
                <Text className={`font-semibold ${transaction.type === "income" ? "text-emerald-soft" : "text-rose-soft"}`}>
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Button variant="secondary" className="flex-1" onPress={() => router.push({ pathname: "/(app)/edit-transaction", params: { id: transaction.id } })}>
                  Editar
                </Button>
                <Button variant="danger" className="flex-1" onPress={() => remove(transaction.id)}>
                  Remover
                </Button>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <EmptyState>Nenhuma transacao encontrada.</EmptyState>
      )}
    </ScrollView>
  );
}
