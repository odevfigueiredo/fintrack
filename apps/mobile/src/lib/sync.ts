import * as Network from "expo-network";
import type { ApiTransaction, CreateTransactionInput } from "@fintrack/shared";
import { apiFetch } from "./api";
import { deletePendingTransaction, listPendingTransactions, saveOfflineTransaction } from "./local-db";

export async function createTransactionWithOfflineFallback(input: CreateTransactionInput) {
  const network = await Network.getNetworkStateAsync();

  if (!network.isConnected || network.isInternetReachable === false) {
    await saveOfflineTransaction(input);
    return { offline: true };
  }

  try {
    const transaction = await apiFetch<ApiTransaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(input)
    });
    return { offline: false, transaction };
  } catch (error) {
    await saveOfflineTransaction(input);
    return { offline: true, error };
  }
}

export async function syncPendingTransactions() {
  const network = await Network.getNetworkStateAsync();

  if (!network.isConnected || network.isInternetReachable === false) {
    return { synced: 0, remaining: (await listPendingTransactions()).length };
  }

  const pending = await listPendingTransactions();
  let synced = 0;

  for (const item of pending) {
    await apiFetch("/transactions", {
      method: "POST",
      body: JSON.stringify(item.payload)
    });
    await deletePendingTransaction(item.id);
    synced += 1;
  }

  return {
    synced,
    remaining: Math.max(0, pending.length - synced)
  };
}
