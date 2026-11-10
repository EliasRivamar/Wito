import { createDb } from "./client";
import { runMigrations } from "./migrate";

const { db } = createDb("./dev.db");
runMigrations(db);
console.log("Migraciones aplicadas.");
