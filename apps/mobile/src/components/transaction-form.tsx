import { useEffect, useMemo, useState } from "react";
import type { ApiCategory, ApiTransaction } from "@fintrack/shared";
import { createTransactionSchema } from "@fintrack/shared";
import { useRouter } from "expo-router";
import { apiFetch } from "@/lib/api";
import { createTransactionWithOfflineFallback } from "@/lib/sync";
import { Button, Card, ErrorText, Field, Segmented } from "@/components/ui";
import { Text, View, Pressable } from "@/tw";

const blankForm = {
  title: "",
  amount: "",
  type: "expense" as "income" | "expense",
  categoryId: "",
  date: new Date().toISOString().slice(0, 10),
  description: ""
};

export function TransactionForm({ transactionId }: { transactionId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const availableCategories = useMemo(() => categories.filter((category) => category.type === form.type), [categories, form.type]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const nextCategories = await apiFetch<ApiCategory[]>("/categories");
        setCategories(nextCategories);

        if (transactionId) {
          const transaction = await apiFetch<ApiTransaction>(`/transactions/${transactionId}`);
          setForm({
            title: transaction.title,
            amount: String(transaction.amount),
            type: transaction.type,
            categoryId: transaction.categoryId,
            date: transaction.date.slice(0, 10),
            description: transaction.description ?? ""
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nao foi possivel carregar dados");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [transactionId]);

  async function submit() {
    setError(null);
    setInfo(null);
    setLoading(true);

    const parsed = createTransactionSchema.safeParse({
      ...form,
      amount: Number(form.amount),
      description: form.description || undefined
    });

    if (!parsed.success) {
      setLoading(false);
      setError(parsed.error.errors[0]?.message ?? "Revise os campos");
      return;
    }

    try {
      if (transactionId) {
        await apiFetch(`/transactions/${transactionId}`, {
          method: "PUT",
          body: JSON.stringify(parsed.data)
        });
      } else {
        const result = await createTransactionWithOfflineFallback(parsed.data);

        if (result.offline) {
          setInfo("Sem conexao: transacao salva localmente para sincronizar depois.");
        }
      }

      if (transactionId) {
        router.replace("/(app)/transactions");
      } else {
        setForm(blankForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="gap-4">
      <ErrorText message={error} />
      {info ? <Text className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">{info}</Text> : null}

      <Field label="Titulo" value={form.title} onChangeText={(value) => setForm({ ...form, title: value })} placeholder="Mercado, salario..." />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Field label="Valor" value={form.amount} keyboardType="decimal-pad" onChangeText={(value) => setForm({ ...form, amount: value })} placeholder="0.00" />
        </View>
        <View className="flex-1">
          <Field label="Data" value={form.date} onChangeText={(value) => setForm({ ...form, date: value })} placeholder="YYYY-MM-DD" />
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-slate-300">Tipo</Text>
        <Segmented value={form.type} onChange={(type) => setForm({ ...form, type, categoryId: "" })} />
      </View>

      <View className="gap-2">
        <Text className="text-sm text-slate-300">Categoria</Text>
        <View className="flex-row flex-wrap gap-2">
          {availableCategories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setForm({ ...form, categoryId: category.id })}
              className={`rounded-md border px-3 py-2 ${
                form.categoryId === category.id ? "border-cyan-primary bg-cyan-300/10" : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <Text className={form.categoryId === category.id ? "text-cyan-100" : "text-slate-300"}>{category.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Field label="Descricao" value={form.description} onChangeText={(value) => setForm({ ...form, description: value })} placeholder="Opcional" />
      <Button loading={loading} onPress={submit}>
        {transactionId ? "Salvar alteracoes" : "Salvar transacao"}
      </Button>
    </Card>
  );
}
