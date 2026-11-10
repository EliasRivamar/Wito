# Wito

Software de gestión para locales gastronómicos: salón y mesas, pedidos, cocina, caja, productos, stock y reportes. Funciona en celulares, tablets y computadoras, y sigue operando sin conexión a internet.

> **Estado:** en desarrollo temprano (Fase 0: estructura y base del proyecto).

## Ideas centrales

- **Pago único, no suscripción.** La licencia se activa con una clave de un solo uso.
- **El local manda.** Cada local corre su propio servidor; el sistema no depende de internet.
- **Nube opcional.** Backup en la nube, panel remoto y sincronización entre sucursales, por una cuota mínima.
- **Una sola base de código.** La interfaz es una PWA que se instala en cualquier dispositivo.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Interfaz | React, Vite, TypeScript, Tailwind CSS (PWA) |
| Servidor del local | Node.js, Fastify, TypeScript |
| Base de datos | SQLite con Drizzle ORM |
| Validación | Zod |
| Gestor de paquetes | pnpm (workspaces) |

## Estructura del repositorio

```
Wito/
├─ apps/
│  ├─ web/          Interfaz (PWA): caja, salón, cocina, administración
│  └─ server/       Servidor del local (API, tiempo real, backups, licencias)
├─ packages/
│  ├─ shared/       Tipos, validaciones y utilidades compartidas (dinero, IDs)
│  └─ db/           Esquema de la base de datos y migraciones
├─ docs/            Documentación de diseño
├─ pnpm-workspace.yaml
└─ package.json
```

## Requisitos

- [Node.js](https://nodejs.org) (versión LTS)
- [pnpm](https://pnpm.io)
- [Git](https://git-scm.com)

## Primeros pasos

Instalar las dependencias de todo el proyecto (desde la raíz):

```bash
pnpm install
```

Levantar la interfaz en modo desarrollo:

```bash
pnpm --filter ./apps/web dev
```

## Convenciones del proyecto

- **Código en inglés, interfaz en español.**
- **Dinero siempre en centavos** (enteros), nunca decimales.
- **IDs UUID v7**, generados por la aplicación.
- **Fechas en UTC**, mostradas en la zona horaria del negocio.
- **El servidor es la fuente de verdad.** Los totales y permisos se calculan y validan allí.
- **Commits** con prefijo: `feat:`, `fix:`, `chore:`, `docs:`.

## Documentación

- [Modelo de datos](docs/modelo-de-datos.md)

## Licencia

Software propietario. Todos los derechos reservados. No se permite copiar, distribuir ni revender sin autorización.