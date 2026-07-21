@AGENTS.md

# CLAUDE.md — Blog + Newsletter de marca personal (IA)

> Documento vivo. Se mantiene al cerrar cada fase. Última actualización: **"Radar IA" — noticias semanales automatizadas + auto-post YouTube** (2026-07-21).

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
- **Fase 2 — Newsletter y captación** ✅ (código, con *guards*). Form real + doble opt-in (Resend), route handlers `/api/{subscribe,confirm,unsubscribe,download}`, plantillas React Email, lead magnets (`/recursos` + descarga firmada), baja 1-clic (RFC 8058), `/gracias`, `/baja`, `/privacidad`. Migración aplicada en un proyecto Supabase EU dedicado (`kata-ivanovych-blog`, ref `udluclqhfzdgvqpoezoo`, **cuenta separada del NBI**, eu-central-1). **Doble opt-in verificado en vivo (modo test) 2026-06-24**: alta→confirmación→`confirmed`, token sha256 single-use, `consent_ip` guardada. **DEPLOYADO A PRODUCCIÓN 2026-06-24**: vivo en `https://kata.ianexora.com` (Vercel team corporate `nexoraprocesos-boops-projects`, proyecto `kata-ivanovych-blog`, dominio vía A-record en Namecheap → `76.76.21.21`, SSL OK, público). Env de producción en Vercel: `NEXT_PUBLIC_SITE_URL`=`https://kata.ianexora.com`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. **Seguridad cerrada**: el `service_role` legacy (expuesto en chat) se ROTÓ a una *secret key* nueva (`sb_secret_…`) y la legacy se DESACTIVÓ. **Newsletter LIVE 2026-06-24**: dominio `news.ianexora.com` **verificado** en Resend (DKIM + SPF + MX). El MX requirió pasar Namecheap de "Private Email" a "Custom MX" re-añadiendo los 2 MX de `privateemail.com` (apex, email de empresa intacto) + el MX `send.news`→`feedback-smtp.eu-west-1.amazonses.com`. `RESEND_API_KEY` (key `re_…` nueva, scope sending) + `RESEND_FROM`=`Kata Ivanovych <news@news.ianexora.com>` cargadas en Vercel prod. Flujo de alta probado end-to-end en vivo (POST /api/subscribe → fila `pending` + email de confirmación enviado). **Pendiente menor**: (1) re-añadir en Namecheap los CNAME `autodiscover`/`autoconfig`/`mail`→`privateemail.com` + SRV `_autodiscover._tcp` (los borró el cambio a Custom MX — solo afecta autoconfig de clientes de correo, no a recibir email), (2) Turnstile (anti-spam, vacío), (3) firmar DPAs. Redeploy: `vercel deploy --prod --scope nexoraprocesos-boops-projects`.
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

- **Tema: página clara con SECCIONES OSCURAS deliberadas.** El rediseño "Kata Pro" (2026-06-25) reemplazó la antigua ley NBI "solo claro / nunca oscuro": hero, newsletter y footer son bandas espresso (`--color-dark #15100d`) con *glow* coral pulsante (`.glow-pulse`, congelado bajo `prefers-reduced-motion`). No es modo-oscuro con toggle (sin `.dark` ni `next-themes`): son superficies oscuras dentro de una página cálida. Tokens siguen siendo CSS variables (dark-ready si se quisiera un toggle).
- **Marca = Kata Ivanovych — "Atardecer Coral" → "Kata Pro"** (subdominio de NBI `ianexora.com`): paleta cálida espresso `#15100d` + coral/terracota `#d8442b` (texto = `--color-accent-ink #be3621`, AA) + crema `#f4eee3`; acentos salmón/terracota/oro y chips de categoría. Tipografía **Newsreader** (serif, títulos peso 500) + **Hanken Grotesk** (cuerpo/botones) + **JetBrains Mono** (eyebrows/labels). Valores AA-verificados en `globals.css`. (La paleta NBI navy/cian quedó obsoleta en el rebrand `b044460` y el rediseño Kata Pro.)
- **Content layer = Velite** (Fase 1). Compila MDX en su propio proceso esbuild antes/junto a `next build`, así el pipeline Shiki/rehype-pretty-code corre intacto bajo **Turbopack** (que no puede pasar plugins remark/rehype con funciones a través de la frontera Rust). Frontmatter validado con Zod + tipos TS autogenerados. Contentlayer descartado (abandonado). Nunca `VeliteWebpackPlugin`; wiring vía npm scripts (`run-s`) o hook dynamic-import.
- **Newsletter = lista en Supabase, Resend solo entrega.** Estado de consentimiento (`pending`/`confirmed`/`unsubscribed`) en nuestro Postgres. Transaccional (opt-in/bienvenida) vía `emails.send`; boletín vía loop propio sobre filas `confirmed` con `resend.batch.send` (lotes de 100, ≤5 req/s, idempotente por `issue_id`, breaker por cuota). Esto hace triviales los derechos RGPD y mantiene la PII fuera de la infra US de Resend.
  - **Matiz RGPD crítico:** región `eu-west-1` controla solo desde dónde se *envía*, NO residencia de datos (account data/logs/metadata de Resend viven en US bajo SCC + DPA). **Nunca prometer "100% UE"** — mismo encuadre que el matiz Gemini/OpenRouter.
