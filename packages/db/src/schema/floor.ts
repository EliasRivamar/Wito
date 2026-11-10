import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./_common";
import { branches } from "./structure";

export const zones = sqliteTable("zones", {
  id: id(),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const tables = sqliteTable("tables", {
  id: id(),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  zoneId: text("zone_id")
    .notNull()
    .references(() => zones.id),
  label: text("label").notNull(),
  seats: integer("seats").notNull().default(2),
  shape: text("shape", { enum: ["square", "round", "rect"] })
    .notNull()
    .default("square"),
  layoutX: integer("layout_x").notNull().default(0),
  layoutY: integer("layout_y").notNull().default(0),
  layoutW: integer("layout_w").notNull().default(1),
  layoutH: integer("layout_h").notNull().default(1),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});
