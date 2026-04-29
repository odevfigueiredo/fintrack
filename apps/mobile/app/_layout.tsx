import { useEffect } from "react";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import "../src/global.css";
import { initLocalDatabase } from "@/lib/local-db";

export default function RootLayout() {
  useEffect(() => {
    void initLocalDatabase();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#07090d" },
          headerTintColor: "#E5EDF4",
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#07090d" }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Cadastro" }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
