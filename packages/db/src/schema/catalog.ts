import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./_common";
import { branches } from "./structure";

export const taxRates = sqliteTable("tax_rates", {
  id: id(),
  name: text("name").notNull(),
  rateBp: integer("rate_bp").notNull(), // 21 % = 2100
  includedInPrice: integer("included_in_price", { mode: "boolean" })
    .notNull()
    .default(true),
  ...timestamps,
});

export const stations = sqliteTable("stations", {
  id: id(),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  name: text("name").notNull(),
  ...timestamps,
});

export const categories = sqliteTable("categories", {
  id: id(),
  parentId: text("parent_id").references((): AnySQLiteColumn => categories.id),
  name: text("name").notNull(),
  color: text("color"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const products = sqliteTable("products", {
  id: id(),
  categoryId: text("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  sku: text("sku"),
  barcode: text("barcode"),
  type: text("type", { enum: ["simple", "combo"] })
    .notNull()
    .default("simple"),
  basePriceCents: integer("base_price_cents").notNull(),
  taxRateId: text("tax_rate_id").references(() => taxRates.id),
  stationId: text("station_id").references(() => stations.id),
  trackStock: integer("track_stock", { mode: "boolean" })
    .notNull()
    .default(false),
  imagePath: text("image_path"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const productVariants = sqliteTable("product_variants", {
  id: id(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  name: text("name").notNull(),
  priceCents: integer("price_cents").notNull(),
  sku: text("sku"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const modifierGroups = sqliteTable("modifier_groups", {
  id: id(),
  name: text("name").notNull(),
  minSelect: integer("min_select").notNull().default(0),
  maxSelect: integer("max_select"), // nulo = sin límite
  required: integer("required", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const modifiers = sqliteTable("modifiers", {
  id: id(),
  groupId: text("group_id")
    .notNull()
    .references(() => modifierGroups.id),
  name: text("name").notNull(),
  priceCents: integer("price_cents").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const productModifierGroups = sqliteTable(
  "product_modifier_groups",
  {
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    modifierGroupId: text("modifier_group_id")
      .notNull()
      .references(() => modifierGroups.id),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.productId, t.modifierGroupId] })],
);
