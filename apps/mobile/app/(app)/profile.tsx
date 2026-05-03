import { useEffect, useState } from "react";
import type { ApiUser } from "@fintrack/shared";
import { useRouter } from "expo-router";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth-store";
import { Button, Card, ErrorText } from "@/components/ui";
import { ScrollView, Text, View } from "@/tw";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setUser(await getStoredUser());

      try {
        setUser(await apiFetch<ApiUser>("/auth/me"));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar perfil");
      }
    }

    void load();
  }, []);

  return (
    <ScrollView className="flex-1 bg-ink-950" contentContainerClassName="gap-5 p-5 pb-10" contentInsetAdjustmentBehavior="automatic">
      <Text className="text-2xl font-semibold text-white">Perfil</Text>
      <ErrorText message={error} />

      <Card className="gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-lg bg-cyan-primary">
          <Text className="text-2xl font-semibold text-ink-950">{user?.name?.slice(0, 1).toUpperCase() ?? "F"}</Text>
        </View>
        <View>
          <Text className="text-xl font-semibold text-white">{user?.name ?? "Usuário"}</Text>
          <Text className="mt-1 text-sm text-slate-400">{user?.email ?? "email não carregado"}</Text>
        </View>
      </Card>

      <Card className="gap-3">
        <Button variant="secondary" onPress={() => router.push("/(app)/categories")}>
          Categorias
        </Button>
        <Button variant="secondary" onPress={() => router.push("/(app)/goals")}>
          Metas
        </Button>
        <Button variant="secondary" onPress={() => router.push("/(app)/settings")}>
          Configurações
        </Button>
      </Card>
    </ScrollView>
  );
}
