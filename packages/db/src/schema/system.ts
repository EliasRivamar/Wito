import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id } from "./_common";
import { branches } from "./structure";
import { users, devices } from "./access";

/** Solo se agrega. Nunca se edita ni se borra. */
export const auditLog = sqliteTable("audit_log", {
  id: id(),
  branchId: text("branch_id").references(() => branches.id),
  userId: text("user_id").references(() => users.id),
  deviceId: text("device_id").references(() => devices.id),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  beforeJson: text("before_json", { mode: "json" }),
  afterJson: text("after_json", { mode: "json" }),
  reason: text("reason"),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});
