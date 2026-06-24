@AGENTS.md

# CLAUDE.md — Blog + Newsletter de marca personal (IA)

> Documento vivo. Se mantiene al cerrar cada fase. Última actualización: **Fase 2** (2026-06-24).

## Qué es esto

Plataforma de **marca personal sobre IA**: blog + newsletter para construir comunidad
con contenido valioso (artículos, formación, recursos gratuitos). Objetivo near-term:
**captar suscriptores**. Medio plazo: **tier premium** (Fase 3, no construido aún).

Embudo central: **recurso gratuito → captura de email (doble opt-in) → newsletter → (futuro) premium.**

La arquitectura y el modelo de datos están **diseñados para premium desde el día 1**,
pero la parte de pago/auth **no se construye** hasta la Fase 3.

## Estado por fases

- **Fase 0 — Fundamentos y diseño** ✅ (esta). Scaffolding, design system NBI, layout, componentes base, home placeholder, clients Supabase, este archivo.
- **Fase 1 — Blog (MVP)** ✅. Pipeline MDX (Velite), listados, página de post (TOC, share, syntax highlighting), tags, "Sobre mí", SEO (OG dinámico `next/og`, sitemap, RSS, JSON-LD BlogPosting). `post_views` (BD) NO implementado — diferido. Publicar = añadir `.mdx` → aparece en listado/sitemap/RSS automáticamente.
- **Fase 2 — Newsletter y captación** ✅ (código, con *guards*). Form real + doble opt-in (Resend), route handlers `/api/{subscribe,confirm,unsubscribe,download}`, plantillas React Email, lead magnets (`/recursos` + descarga firmada), baja 1-clic (RFC 8058), `/gracias`, `/baja`, `/privacidad`. Migración aplicada en un proyecto Supabase EU dedicado (`kata-ivanovych-blog`, ref `udluclqhfzdgvqpoezoo`, **cuenta separada del NBI**, eu-central-1). **Doble opt-in verificado en vivo (modo test) 2026-06-24**: alta→confirmación→`confirmed`, token sha256 single-use, `consent_ip` guardada. **Pendiente para producción**: dominio real (Resend en modo test solo envía al email de la cuenta), `NEXT_PUBLIC_SITE_URL` real, deploy a Vercel con env, Turnstile, firmar DPAs, y **rotar `service_role`** (apareció en chat al configurarlo).
- **Fase 3 — Comunidad y premium** ⬜ (no construir aún). Supabase Auth, Stripe, gating `premium`, dashboard. Tablas `profiles`, `subscriptions`.
- **Fase 4 (idea, §8)** 💡. Búsqueda semántica "pregúntale a mi contenido" (embeddings + pgvector). No implementar; ver al final.

## Stack (pins, jun-2026)

| Capa | Elección | Pin |
|---|---|---|
| Framework | Next.js App Router | `next@16.2.x` (Turbopack default, Node ≥20) |
| Runtime | React | `react@19.x` / `react-dom@19.x` |
| Estilos | Tailwind CSS v4 (CSS-first) | `tailwindcss@4` + `@tailwindcss/postcss@4` + `@tailwindcss/typography@0.5` |
| Tipografía | Space Grotesk (display/UI) + Inter (cuerpo) | `next/font/google` |
| DB / clients | Supabase | `@supabase/ssr@0.12` + `@supabase/supabase-js@2.108`; región `eu-central-1` |
| Content layer (Fase 1) | Velite | `velite@0.3.x` (no `1.0.0-alpha`) + rehype-pretty-code `0.14` + shiki `^1` |
| Email (Fase 2) | Resend + React Email | `resend@6.14` + `react-email@6.6`; región `eu-west-1` |
| Pagos (Fase 3) | Stripe | — |
| Analítica | Umami self-host (EU) o Plausible Cloud (EU), cookieless | — |

## Convenciones

