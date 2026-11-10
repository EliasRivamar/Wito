import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./_common";
import { branches } from "./structure";

export const roles = sqliteTable("roles", {
  id: id(),
  name: text("name").notNull().unique(),
  isSystem: integer("is_system", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const rolePermissions = sqliteTable(
  "role_permissions",
  {
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id),
    permissionCode: text("permission_code").notNull(),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionCode] })],
);

export const users = sqliteTable("users", {
  id: id(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email"),
  passwordHash: text("password_hash"),
  pinHash: text("pin_hash"),
  roleId: text("role_id")
    .notNull()
    .references(() => roles.id),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  lastLoginAt: integer("last_login_at"),
  ...timestamps,
});

export const userBranches = sqliteTable(
  "user_branches",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.branchId] })],
);

export const devices = sqliteTable("devices", {
  id: id(),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  name: text("name").notNull(),
  kind: text("kind", { enum: ["pos", "waiter", "kitchen", "admin"] }).notNull(),
  lastSeenAt: integer("last_seen_at"),
  revokedAt: integer("revoked_at"),
  ...timestamps,
});

export const sessions = sqliteTable("sessions", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  deviceId: text("device_id").references(() => devices.id),
  tokenHash: text("token_hash").notNull(),
  expiresAt: integer("expires_at").notNull(),
  revokedAt: integer("revoked_at"),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});
