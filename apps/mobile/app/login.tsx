import { useState } from "react";
import { useRouter } from "expo-router";
import type { AuthResponse } from "@fintrack/shared";
import { loginSchema } from "@fintrack/shared";
import { Button, Card, ErrorText, Field } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { setSession } from "@/lib/auth-store";
import { ScrollView, Text, View } from "@/tw";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Revise os campos");
      setLoading(false);
      return;
    }

    try {
      const result = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify(parsed.data)
      });
      await setSession(result.accessToken, result.user);
      router.replace("/(app)/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-ink-950" contentContainerClassName="flex-grow justify-center gap-6 p-5">
      <View>
        <Text className="text-3xl font-semibold text-white">FinTrack</Text>
        <Text className="mt-2 text-sm text-slate-400">Controle financeiro premium no bolso.</Text>
      </View>

      <Card className="gap-4">
        <ErrorText message={error} />
        <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="voce@email.com" />
        <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry placeholder="********" />
        <Button loading={loading} onPress={submit}>
          Entrar
        </Button>
        <Button variant="secondary" onPress={() => router.push("/register")}>
          Criar conta
        </Button>
      </Card>
    </ScrollView>
  );
}
