import { useState } from "react";
import { useRouter } from "expo-router";
import type { AuthResponse } from "@fintrack/shared";
import { registerSchema } from "@fintrack/shared";
import { Button, Card, ErrorText, Field } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { setSession } from "@/lib/auth-store";
import { ScrollView, Text, View } from "@/tw";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);

    const parsed = registerSchema.safeParse({ name, email, password });

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Revise os campos");
      setLoading(false);
      return;
    }

    try {
      const result = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify(parsed.data)
      });
      await setSession(result.accessToken, result.user);
      router.replace("/(app)/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-ink-950" contentContainerClassName="flex-grow justify-center gap-6 p-5">
      <View>
        <Text className="text-3xl font-semibold text-white">Criar conta</Text>
        <Text className="mt-2 text-sm text-slate-400">Organize receitas, despesas e metas.</Text>
      </View>

      <Card className="gap-4">
        <ErrorText message={error} />
        <Field label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
        <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="voce@email.com" />
        <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimo 8 caracteres" />
        <Button loading={loading} onPress={submit}>
          Cadastrar
        </Button>
        <Button variant="secondary" onPress={() => router.push("/login")}>
          Voltar para login
        </Button>
      </Card>
    </ScrollView>
  );
}
