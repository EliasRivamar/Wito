import { eq } from "drizzle-orm";
import { ROLE_DEFAULTS } from "@wito/shared";
import type { Db } from "./client";
import { roles, rolePermissions, paymentMethods } from "./schema";

/** Crea los roles base. Se puede ejecutar muchas veces sin duplicar nada. */
export function seedRoles(db: Db) {
  db.transaction((tx) => {
    for (const [name, permissions] of Object.entries(ROLE_DEFAULTS)) {
      const existing = tx
        .select()
        .from(roles)
        .where(eq(roles.name, name))
        .get();
      if (existing) continue; // si ya existe, no se toca (puede tener ajustes del cliente)

      const role = tx
        .insert(roles)
        .values({ name, isSystem: true })
        .returning()
        .get();
      tx.insert(rolePermissions)
        .values(
          permissions.map((permissionCode) => ({
            roleId: role.id,
            permissionCode,
          })),
        )
        .run();
    }
  });
}

export function seedPaymentMethods(db: Db) {
  const existing = db.select().from(paymentMethods).all();
  if (existing.length > 0) return; // si ya hay, no se toca

  db.insert(paymentMethods)
    .values([
      { name: "Efectivo", kind: "cash", sortOrder: 1 },
      { name: "Tarjeta", kind: "card", sortOrder: 2 },
      {
        name: "Transferencia",
        kind: "transfer",
        requiresReference: true,
        sortOrder: 3,
      },
      { name: "QR", kind: "qr", sortOrder: 4 },
    ])
    .run();
}
