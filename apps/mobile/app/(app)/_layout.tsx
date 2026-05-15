import { Stack } from "expo-router/stack";
import { View } from "react-native";

import { BottomHotbar } from "@/components/bottom-hotbar";

export default function AppLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#07090d" }}>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          animationDuration: 240,
          gestureEnabled: true,
          headerStyle: { backgroundColor: "#07090d" },
          headerTintColor: "#E5EDF4",
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#07090d" }
        }}
      >
        <Stack.Screen name="home" options={{ title: "Dashboard" }} />
        <Stack.Screen name="transactions" options={{ title: "Transacoes" }} />
        <Stack.Screen name="new-transaction" options={{ title: "Nova transacao", animation: "slide_from_bottom" }} />
        <Stack.Screen name="edit-transaction" options={{ title: "Editar transacao", animation: "slide_from_bottom" }} />
        <Stack.Screen name="categories" options={{ title: "Categorias" }} />
        <Stack.Screen name="goals" options={{ title: "Metas" }} />
        <Stack.Screen name="profile" options={{ title: "Perfil" }} />
        <Stack.Screen name="settings" options={{ title: "Ajustes" }} />
      </Stack>
      <BottomHotbar />
    </View>
  );
}
