"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ApiCategory } from "@fintrack/shared";
import { createCategorySchema } from "@fintrack/shared";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { Button, Card, EmptyState, ErrorBanner, Input, Select } from "@/components/ui";
import { apiFetch } from "@/lib/api";

const blankForm = {
  name: "",
  color: "#22D3EE",
  type: "expense"
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      setCategories(await apiFetch<ApiCategory[]>("/categories"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar categorias");
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

  function edit(category: ApiCategory) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      color: category.color,
      type: category.type
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const parsed = createCategorySchema.safeParse(form);

    if (!parsed.success) {
      setLoading(false);
      setError(parsed.error.errors[0]?.message ?? "Revise os campos");
      return;
    }

    try {
      await apiFetch(editingId ? `/categories/${editingId}` : "/categories", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(parsed.data)
      });
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar categoria");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setError(null);
    setLoading(true);

    try {
      await apiFetch(`/categories/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível remover categoria");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-normal text-white">Categorias</h1>
        <p className="mt-1 text-sm text-slate-400">Organize receitas e despesas com cores e tipos.</p>
      </header>

      <ErrorBanner message={error} />

      <section className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-normal text-white">{editingId ? "Editar categoria" : "Nova categoria"}</h2>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            ) : null}
          </div>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <Input label="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Cor" type="color" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} required className="h-11 p-1" />
              <Select label="Tipo" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </Select>
            </div>
            <Button loading={loading} type="submit">
              <Plus className="h-4 w-4" />
              {editingId ? "Salvar alteracoes" : "Adicionar"}
            </Button>
          </form>
        </Card>

        <Card>
          {categories.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <article key={category.id} className="rounded-lg border border-white/10 bg-ink-950/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="mb-3 block h-2 w-12 rounded-full" style={{ backgroundColor: category.color }} />
                      <h3 className="truncate text-base font-semibold tracking-normal text-white">{category.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{category.type === "income" ? "Receita" : "Despesa"}</p>
                    </div>
                    {category.isDefault ? <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400">Padrao</span> : null}
                  </div>

                  {!category.isDefault ? (
                    <div className="mt-4 flex gap-2">
                      <Button type="button" variant="secondary" className="flex-1 px-3" onClick={() => edit(category)}>
                        <Edit3 className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button type="button" variant="danger" className="px-3" onClick={() => remove(category.id)} aria-label="Remover">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState>As categorias aparecem aqui depois do seed ou do cadastro.</EmptyState>
          )}
        </Card>
      </section>
    </div>
  );
}