- **Código y comentarios en inglés; contenido de cara al usuario en español (`locale: es`).**
- **Identidad textual centralizada** en `src/config/site.ts` — único sitio para nombre, dominio, tagline, bio, redes. i18n-ready (sin texto hardcodeado en componentes).
- **Sin colores/tamaños hex en JSX.** Todo vía design tokens (`@theme` en `globals.css`): `bg-bg`, `text-fg`, `text-muted`, `text-accent-ink`, `bg-accent`, `border-border`. Referenciar tokens con `var(--color-*)` en valores arbitrarios está permitido; literales hex no.
- **`service_role` solo servidor**, runtime Node, jamás `NEXT_PUBLIC` ni en el cliente.
- **Gating server-side** (`draft`, `premium`): autorización en el route + `generateStaticParams` + RSS/sitemap; nunca ocultación client-side.
- **Verificar verde antes de commitear** (`build`/`lint`/tipos). Commits pequeños en español, `git add` específico (no `git add .`).
- **Secretos** en Doppler (dev) / `vercel env` (prod). Nunca en código/chat/logs.
- **Next 16 ≠ el Next que conoces** (ver `@AGENTS.md`): consulta `node_modules/next/dist/docs/` antes de escribir código de framework.

## Estructura

```
content/posts/                 # MDX (Fase 1)
src/
  app/{layout,page}.tsx, globals.css
  components/{ui,layout,newsletter}/
  config/site.ts               # identidad textual (§1)
  lib/
    utils.ts                   # cn()
    supabase/{client,server,middleware}.ts
middleware.ts                  # refresh de sesión (con guard si faltan env)
supabase/{schemas,migrations}/ # esquema declarativo (diseño día 1, build por fases)
next.config.ts · .env.example
```

## Decisiones de arquitectura

- **Tema: SOLO claro (ley de marca NBI — nunca oscuro).** Desviación deliberada del brief (que pedía dark mode). Tokens definidos como CSS variables → arquitectura *dark-ready*: añadir un bloque `.dark` + `@custom-variant dark` sería trivial. No se instaló `next-themes` en Fase 0.
- **Marca = NBI** (ianexora): fondo claro, navy `#16203a`, cian `#00d4ff` (cian-texto legible `#0a7187`), gradiente navy→cyan de acento, Space Grotesk. Valores AA-verificados en `globals.css`.
- **Content layer = Velite** (Fase 1). Compila MDX en su propio proceso esbuild antes/junto a `next build`, así el pipeline Shiki/rehype-pretty-code corre intacto bajo **Turbopack** (que no puede pasar plugins remark/rehype con funciones a través de la frontera Rust). Frontmatter validado con Zod + tipos TS autogenerados. Contentlayer descartado (abandonado). Nunca `VeliteWebpackPlugin`; wiring vía npm scripts (`run-s`) o hook dynamic-import.
- **Newsletter = lista en Supabase, Resend solo entrega.** Estado de consentimiento (`pending`/`confirmed`/`unsubscribed`) en nuestro Postgres. Transaccional (opt-in/bienvenida) vía `emails.send`; boletín vía loop propio sobre filas `confirmed` con `resend.batch.send` (lotes de 100, ≤5 req/s, idempotente por `issue_id`, breaker por cuota). Esto hace triviales los derechos RGPD y mantiene la PII fuera de la infra US de Resend.
  - **Matiz RGPD crítico:** región `eu-west-1` controla solo desde dónde se *envía*, NO residencia de datos (account data/logs/metadata de Resend viven en US bajo SCC + DPA). **Nunca prometer "100% UE"** — mismo encuadre que el matiz Gemini/OpenRouter.
- **Analítica cookieless** (Umami EU / Plausible EU) → sin banner. Evitar GA4.

## Modelo de datos (diseñado día 1, construido por fases)

`RLS ON` en todas. Default-deny; escrituras vía servidor (`service_role`) o RPC
`SECURITY DEFINER` (`SET search_path=''`, esquema no expuesto, `REVOKE EXECUTE
FROM PUBLIC` + `GRANT` explícito, verificar con `has_function_privilege`).

**`subscribers`** (Fase 2) — `id uuid pk`, `email citext unique`, `status enum(pending|confirmed|unsubscribed)`, `confirm_token_hash` (solo `sha256`; el token claro solo viaja en el email), `confirm_expires_at`, `confirmed_at`, `unsubscribe_token unique`, `unsubscribed_at`, `consent_ip`, `source` (p.ej. `footer`, `lead_magnet:guia-rag`, `popup`), `locale default 'es'`, `created_at`.
RLS: **sin** policies anon/authenticated. Alta vía Route Handler con `service_role` + verificación Turnstile + rate-limit. Token CSPRNG, single-use, compare en tiempo constante. Respuesta 200 genérica (anti-enumeración).

