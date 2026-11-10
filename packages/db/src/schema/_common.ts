import { integer, text } from "drizzle-orm/sqlite-core";
import { newId } from "@wito/shared";

/** Clave primaria UUID v7. */
export const id = () => text("id").primaryKey().$defaultFn(newId);

/** created_at, updated_at y deleted_at (borrado lógico), en ms UTC. */
export const timestamps = {
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at")
    .notNull()
    .$defaultFn(() => Date.now())
    .$onUpdateFn(() => Date.now()),
  deletedAt: integer("deleted_at"),
};
