import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { ApiUser } from "@fintrack/shared";

const TOKEN_KEY = "fintrack.mobile.token";
const USER_KEY = "fintrack.mobile.user";

async function getItem(key: string) {
  if (Platform.OS === "web") {
    return globalThis.localStorage?.getItem(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string) {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string) {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export async function getToken() {
  return getItem(TOKEN_KEY);
}

export async function setSession(accessToken: string, user: ApiUser) {
  await setItem(TOKEN_KEY, accessToken);
  await setItem(USER_KEY, JSON.stringify(user));
}

export async function getStoredUser() {
  const raw = await getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as ApiUser) : null;
}

export async function clearSession() {
  await deleteItem(TOKEN_KEY);
  await deleteItem(USER_KEY);
}
