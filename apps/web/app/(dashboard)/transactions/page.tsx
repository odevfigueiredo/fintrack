"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ApiCategory, ApiTransaction } from "@fintrack/shared";
import { createTransactionSchema } from "@fintrack/shared";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { Button, Card, EmptyState, ErrorBanner, Input, Select, Textarea } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { currentMonthInputValue, formatCurrency, formatDate } from "@/lib/format";

const blankForm = {
  title: "",
  amount: "",
  type: "expense",
  categoryId: "",
  date: new Date().toISOString().slice(0, 10),
  description: ""
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ month: currentMonthInputValue(), type: "", categoryId: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const availableCategories = useMemo(() => categories.filter((category) => category.type === form.type), [categories, form.type]);
  const filterCategories = useMemo(() => categories.filter((category) => !filters.type || category.type === filters.type), [categories, filters.type]);

  async function loadTransactions() {
    const params = new URLSearchParams();

    if (filters.month) params.set("month", filters.month);
    if (filters.type) params.set("type", filters.type);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);

    const data = await apiFetch<ApiTransaction[]>(`/transactions?${params.toString()}`);
    setTransactions(data);
  }

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const [nextCategories] = await Promise.all([apiFetch<ApiCategory[]>("/categories"), loadTransactions()]);
      setCategories(nextCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar transacoes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  useEffect(() => {
    void loadTransactions().catch((err) => setError(err instanceof Error ? err.message : "Erro ao filtrar"));
  }, [filters.month, filters.type, filters.categoryId]);

  function resetForm() {
    setEditingId(null);
    setForm(blankForm);
  }

  function edit(transaction: ApiTransaction) {
    setEditingId(transaction.id);
    setForm({
      title: transaction.title,
      amount: String(transaction.amount),
      type: transaction.type,
      categoryId: transaction.categoryId,
      date: transaction.date.slice(0, 10),
      description: transaction.description ?? ""
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
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
      await apiFetch(editingId ? `/transactions/${editingId}` : "/transactions", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(parsed.data)
      });
      resetForm();
      await loadTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setError(null);
    setLoading(true);

    try {
      await apiFetch(`/transactions/${id}`, { method: "DELETE" });
      await loadTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel remover");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-normal text-white">Transacoes</h1>
        <p className="mt-1 text-sm text-slate-400">Cadastre receitas e despesas com filtros por mes, tipo e categoria.</p>
      </header>

      <ErrorBanner message={error} />

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-normal text-white">{editingId ? "Editar transacao" : "Nova transacao"}</h2>
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
              <Input label="Valor" type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required />
              <Input label="Data" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Tipo" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value, categoryId: "" })}>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </Select>
              <Select label="Categoria" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} required>
                <option value="">Selecione</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <Textarea label="Descricao" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <Button loading={loading} type="submit">
              <Plus className="h-4 w-4" />
              {editingId ? "Salvar alteracoes" : "Adicionar"}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <Input label="Mes" type="month" value={filters.month} onChange={(event) => setFilters({ ...filters, month: event.target.value })} />
            <Select label="Tipo" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value, categoryId: "" })}>
              <option value="">Todos</option>
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </Select>
            <Select label="Categoria" value={filters.categoryId} onChange={(event) => setFilters({ ...filters, categoryId: event.target.value })}>
              <option value="">Todas</option>
              {filterCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          {transactions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-4 font-medium">Titulo</th>
                    <th className="py-3 pr-4 font-medium">Categoria</th>
                    <th className="py-3 pr-4 font-medium">Data</th>
                    <th className="py-3 pr-4 text-right font-medium">Valor</th>
                    <th className="py-3 text-right font-medium">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4 text-slate-100">{transaction.title}</td>
                      <td className="py-3 pr-4 text-slate-400">{transaction.category?.name ?? "Sem categoria"}</td>
                      <td className="py-3 pr-4 text-slate-400">{formatDate(transaction.date)}</td>
                      <td className={`py-3 pr-4 text-right font-medium ${transaction.type === "income" ? "text-emerald-soft" : "text-rose-soft"}`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="secondary" className="px-3" onClick={() => edit(transaction)} aria-label="Editar">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="danger" className="px-3" onClick={() => remove(transaction.id)} aria-label="Remover">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState>Nenhuma transacao encontrada.</EmptyState>
          )}
        </Card>
      </section>
    </div>
  );
}
