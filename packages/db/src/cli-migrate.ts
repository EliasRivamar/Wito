import { createDb } from "./client";
import { runMigrations } from "./migrate";
import { seedRoles } from "./seed";

const { db } = createDb("./dev.db");
runMigrations(db);
seedRoles(db);
console.log("Migraciones y roles base listos.");
