import { useEffect, useState } from "react";
import type { ApiCategory } from "@fintrack/shared";
import { createCategorySchema } from "@fintrack/shared";
import { apiFetch } from "@/lib/api";
import { Button, Card, EmptyState, ErrorText, Field, Segmented } from "@/components/ui";
import { Pressable, ScrollView, Text, View } from "@/tw";

const blankForm = {
  name: "",
  color: "#22D3EE",
  type: "expense" as "income" | "expense"
};

export default function CategoriesScreen() {
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

  function edit(category: ApiCategory) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      color: category.color,
      type: category.type
    });
  }

  function reset() {
    setEditingId(null);
    setForm(blankForm);
  }

  async function submit() {
    setLoading(true);
    setError(null);

    const parsed = createCategorySchema.safeParse(form);

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Revise os campos");
      setLoading(false);
      return;
    }

    try {
      await apiFetch(editingId ? `/categories/${editingId}` : "/categories", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(parsed.data)
      });
      reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar categoria");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setLoading(true);
    setError(null);

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
    <ScrollView className="flex-1 bg-ink-950" contentContainerClassName="gap-5 p-5 pb-10" contentInsetAdjustmentBehavior="automatic">
      <Text className="text-2xl font-semibold text-white">Categorias</Text>
      <ErrorText message={error} />

      <Card className="gap-4">
        <Text className="text-lg font-semibold text-white">{editingId ? "Editar categoria" : "Nova categoria"}</Text>
        <Field label="Nome" value={form.name} onChangeText={(name) => setForm({ ...form, name })} placeholder="Alimentacao" />
        <Field label="Cor" value={form.color} onChangeText={(color) => setForm({ ...form, color })} placeholder="#22D3EE" />
        <Segmented value={form.type} onChange={(type) => setForm({ ...form, type })} />
        <Button loading={loading} onPress={submit}>
          {editingId ? "Salvar alteracoes" : "Adicionar"}
        </Button>
        {editingId ? (
          <Button variant="secondary" onPress={reset}>
            Cancelar
          </Button>
        ) : null}
      </Card>

      {categories.length ? (
        <View className="gap-3">
          {categories.map((category) => (
            <Card key={category.id} className="gap-4">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-row items-center gap-3">
                  <View className="h-9 w-9 rounded-md" style={{ backgroundColor: category.color }} />
                  <View>
                    <Text className="text-base font-semibold text-white">{category.name}</Text>
                    <Text className="text-xs text-slate-400">{category.type === "income" ? "Receita" : "Despesa"}</Text>
                  </View>
                </View>
                {category.isDefault ? <Text className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400">Padrao</Text> : null}
              </View>
              {!category.isDefault ? (
                <View className="flex-row gap-2">
                  <Button variant="secondary" className="flex-1" onPress={() => edit(category)}>
                    Editar
                  </Button>
                  <Button variant="danger" className="flex-1" onPress={() => remove(category.id)}>
                    Remover
                  </Button>
                </View>
              ) : null}
            </Card>
          ))}
        </View>
      ) : (
        <EmptyState>Nenhuma categoria encontrada.</EmptyState>
      )}
    </ScrollView>
  );
}