- **Analítica cookieless** (Umami EU / Plausible EU) → sin banner. Evitar GA4.

## Capa interactiva — "Caja de Cristal" (rediseño)

Concepto: cada post es un artefacto manipulable, no solo texto. Stack añadido: `motion` (animaciones), Radix Popover (glosario accesible), `gpt-tokenizer` (cliente), View Transitions (`experimental.viewTransition`), CSS scroll-driven (barra de progreso).

- **Widgets en MDX**: cada interactivo es una isla `"use client"` registrada en `src/components/mdx/widgets/index.ts` (`widgets`) y pasada por la prop `components` de `MDXContent` en `src/app/blog/[slug]/page.tsx`. **Para añadir uno**: crear el componente en `src/components/mdx/widgets/`, exportarlo en `index.ts`, y usarlo en el `.mdx` (`<TokenizerPlayground/>`, `<Quiz/>`, `<Term id="token">…</Term>`, `<Callout>`, `<GuessReveal>`). Datos pesados precomputados en JSON colocado en `content/posts/<slug>/`.
- **Toolkit** (`src/components/mdx/widgets/`): primitivos — `WidgetFrame` (la "lab card" que envuelve todo), `Param` (range accesible), `Quiz` (explicación por opción, sin "fallar", localStorage), `Term` (glosario `src/lib/glossary.ts`), `Callout`, `GuessReveal`. Widgets — `TokenizerPlayground`, `TemperatureSandbox` (softmax/top-p), `CostCalculator`, `HallucinationQuiz`, `PromptDiff`, `LifeOfAPrompt` (explorable scrollytelling sticky con IntersectionObserver). Todos cliente, datos pre-calculados, 0 coste API.
- **Estado/gamificación**: `src/hooks/use-local-state.ts` (localStorage vía `useSyncExternalStore`, SSR-safe, claves `slug+widgetId`). Persistencia híbrida: localStorage ahora → Supabase Auth cuando haya tracción.
- **Motion/a11y (reglas duras)**: `MotionProvider` (`reducedMotion="user"`) en el layout; bloque global `@media (prefers-reduced-motion: reduce)` en `globals.css`; `useReducedMotion` hook. **Coral solo superficie; texto en coral oscuro** (`--color-accent #d8442b` no pasa AA como texto pequeño → usar `--color-accent-ink #be3621`; sobre espresso, links en salmón). Cada widget: operable por teclado, fallback estático, `not-prose`.
- **Lectura inmersiva**: `ReadingProgress` (CSS scroll-timeline, 0 JS), `Toc` con scroll-spy (IntersectionObserver), `CopyCode` (botón sobre los bloques Shiki), cabecera de post tipo revista (frontmatter `kicker`/`dek` en `velite.config.ts`).
- **Rollout**: Fase A ✅ (fundación + toolkit + Tokenizer + rediseño). Fase B ✅ (4 widgets + explorable insignia + 4 posts interactivos). Pendiente: Fase C (juegos + gamificación localStorage: rachas/logros + loop newsletter), Fase D (cuentas Supabase Auth + repaso espaciado). Catálogo completo en el plan y `tasks/wi7u5i5it.output`.

## Radar IA — noticias automatizadas (2026-07-21)

Serie semanal de noticias (IA/negocio/geopolítica) dentro de `/blog` (tag `radar`), generada
por CI con **checkpoint humano**: nada se publica sin merge de un PR.

