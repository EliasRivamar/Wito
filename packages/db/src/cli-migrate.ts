import { createDb } from "./client";
import { runMigrations } from "./migrate";
import { seedPaymentMethods, seedRoles } from "./seed";

const { db } = createDb("./dev.db");
runMigrations(db);
seedRoles(db);
seedPaymentMethods(db)
console.log("Migraciones y roles base listos.");
