import * as SQLite from "expo-sqlite";
import type { CreateTransactionInput } from "@fintrack/shared";

type PendingRow = {
  id: string;
  payload: string;
  createdAt: string;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase() {
  databasePromise ??= SQLite.openDatabaseAsync("fintrack.db");
  return databasePromise;
}

export async function initLocalDatabase() {
  const database = await getDatabase();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS pending_transactions (
      id TEXT PRIMARY KEY NOT NULL,
      payload TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}

export async function saveOfflineTransaction(input: CreateTransactionInput) {
  const database = await getDatabase();
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await database.runAsync(
    "INSERT INTO pending_transactions (id, payload, createdAt) VALUES (?, ?, ?)",
    id,
    JSON.stringify(input),
    new Date().toISOString()
  );
  return id;
}

export async function listPendingTransactions() {
  const database = await getDatabase();
  const rows = await database.getAllAsync<PendingRow>("SELECT * FROM pending_transactions ORDER BY createdAt ASC");

  return rows.map((row) => ({
    id: row.id,
    payload: JSON.parse(row.payload) as CreateTransactionInput,
    createdAt: row.createdAt
  }));
}

export async function deletePendingTransaction(id: string) {
  const database = await getDatabase();
  await database.runAsync("DELETE FROM pending_transactions WHERE id = ?", id);
}

export async function countPendingTransactions() {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{ total: number }>("SELECT COUNT(*) as total FROM pending_transactions");
  return rows[0]?.total ?? 0;
}
