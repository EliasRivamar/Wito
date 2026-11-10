import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./_common";
import { branches } from "./structure";
import { users, devices } from "./access";
import { products, productVariants, modifiers, stations } from "./catalog";
import { tables } from "./floor";
import { cashSessions, paymentMethods } from "./cash";

export const orders = sqliteTable(
  "orders",
  {
    id: id(),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id),
    businessDate: text("business_date").notNull(), // "2026-11-10", en la zona horaria del local
    number: integer("number").notNull(), // correlativo por sucursal y día
    channel: text("channel", {
      enum: ["dine_in", "takeaway", "delivery", "online", "qr"],
    }).notNull(),
    status: text("status", { enum: ["open", "closed", "cancelled"] })
      .notNull()
      .default("open"),
    waiterUserId: text("waiter_user_id").references(() => users.id),
    customerId: text("customer_id"), // sin FK hasta que exista la tabla customers (Fase 2)
    guests: integer("guests"),
    notes: text("notes"),
    openedAt: integer("opened_at")
      .notNull()
      .$defaultFn(() => Date.now()),
    closedAt: integer("closed_at"),
    closedBy: text("closed_by").references(() => users.id),
    subtotalCents: integer("subtotal_cents").notNull().default(0),
    discountCents: integer("discount_cents").notNull().default(0),
    taxCents: integer("tax_cents").notNull().default(0),
    tipCents: integer("tip_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull().default(0),
    cashSessionId: text("cash_session_id").references(() => cashSessions.id),
    cancelReason: text("cancel_reason"),
    sourceDeviceId: text("source_device_id").references(() => devices.id),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("orders_branch_date_number_uq").on(
      t.branchId,
      t.businessDate,
      t.number,
    ),
  ],
);

/** Un pedido puede ocupar varias mesas (unión de mesas). */
export const orderTables = sqliteTable(
  "order_tables",
  {
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    tableId: text("table_id")
      .notNull()
      .references(() => tables.id),
  },
  (t) => [primaryKey({ columns: [t.orderId, t.tableId] })],
);

/** Cada envío a una estación (comanda). */
export const kitchenTickets = sqliteTable("kitchen_tickets", {
  id: id(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  stationId: text("station_id")
    .notNull()
    .references(() => stations.id),
  number: integer("number").notNull(),
  status: text("status", { enum: ["pending", "printed", "done"] })
    .notNull()
    .default("pending"),
  printedAt: integer("printed_at"),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const orderItems = sqliteTable("order_items", {
  id: id(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  variantId: text("variant_id").references(() => productVariants.id),
  // Snapshot: lo que valía el producto en el momento de la venta.
  nameSnapshot: text("name_snapshot").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  taxRateBp: integer("tax_rate_bp").notNull().default(0),
  quantity: integer("quantity").notNull().default(1),
  notes: text("notes"),
  course: integer("course").notNull().default(1), // 1 = entrada, 2 = principal, etc.
  stationId: text("station_id").references(() => stations.id),
  kitchenTicketId: text("kitchen_ticket_id").references(
    () => kitchenTickets.id,
  ),
  status: text("status", {
    enum: ["pending", "sent", "preparing", "ready", "served", "void"],
  })
    .notNull()
    .default("pending"),
  sentAt: integer("sent_at"),
  readyAt: integer("ready_at"),
  servedAt: integer("served_at"),
  voidReason: text("void_reason"),
  voidedBy: text("voided_by").references(() => users.id),
  parentItemId: text("parent_item_id").references(
    (): AnySQLiteColumn => orderItems.id,
  ),
  ...timestamps,
});

export const orderItemModifiers = sqliteTable("order_item_modifiers", {
  id: id(),
  orderItemId: text("order_item_id")
    .notNull()
    .references(() => orderItems.id),
  modifierId: text("modifier_id").references(() => modifiers.id),
  nameSnapshot: text("name_snapshot").notNull(),
  priceCents: integer("price_cents").notNull().default(0),
});

export const orderDiscounts = sqliteTable("order_discounts", {
  id: id(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  orderItemId: text("order_item_id").references(() => orderItems.id), // nulo = a toda la cuenta
  kind: text("kind", { enum: ["percent", "fixed"] }).notNull(),
  value: integer("value").notNull(), // percent → puntos básicos; fixed → centavos
  amountCents: integer("amount_cents").notNull(), // lo que efectivamente se descontó
  reason: text("reason").notNull(),
  appliedBy: text("applied_by")
    .notNull()
    .references(() => users.id),
  approvedBy: text("approved_by").references(() => users.id),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const payments = sqliteTable("payments", {
  id: id(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  cashSessionId: text("cash_session_id").references(() => cashSessions.id),
  paymentMethodId: text("payment_method_id")
    .notNull()
    .references(() => paymentMethods.id),
  amountCents: integer("amount_cents").notNull(),
  tipCents: integer("tip_cents").notNull().default(0),
  reference: text("reference"),
  status: text("status", { enum: ["completed", "refunded"] })
    .notNull()
    .default("completed"),
  paidAt: integer("paid_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});