- **Pipeline en 3 pasos, anti-alucinación por diseño**: (1) `scripts/radar/collect.mjs` —
  recolector RSS **determinista, sin LLM** (fuentes en `config/radar-sources.json`, 10 feeds,
  ventana 7 días, dedupe, decode de entidades, strip `utm_*`) → `scratch/radar-candidates.json`
  (gitignored); (2) **Claude Code Action** redacta la edición usando SOLO ese JSON
  (plantilla `content/_templates/radar.mdx`, fuera del pattern de Velite); (3)
  `scripts/radar/verify-edition.mjs` — **gate**: cada `<RadarItem>` debe coincidir verbatim
  (url+title+source+axis) con un candidato o el workflow falla y no hay PR.
- **Workflows**: `.github/workflows/radar-semanal.yml` (cron lunes 05:00 UTC + dispatch;
  PR vía `peter-evans/create-pull-request`, rama `radar/<fecha>`, body con los titulares) y
  `youtube-nuevo.yml` (cron 6h; lee RSS del canal, compara contra `youtubeId:` en
  `content/posts/**` — idempotente sin estado —, redacta post `draft: true` por vídeo nuevo).
- **Superficie**: widget `RadarItem` (server component, `src/components/mdx/widgets/radar-item.tsx`);
  franja "Radar IA" en `/blog` (últimas 3 ediciones, `getPostsByTag("radar")`); las ediciones
  se **excluyen del grid principal** para no ahogar los artículos de fondo.
- **Deploy automático VIVO (2026-07-22)**: GitHub conectado al proyecto Vercel
  `kata-ivanovych-blog` — cada push/merge a `main` despliega solo. Para desbloquearlo en plan
  Hobby, el repo se hizo **público** (historial verificado sin secretos; autoría reescrita a
  `Kata Ivanovych <nexoraprocesos@gmail.com>` con filter-branch + force push; backup local en
  rama `backup-pre-rewrite`). Commits futuros: la config local del repo ya firma como Kata Ivanovych.
- **Config pendiente del usuario**: (1) secret `CLAUDE_CODE_OAUTH_TOKEN` — correr
  `claude setup-token` en una Terminal APARTE (es interactivo, `!` no le da TTY) y luego
  `gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo katasavyuk-pixel/blog-newsletter --body "$(pbpaste)"`;
  (2) variable `YOUTUBE_CHANNEL_ID` (sin ella, el workflow de YouTube no corre).
- **Gotcha Vercel (2026-07-21)**: el proyecto con el dominio es `kata-ivanovych-blog`
  (`prj_1Cx7OZXAthH1N64qhhmpDOiVjTM7`). Si `.vercel/project.json` falta, `vercel deploy` CREA
  un proyecto duplicado con el nombre del directorio y despliega al sitio equivocado (pasó 2
  veces; zombis `blog-newsletter`/`blog-newsletter-main` borrados hoy). Verificar el link antes
  de desplegar.
- Primera edición real publicada: `content/posts/radar-2026-07-21.mdx` (redactada a mano
  siguiendo el mismo pipeline, 7/7 ítems verificados por el gate).

## Retención y descubrimiento (2026-07-22, del diseño "Inicio" de Claude Design)

La home ya seguía el layout del diseño `Inicio.dc.html` (proyecto Claude Design
`d90c113d-…`); esta pasada añadió lo que faltaba, traducido a los tokens rojo/negro:

- **"Noticias de la semana"** en home: `src/lib/radar.ts` parsea los `<RadarItem>` de la
  última edición radar (fs, build-time) → cards en `src/components/home/news-today.tsx`.
- **Curso dinámico** `/empieza-aqui`: itinerario de los 6 posts interactivos en orden
  pedagógico (`src/config/course.ts` = SSOT de slugs), progreso en localStorage
  (`CourseList` + `CourseProgressMarker` montado en la página del post vía `COURSE_SLUGS`).
- **"Sigue leyendo"**: `getRelatedPosts()` en `src/lib/posts.ts` (por tags compartidos,
  excluye radar) + `RelatedPosts` al final de cada post.
- **Franja YouTube autoactivable** en home (`youtube-strip.tsx`): posts publicados con
  `youtubeId`; render null hasta que exista el primero. Miniaturas `i.ytimg.com`
  whitelisted en `next.config.ts`.
- Nav ampliada: Noticias (`/blog/tag/radar`) · Blog · Curso (`/empieza-aqui`) · Recursos · Sobre mí.
- **Regla al implementar diseños del proyecto Claude Design**: los mocks traen datos fake
  ("12.400+ suscriptores", "Soy Álex") — SIEMPRE sustituir por datos reales/honestos, y
  traducir hex → tokens.

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
