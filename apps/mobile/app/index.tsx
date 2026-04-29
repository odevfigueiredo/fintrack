import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "@/tw";
import { getToken } from "@/lib/auth-store";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    void getToken().then((token) => {
      router.replace(token ? "/(app)/home" : "/login");
    });
  }, [router]);

  return (
    <ScrollView className="flex-1 bg-ink-950" contentContainerClassName="flex-grow items-center justify-center p-6">
      <View className="items-center gap-2">
        <Text className="text-2xl font-semibold text-white">FinTrack</Text>
        <Text className="text-sm text-slate-400">Carregando sua sessao...</Text>
      </View>
    </ScrollView>
  );
}
