import { useEffect, useState } from "react";
import type { ApiGoal } from "@fintrack/shared";
import { createGoalSchema } from "@fintrack/shared";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button, Card, EmptyState, ErrorText, Field } from "@/components/ui";
import { ScrollView, Text, View } from "@/tw";

const blankForm = {
  title: "",
  targetAmount: "",
  currentAmount: "0",
  deadline: new Date().toISOString().slice(0, 10)
};

export default function GoalsScreen() {
  const [goals, setGoals] = useState<ApiGoal[]>([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      setGoals(await apiFetch<ApiGoal[]>("/goals"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar metas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function edit(goal: ApiGoal) {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      deadline: goal.deadline.slice(0, 10)
    });
  }

  function reset() {
    setEditingId(null);
    setForm(blankForm);
  }

  async function submit() {
    setLoading(true);
    setError(null);

    const parsed = createGoalSchema.safeParse({
      title: form.title,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount),
      deadline: form.deadline
    });

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Revise os campos");
      setLoading(false);
      return;
    }

    try {
      await apiFetch(editingId ? `/goals/${editingId}` : "/goals", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(parsed.data)
      });
      reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar meta");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/goals/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível remover meta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-ink-950" contentContainerClassName="gap-5 p-5 pb-10" contentInsetAdjustmentBehavior="automatic">
      <Text className="text-2xl font-semibold text-white">Metas</Text>
      <ErrorText message={error} />

      <Card className="gap-4">
        <Text className="text-lg font-semibold text-white">{editingId ? "Editar meta" : "Nova meta"}</Text>
        <Field label="Título" value={form.title} onChangeText={(title) => setForm({ ...form, title })} placeholder="Reserva de emergência" />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field label="Alvo" value={form.targetAmount} keyboardType="decimal-pad" onChangeText={(targetAmount) => setForm({ ...form, targetAmount })} placeholder="10000" />
          </View>
          <View className="flex-1">
            <Field label="Atual" value={form.currentAmount} keyboardType="decimal-pad" onChangeText={(currentAmount) => setForm({ ...form, currentAmount })} placeholder="0" />
          </View>
        </View>
        <Field label="Prazo" value={form.deadline} onChangeText={(deadline) => setForm({ ...form, deadline })} placeholder="YYYY-MM-DD" />
        <Button loading={loading} onPress={submit}>
          {editingId ? "Salvar alteracoes" : "Adicionar"}
        </Button>
        {editingId ? (
          <Button variant="secondary" onPress={reset}>
            Cancelar
          </Button>
        ) : null}
      </Card>

      {goals.length ? (
        <View className="gap-3">
          {goals.map((goal) => (
            <Card key={goal.id} className="gap-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-white">{goal.title}</Text>
                  <Text className="mt-1 text-xs text-slate-400">Prazo: {formatDate(goal.deadline)}</Text>
                </View>
                <Text className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">{goal.progress}%</Text>
              </View>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">{formatCurrency(goal.currentAmount)}</Text>
                  <Text className="text-xs text-slate-400">{formatCurrency(goal.targetAmount)}</Text>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-white/10">
                  <View className="h-full rounded-full bg-cyan-primary" style={{ width: `${goal.progress}%` }} />
                </View>
              </View>
              <View className="flex-row gap-2">
                <Button variant="secondary" className="flex-1" onPress={() => edit(goal)}>
                  Editar
                </Button>
                <Button variant="danger" className="flex-1" onPress={() => remove(goal.id)}>
                  Remover
                </Button>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <EmptyState>Crie sua primeira meta.</EmptyState>
      )}
    </ScrollView>
  );
}
