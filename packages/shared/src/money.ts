/** El dinero siempre vive como entero en centavos. */
export type Cents = number;

/** Aplica un porcentaje en puntos básicos (21 % = 2100), redondeando al más cercano. */
export function applyBasisPoints(amount: Cents, bp: number): Cents {
  return Math.sign(amount) * Math.round((Math.abs(amount) * bp) / 10_000);
}

/** Convierte centavos a texto legible, por ejemplo 123450 → "$ 1.234,50". */
export function formatMoney(
  cents: Cents,
  currency = "ARS",
  locale = "es-AR",
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    cents / 100,
  );
}
