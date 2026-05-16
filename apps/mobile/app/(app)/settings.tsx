import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { clearSession } from "@/lib/auth-store";
import { countPendingTransactions } from "@/lib/local-db";
import { syncPendingTransactions } from "@/lib/sync";
import { ScreenHeader, ScreenScroll } from "@/components/screen";
import { AnimatedCard, Button, ErrorText } from "@/components/ui";
import { Text, View } from "@/tw";

export default function SettingsScreen() {
  const router = useRouter();
  const [pending, setPending] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refreshPending() {
    setPending(await countPendingTransactions());
  }

  useEffect(() => {
    void refreshPending();
  }, []);

  async function syncNow() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await syncPendingTransactions();
      setMessage(`${result.synced} transacao sincronizada. ${result.remaining} pendente.`);
      await refreshPending();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível sincronizar");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await clearSession();
    router.replace("/login");
  }

  return (
    <ScreenScroll>
      <ScreenHeader
        title="Configuracoes"
        subtitle="Sincronizacao offline, atalhos de navegacao e saida segura da conta."
        badge={pending > 0 ? `${pending} offline` : "Tudo sincronizado"}
      />
      <ErrorText message={error} />
      {message ? <Text className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">{message}</Text> : null}

      <AnimatedCard className="gap-3">
        <Text className="text-lg font-semibold text-white">Offline</Text>
        <Text className="text-sm text-slate-400">{pending} transacao pendente no SQLite local.</Text>
        <Button loading={loading} onPress={syncNow}>
          Sincronizar agora
        </Button>
      </AnimatedCard>

      <AnimatedCard className="gap-3" delay={70}>
        <Text className="text-lg font-semibold text-white">Navegacao</Text>
        <View className="flex-row gap-3">
          <Button variant="secondary" className="flex-1" onPress={() => router.push("/(app)/home")}>
            Home
          </Button>
          <Button variant="secondary" className="flex-1" onPress={() => router.push("/(app)/profile")}>
            Perfil
          </Button>
        </View>
      </AnimatedCard>

      <Button variant="danger" onPress={logout}>
          Sair
        </Button>
    </ScreenScroll>
  );
}
