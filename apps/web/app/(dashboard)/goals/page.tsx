"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ApiGoal } from "@fintrack/shared";
import { createGoalSchema } from "@fintrack/shared";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { Button, Card, EmptyState, ErrorBanner, Input } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";

const blankForm = {
  title: "",
  targetAmount: "",
  currentAmount: "0",
  deadline: new Date().toISOString().slice(0, 10)
};

export default function GoalsPage() {
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
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar metas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(blankForm);
  }

  function edit(goal: ApiGoal) {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      deadline: goal.deadline.slice(0, 10)
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const parsed = createGoalSchema.safeParse({
      title: form.title,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount),
      deadline: form.deadline
    });

    if (!parsed.success) {
      setLoading(false);
      setError(parsed.error.errors[0]?.message ?? "Revise os campos");
      return;
    }

    try {
      await apiFetch(editingId ? `/goals/${editingId}` : "/goals", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(parsed.data)
      });
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar meta");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setError(null);
    setLoading(true);

    try {
      await apiFetch(`/goals/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel remover meta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-normal text-white">Metas</h1>
        <p className="mt-1 text-sm text-slate-400">Acompanhe objetivos financeiros com progresso e prazo.</p>
      </header>

      <ErrorBanner message={error} />

      <section className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-normal text-white">{editingId ? "Editar meta" : "Nova meta"}</h2>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            ) : null}
          </div>

          <form className="grid gap-4" onSubmit={onSubmit}>
            <Input label="Titulo" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Valor alvo" type="number" min="0.01" step="0.01" value={form.targetAmount} onChange={(event) => setForm({ ...form, targetAmount: event.target.value })} required />
              <Input label="Valor atual" type="number" min="0" step="0.01" value={form.currentAmount} onChange={(event) => setForm({ ...form, currentAmount: event.target.value })} />
            </div>
            <Input label="Prazo" type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} required />
            <Button loading={loading} type="submit">
              <Plus className="h-4 w-4" />
              {editingId ? "Salvar alteracoes" : "Adicionar"}
            </Button>
          </form>
        </Card>

        <div>
          {goals.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <Card key={goal.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold tracking-normal text-white">{goal.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">Prazo: {formatDate(goal.deadline)}</p>
                    </div>
                    <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">{goal.progress}%</span>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                      <span>{formatCurrency(goal.currentAmount)}</span>
                      <span>{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-cyan-primary" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={() => edit(goal)}>
                      <Edit3 className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button type="button" variant="danger" className="px-3" onClick={() => remove(goal.id)} aria-label="Remover">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState>Crie sua primeira meta para acompanhar o progresso.</EmptyState>
          )}
        </div>
      </section>
    </div>
  );
}
