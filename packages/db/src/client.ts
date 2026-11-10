import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export function createDb(path: string) {
  const sqlite = new Database(path);
  sqlite.pragma("journal_mode = WAL"); // más rápido y seguro ante cortes
  sqlite.pragma("foreign_keys = ON"); // SQLite lo trae apagado por defecto
  return { db: drizzle(sqlite, { schema }), sqlite };
}

export type Db = ReturnType<typeof createDb>["db"];
