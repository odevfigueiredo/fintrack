import { Stack } from "expo-router/stack";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#07090d" },
        headerTintColor: "#E5EDF4",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#07090d" }
      }}
    >
      <Stack.Screen name="home" options={{ title: "Dashboard" }} />
      <Stack.Screen name="transactions" options={{ title: "Transações" }} />
      <Stack.Screen name="new-transaction" options={{ title: "Nova transacao" }} />
      <Stack.Screen name="edit-transaction" options={{ title: "Editar transacao" }} />
      <Stack.Screen name="categories" options={{ title: "Categorias" }} />
      <Stack.Screen name="goals" options={{ title: "Metas" }} />
      <Stack.Screen name="profile" options={{ title: "Perfil" }} />
      <Stack.Screen name="settings" options={{ title: "Configurações" }} />
    </Stack>
  );
}
