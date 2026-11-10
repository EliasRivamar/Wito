import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./_common";

export const business = sqliteTable("business", {
  id: id(),
  name: text("name").notNull(),
  legalName: text("legal_name"),
  taxId: text("tax_id"),
  taxCondition: text("tax_condition"),
  locale: text("locale").notNull().default("es-AR"),
  currency: text("currency").notNull().default("ARS"),
  ...timestamps,
});

export const branches = sqliteTable("branches", {
  id: id(),
  businessId: text("business_id")
    .notNull()
    .references(() => business.id),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  fiscalPosNumber: integer("fiscal_pos_number"),
  timezone: text("timezone")
    .notNull()
    .default("America/Argentina/Buenos_Aires"),
  currency: text("currency").notNull().default("ARS"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const settings = sqliteTable(
  "settings",
  {
    id: id(),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id),
    key: text("key").notNull(),
    valueJson: text("value_json", { mode: "json" }),
    ...timestamps,
  },
  (t) => [uniqueIndex("settings_branch_key_uq").on(t.branchId, t.key)],
);
