import { uuidv7 } from "uuidv7";

/** Genera un ID único ordenable por tiempo (UUID v7). */
export const newId = (): string => uuidv7();
