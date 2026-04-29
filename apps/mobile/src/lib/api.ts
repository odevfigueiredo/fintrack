import type { ApiErrorResponse } from "@fintrack/shared";
import { getToken } from "./auth-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = await getToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({
      message: "Erro ao comunicar com a API"
    }))) as ApiErrorResponse;
    throw new Error(error.message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
