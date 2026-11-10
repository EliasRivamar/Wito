import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { id, timestamps } from "./_common";
import { branches } from "./structure";
import { users } from "./access";

export const paymentMethods = sqliteTable("payment_methods", {
  id: id(),
  name: text("name").notNull(),
  kind: text("kind", {
    enum: ["cash", "card", "transfer", "qr", "voucher", "other"],
  }).notNull(),
  requiresReference: integer("requires_reference", { mode: "boolean" })
    .notNull()
    .default(false),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const cashRegisters = sqliteTable("cash_registers", {
  id: id(),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  name: text("name").notNull(),
  ...timestamps,
});

export const cashSessions = sqliteTable(
  "cash_sessions",
  {
    id: id(),
    cashRegisterId: text("cash_register_id")
      .notNull()
      .references(() => cashRegisters.id),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id),
    openedBy: text("opened_by")
      .notNull()
      .references(() => users.id),
    openedAt: integer("opened_at")
      .notNull()
      .$defaultFn(() => Date.now()),
    openingAmountCents: integer("opening_amount_cents").notNull().default(0),
    closedBy: text("closed_by").references(() => users.id),
    closedAt: integer("closed_at"),
    status: text("status", { enum: ["open", "closed"] })
      .notNull()
      .default("open"),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [
    // Regla de negocio hecha cumplir por la base: una sola sesión abierta por caja.
    uniqueIndex("cash_sessions_one_open_per_register")
      .on(t.cashRegisterId)
      .where(sql`${t.status} = 'open'`),
  ],
);

/** Resultado del arqueo, por medio de pago. */
export const cashSessionTotals = sqliteTable(
  "cash_session_totals",
  {
    cashSessionId: text("cash_session_id")
      .notNull()
      .references(() => cashSessions.id),
    paymentMethodId: text("payment_method_id")
      .notNull()
      .references(() => paymentMethods.id),
    expectedCents: integer("expected_cents").notNull(),
    countedCents: integer("counted_cents").notNull(),
    differenceCents: integer("difference_cents").notNull(),
  },
  (t) => [primaryKey({ columns: [t.cashSessionId, t.paymentMethodId] })],
);

/** Ingresos y egresos de efectivo que no son ventas (retiros, gastos menores). */
export const cashMovements = sqliteTable("cash_movements", {
  id: id(),
  cashSessionId: text("cash_session_id")
    .notNull()
    .references(() => cashSessions.id),
  kind: text("kind", { enum: ["in", "out"] }).notNull(),
  amountCents: integer("amount_cents").notNull(),
  reason: text("reason").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});
