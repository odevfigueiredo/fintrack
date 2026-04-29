import * as SecureStore from "expo-secure-store";
import type { ApiUser } from "@fintrack/shared";

const TOKEN_KEY = "fintrack:mobile:token";
const USER_KEY = "fintrack:mobile:user";

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setSession(accessToken: string, user: ApiUser) {
  await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getStoredUser() {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as ApiUser) : null;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}