**`resources`** (Fase 2) — `id uuid pk`, `slug unique`, `title`, `description`, `file_path` (Storage), `requires_email bool default true`, `download_count int default 0`, `published bool default false`, `created_at`.
RLS: `SELECT USING (published = true)` para anon/authenticated. `download_count` vía RPC `increment_download_count`. Descarga: bucket **privado** + `createSignedUrl(path, 300, {download})` tras verificar email confirmado; policies de `storage.objects` con filtro `bucket_id`.

**`post_views`** (Fase 1, opcional) — `slug text`, `views int`, `updated_at`. Los posts viven en MDX, no en BD. Sin escritura cliente; RPC `increment_post_view` con dedupe por IP/cookie.

**`profiles`** (Fase 3) — `id uuid pk` (= `auth.users.id`), `email`, `full_name`, `role enum(free|premium)`, `stripe_customer_id`.
RLS: dueño `SELECT`/`UPDATE` `USING ((select auth.uid()) = id)`.

**`subscriptions`** (Fase 3) — `id uuid pk`, `user_id`, `stripe_subscription_id`, `status`, `plan`, `current_period_end`.
RLS: **sin escritura cliente** — solo `service_role` (webhook Stripe). Dueño `SELECT` opcional de su propio plan.

> **Forward-compat:** el suscriptor de newsletter está **desacoplado** de los usuarios auth (`subscribers` ≠ `profiles`). Añadir cuentas de pago en Fase 3 no refactoriza la lista. El flag `premium` en el frontmatter MDX y las tablas `profiles`/`subscriptions` son las únicas costuras necesarias.

## RGPD / AEPD (checklist viva)

- Base legal = consentimiento (art. 6.1.a). **Doble opt-in** como prueba (guardar `confirmed_at` + `consent_ip` + `source`).
- Consentimiento explícito en el form: checkbox separado, no pre-marcado (Planet49). Turnstile + rate-limit en el endpoint público.
- Región EU: Supabase `eu-central-1`, Resend envío `eu-west-1`, analítica EU/self-host.
- Baja 1-clic (RFC 8058 `List-Unsubscribe` + `List-Unsubscribe-Post`): POST da de baja directo (200/202, sin login).
- Política de privacidad nombra subencargados (Supabase, Resend, Vercel; Stripe en Fase 3) y la transferencia US bajo SCC + DPA. **No** afirmar "100% UE".
- Minimización: solo email (+ nombre opcional). Borrado = hard-delete; re-suscripción = upsert/reactivación, no duplicado.

## Plan de implementación — Fase 3 (premium) [no construir aún]

1. **Auth:** Supabase Auth (email/OAuth). Trigger en `auth.users` → fila `profiles` (`role='free'`).
2. **Stripe:** Checkout + Customer Portal + webhook (Route Handler, runtime Node, `service_role`) que escribe `subscriptions` y promueve `profiles.role='premium'`.
3. **Gating:** posts/recursos con `premium: true` visibles solo para `role='premium'` — autorización **server-side** en route + `generateStaticParams` + RSS/sitemap.
4. **Dashboard** básico de miembro (estado de suscripción, gestionar pago vía Portal).

## Fase 4 (idea futura, §8) [no implementar]

Búsqueda semántica / "pregúntale a mi contenido": embeddings de los posts + `pgvector` en Supabase + recuperación (RAG). Refuerza la marca (una marca de IA cuyo propio sitio usa IA). Anotado como posible diferenciador, no en roadmap activo.

## Pitfalls a recordar (de la investigación, ver `tasks/w2wo9hqiz.output`)

Turbopack ignora plugins MDX con funciones → Velite · Tailwind v4: `darkMode:'class'` se ignora (usar `@custom-variant`) · `REVOKE` no-op si PUBLIC retiene grant · token en claro = enumeración · `premium`/`draft` solo en listados = fuga por URL · JSON-LD sin escapar `<` = XSS · OG con `ImageResponse` de `next/og` · `next.config` con plugins ESM-only.
