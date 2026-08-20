# kata.ianexora.com — blog + newsletter

Plataforma de marca personal sobre IA: artículos interactivos, un curso de seis lecciones,
recursos descargables y una newsletter con doble opt-in. En producción en
[kata.ianexora.com](https://kata.ianexora.com).

Esto es el README del repositorio. **Las instrucciones de trabajo están en
[`CLAUDE.md`](./CLAUDE.md)**; la voz, el compliance y la mecánica del embudo viven fuera, en
`~/Developer/Marca-Personal`.

## Arrancar

```bash
npm install
npm run dev          # velite dev + next dev, en paralelo
```

`npm run dev` levanta dos procesos: Velite compilando el contenido y Next sirviendo. Sin el
primero no existe `#site/content` y nada que lea posts, newsletters o emails compila.

Sin variables de entorno el sitio arranca igual: las rutas que hablan con Supabase o Resend
detectan que no están configuradas y responden en modo previsualización en vez de romper.
Los nombres de las variables están en `.env.example`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo (Velite + Next) |
| `npm run build:content` | Compila `content/**` a `.velite/` con `--strict` |
| `npm run build` | `build:content` y luego `next build` |
| `npm run verify` | typecheck + lint + tests — **lo que corre CI** |
| `npm test` | Solo los tests (necesita `.velite/`, así que corre `build:content` antes) |

`build:content` lleva `--strict` a propósito: sin él, Velite registra un error de schema y
sigue con código 0, así que un post con un `tema` inválido desaparecía de los listados, del
sitemap y del RSS sin romper nada.

`npm test` lee `.velite/`. No es un capricho: el test de enlaces de la secuencia de bienvenida
comprueba la salida del compilador, que es donde vivía el fallo que motivó ese test.

## Cómo se publica

Cada push a `main` despliega en Vercel. No hay `vercel deploy` a mano y, si lo hicieras, ojo:
ese comando sube también los ficheros sin trackear.

- **Un artículo**: un `.mdx` en `content/posts/`. Aparece solo en listado, sitemap y RSS.
  `tema` y `formato` son obligatorios y salen de un vocabulario cerrado
  (`src/config/taxonomy.ts`).
- **Una edición del Radar**: la genera un workflow los lunes y abre un PR. El merge lo hace
  una persona; el gate `scripts/radar/verify-edition.mjs` ya ha comprobado que cada titular
  existe en el JSON de candidatos.
- **Una newsletter**: un `.md` en `content/newsletters/` con `draft: true`. Se envía quitando
  el draft y llamando a `/api/newsletter/send`, nunca automáticamente.

## Estructura

```
content/          posts (MDX) · newsletters · emails de la secuencia
src/app/          rutas y route handlers (App Router)
src/components/   UI, widgets MDX, motion
src/config/       SSOT de identidad, taxonomía, biblioteca, curso
src/lib/          dominio: posts, evidencia, email, enlaces firmados, Supabase
supabase/         migraciones (a mano en el SQL editor) y seeds de contenido
scripts/          Radar (recolector + gate) y auditoría GEO
docs/             specs, checklist GEO y archivo
tests/            node:test, sin runner extra
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Velite para el contenido ·
Supabase (EU) para suscriptores y recursos · Resend para la entrega · Vercel.
