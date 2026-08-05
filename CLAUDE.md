@AGENTS.md

# CLAUDE.md — Blog + Newsletter de marca personal (IA)

> Documento vivo. Se mantiene al cerrar cada fase. Última actualización: **Embudo de captación —
> `/recursos` con imán, secuencia de bienvenida 0/48/96h, CTA inline, GEO parcial y panel**
> (2026-08-05, segunda sesión del día).

## Antes de escribir contenido

Voz, qué se puede decir (restricciones legales con caducidad) y la mecánica del embudo viven en
`~/Developer/Marca-Personal` — **carga la skill `marca-kata`**. No las copies aquí: este archivo
y el del canal describían cada uno su versión de la misma marca y llevaban semanas divergiendo.
Aquí solo va la implementación: rutas, tablas, componentes, deploy.

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
- **Fase 2 — Newsletter y captación** ✅ **en producción y verificada end-to-end.** Doble opt-in,
  route handlers `/api/{subscribe,confirm,unsubscribe,download,contact}`, React Email, lead
  magnets con descarga firmada, baja 1-clic (RFC 8058), `/gracias` · `/baja` · `/privacidad`.
  Infra (no volver a averiguarla):
  - **Supabase** proyecto EU dedicado `kata-ivanovych-blog`, ref `udluclqhfzdgvqpoezoo`,
    `eu-central-1`, **cuenta separada de la de NBI** (sin MCP/CLI desde esta máquina — el MCP de
    Supabase solo ve `Maître-prod` y `NbiOps`, así que **desde aquí no se puede verificar el
    esquema**: hay que fiarse de lo que diga Kata). Migraciones `0001`-`0005` aplicadas. El
    `service_role` legacy se **rotó** a `sb_secret_…` y la legacy quedó desactivada.
  - **Vercel** team `nexoraprocesos-boops-projects`, proyecto `kata-ivanovych-blog`. Dominio por
    A-record en Namecheap → `76.76.21.21`. Redeploy manual:
    `vercel deploy --prod --scope nexoraprocesos-boops-projects` (normalmente no hace falta: cada
    push a `main` despliega).
  - **Resend**: `news.ianexora.com` verificado (DKIM+SPF+MX). El MX obligó a pasar Namecheap de
    "Private Email" a "Custom MX" reañadiendo los 2 MX de `privateemail.com` + el de
    `send.news`. `RESEND_FROM` = `Kata Ivanovych <news@news.ianexora.com>`.
  - **Pendientes menores**: los CNAME `autodiscover`/`autoconfig`/`mail` y el SRV
    `_autodiscover._tcp` que borró el cambio a Custom MX (solo afecta al autoconfig de clientes de
    correo, no a recibir); **Turnstile sin configurar**; **DPAs sin firmar**; la
    `publishable key` de Supabase en Vercel es inválida (inocuo hoy porque todo va server-side —
    y `src/lib/resources.ts` ya lee con `createAdminClient()` justo por esto).
  - **Envs de Vercel (producción)**: `DOWNLOAD_LINK_SECRET` ✅ · `RESEND_REPLY_TO` ✅ ·
    `NEWSLETTER_SEND_SECRET` y `ADMIN_PANEL_SECRET` **las crea Kata a mano**, porque las usa desde
    un terminal y Vercel guarda como *Sensitive* lo que crea el agente (no se puede volver a leer).
    Ojo: **`.env.example` no es legible desde este sandbox** (Read y `grep` denegados), así que la
    lista de envs vive aquí, no solo ahí.
- **Fase 3 — Comunidad y premium** ⬜ (no construir aún). Supabase Auth, Stripe, gating `premium`, dashboard. Tablas `profiles`, `subscriptions`.
- **Fase 4 (idea, §8)** 💡. Búsqueda semántica "pregúntale a mi contenido" (embeddings + pgvector). No implementar; ver al final.

## Stack (pins, jun-2026)

| Capa | Elección | Pin |
|---|---|---|
| Framework | Next.js App Router | `next@16.2.x` (Turbopack default, Node ≥20) |
| Runtime | React | `react@19.x` / `react-dom@19.x` |
| Estilos | Tailwind CSS v4 (CSS-first) | `tailwindcss@4` + `@tailwindcss/postcss@4` + `@tailwindcss/typography@0.5` |
| Tipografía | Inter (cuerpo/UI/titulares) + Anton (display punch); mono = stack del sistema | `next/font/google` |
| DB / clients | Supabase | `@supabase/ssr@0.12` + `@supabase/supabase-js@2.108`; región `eu-central-1` |
| Content layer (Fase 1) | Velite | `velite@0.3.x` (no `1.0.0-alpha`) + rehype-pretty-code `0.14` + shiki `^1` |
| Email (Fase 2) | Resend + React Email | `resend@6.14` + `react-email@6.6`; región `eu-west-1` |
| Pagos (Fase 3) | Stripe | — |
| Analítica | Vercel Web Analytics (cookieless, sin PII, sin cookies) — decidido 2026-07-22 | `@vercel/analytics@2` |

## Convenciones

- **Código y comentarios en inglés; contenido de cara al usuario en español (`locale: es`).**
- **Identidad textual centralizada** en `src/config/site.ts` — único sitio para nombre, dominio, tagline, bio, redes. i18n-ready (sin texto hardcodeado en componentes).
- **Sin colores/tamaños hex en JSX.** Todo vía design tokens (`@theme` en `globals.css`): `bg-bg`, `text-fg`, `text-muted`, `text-accent-ink`, `bg-accent`, `border-border`. Referenciar tokens con `var(--color-*)` en valores arbitrarios está permitido; literales hex no.
- **`service_role` solo servidor**, runtime Node, jamás `NEXT_PUBLIC` ni en el cliente.
- **Gating server-side** (`draft`, `premium`): autorización en el route + `generateStaticParams` + RSS/sitemap; nunca ocultación client-side.
- **Taxonomía cerrada**: todo post lleva `tema` y `formato` del vocabulario de `src/config/taxonomy.ts`. Los `tags` libres son keywords secundarias y no generan navegación. Ampliar el vocabulario es una decisión editorial, no un typo.
- **Las afirmaciones de credibilidad son `Evidencia`, no strings** (`src/lib/evidence.ts`). Si una tarjeta o un post afirma algo comprobable, va con su url/ruta/fuente o con ETA. Los invariantes rompen la build a propósito.
- **Verificar verde antes de commitear** (`build`/`lint`/tipos). Commits pequeños; **el historial real está en inglés** (esta línea decía "en español" y llevaba semanas contradiciendo al `git log`).
- **`git add` fichero a fichero.** No basta con evitar `git add .`: **añadir un directorio** (`git add src/app`) arrastra igual el trabajo sin commitear de Kata. Pasó dos veces el 2026-08-05.
- **Secretos** en Doppler (dev) / `vercel env` (prod). Nunca en código/chat/logs.
- **Next 16 ≠ el Next que conoces** (ver `@AGENTS.md`): consulta `node_modules/next/dist/docs/` antes de escribir código de framework.

## Estructura

```
content/posts/                 # MDX (Fase 1)
content/newsletters/*.md       # ediciones del boletín (draft: true por defecto)
content/emails/*.md            # copy de la secuencia de bienvenida — editable sin tocar TS
content/_templates/radar.mdx   # plantilla de edición del Radar (fuera del pattern de Velite)
src/
  app/{layout,page}.tsx, globals.css
  app/{blog,radar,sistemas,empieza-aqui,glosario,recursos,sobre-mi,trabaja-con-nbi,panel}/
  api/{subscribe,confirm,unsubscribe,download,contact}/
  api/{newsletter/send,welcome-sequence/test,panel/login}/
  components/{ui,layout,home,blog,content,library,course,mdx,newsletter,contact,effects,motion}/
  config/{site,taxonomy,library,course,cierre,cta-inline}.ts   # SSOT
  lib/
    evidence.ts                # tipo Evidencia + invariantes de build
    cost-model.ts              # aritmética de la calculadora, SIN "use client" (la usan email y API)
    lead-magnets.ts · signed-links.ts       # captura+RGPD · HMAC de descarga
    email-template.ts · email-blocks.ts     # placeholders {{…}} (lanzan) · bloques HTML del email
    jsonld.ts · funnel.ts · panel-auth.ts
    utils.ts · posts.ts · radar.ts · format.ts · subscribers.ts · glossary.ts
    newsletter.tsx · welcome-sequence.tsx   # .tsx: llevan JSX de React Email
    supabase/{client,server,admin,middleware}.ts
scripts/radar/{collect,verify-edition,youtube}.mjs
scripts/geo/audit-ssr.mjs      # ¿el texto sustantivo está en el HTML servido?
middleware.ts                  # refresh de sesión (con guard si faltan env)
supabase/migrations/           # 0001-0005, aplicadas a mano en el SQL editor
supabase/seeds/resources.sql   # altas de recursos (contenido, no migración)
docs/geo-checklist.md
next.config.ts · velite.config.ts · eslint.config.mjs · .env.example
```

## Decisiones de arquitectura

- **Tema: página OSCURA entera** (`--color-bg #0b0608`, negro cálido). Corregido 2026-07-29: este punto decía *"página clara con secciones oscuras"*, que describía el "Kata Pro" de junio y quedó invertido con el rebrand a la paleta cine. No es modo-oscuro con toggle (sin `.dark` ni `next-themes`) — es la única identidad. Las bandas de sección usan `--color-dark #0d0709`, un pelo más profundo que el fondo.
- **Marca = Kata Ivanovych — paleta CINE, la misma que el vídeo** (subdominio de NBI `ianexora.com`). Desde 2026-07-29 los tokens derivan de `YT_claude/05_remotion/src/cine/brandCine.ts`: fondo `#0b0608`, texto `#f6efec`, `--color-accent #e11423` **solo como superficie** (4.14:1, nunca texto pequeño) y `--color-accent-ink #ff3b4e` para texto rojo (5.74:1, AA). Tipografía real del código: **Inter** (cuerpo/UI/titulares, `--font-body`/`--font-display`) + **Anton** (display punch, `--font-punch`) + mono del sistema. Valores AA-verificados en `globals.css`. Reparto por superficie y el porqué: `~/Developer/Marca-Personal/IDENTIDAD.md`. (Obsoletas: la NBI navy/cian del rebrand `b044460`, el "Atardecer Coral" y el espresso/coral de "Kata Pro".)
- **Content layer = Velite** (Fase 1). Compila MDX en su propio proceso esbuild antes/junto a `next build`, así el pipeline Shiki/rehype-pretty-code corre intacto bajo **Turbopack** (que no puede pasar plugins remark/rehype con funciones a través de la frontera Rust). Frontmatter validado con Zod + tipos TS autogenerados. Contentlayer descartado (abandonado). Nunca `VeliteWebpackPlugin`; wiring vía npm scripts (`run-s`) o hook dynamic-import.
- **Newsletter = lista en Supabase, Resend solo entrega.** Estado de consentimiento (`pending`/`confirmed`/`unsubscribed`) en nuestro Postgres. Transaccional (opt-in/bienvenida) vía `emails.send`; boletín vía loop propio sobre filas `confirmed` con `resend.batch.send` (lotes de 100, ≤5 req/s, idempotente por `issue_id`, breaker por cuota). Esto hace triviales los derechos RGPD y mantiene la PII fuera de la infra US de Resend.
  - **Matiz RGPD crítico:** región `eu-west-1` controla solo desde dónde se *envía*, NO residencia de datos (account data/logs/metadata de Resend viven en US bajo SCC + DPA). **Nunca prometer "100% UE"** — mismo encuadre que el matiz Gemini/OpenRouter.
- **Analítica cookieless = Vercel Web Analytics** (decidido 2026-07-22; antes se barajaba Umami/Plausible): sin cookies ni PII → sin banner; Vercel ya era subencargado (0 DPAs nuevos). Evitar GA4. Conversión del embudo = pageviews × `subscribers.source`.

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
  `scripts/radar/verify-edition.mjs` — **gate**: cada `<RadarItem>` debe coincidir con un
  candidato o el workflow falla y no hay PR. La **url se compara verbatim** (es la clave de
  identidad); título/fuente/eje se comparan **normalizando tipografía** (`canonical()`: NFC +
  comillas curvas, guiones, elipsis y espacios exóticos → ASCII).
  **Por qué (2026-08-05)**: con `!==` estricto el modelo reescribía `’` como `'` al retipear el
  titular y el gate lo marcaba como alucinación — **se perdieron las ediciones del 27-jul y del
  3-ago** mientras la home seguía anunciando cadencia semanal. Al tocar esto, verificar los tres
  negativos: título reescrito, url inventada y fuente cambiada deben seguir saliendo con exit 1.
- **Workflows**: `.github/workflows/radar-semanal.yml` (cron lunes 05:00 UTC + dispatch;
  PR vía `peter-evans/create-pull-request`, rama `radar/<fecha>`, body con los titulares) y
  `youtube-nuevo.yml` (cron 6h; lee RSS del canal, compara contra `youtubeId:` en
  `content/posts/**` — idempotente sin estado —, redacta post `draft: true` por vídeo nuevo).
- **Superficie**: widget `RadarItem` (server component, `src/components/mdx/widgets/radar-item.tsx`);
  sección propia `/radar`; `CadenceStrip` en la home con cadencia derivada. Las ediciones
  aparecen en el archivo de `/blog` identificadas por su columna `formato`, ya no necesitan
  franja aparte.
- **El frontmatter de cada edición lleva `tema: contenido` y `formato: radar`** — están en la
  plantilla y en el prompt del workflow. Sin ellos la build falla (velite `--strict`).
- **Deploy automático VIVO (2026-07-22)**: GitHub conectado al proyecto Vercel
  `kata-ivanovych-blog` — cada push/merge a `main` despliega solo. Para desbloquearlo en plan
  Hobby, el repo se hizo **público** (historial verificado sin secretos; autoría reescrita a
  `Kata Ivanovych <nexoraprocesos@gmail.com>` con filter-branch + force push; backup local en
  rama `backup-pre-rewrite`). Commits futuros: la config local del repo ya firma como Kata Ivanovych.
- **Permiso del repo (resuelto 2026-08-05)**: `can_approve_pull_request_reviews` estaba en
  `false`, así que aunque el workflow declara `pull-requests: write` **Actions no podía abrir el
  PR** y el job moría después de generar y verificar la edición. Era un segundo bug independiente
  del gate. Se activó con
  `gh api -X PUT repos/.../actions/permissions/workflow -F can_approve_pull_request_reviews=true`.
  El checkpoint humano no se toca: el merge lo sigue haciendo Kata.
- `CLAUDE_CODE_OAUTH_TOKEN` y `YOUTUBE_CHANNEL_ID` ya están resueltos (el segundo vive dentro de
  `scripts/radar/youtube.mjs`, no es variable de Vercel — la web no lo lee).
- **Gotcha Vercel (2026-07-21)**: el proyecto con el dominio es `kata-ivanovych-blog`
  (`prj_1Cx7OZXAthH1N64qhhmpDOiVjTM7`). Si `.vercel/project.json` falta, `vercel deploy` CREA
  un proyecto duplicado con el nombre del directorio y despliega al sitio equivocado (pasó 2
  veces; zombis `blog-newsletter`/`blog-newsletter-main` borrados hoy). Verificar el link antes
  de desplegar.
- Primera edición real publicada: `content/posts/radar-2026-07-21.mdx` (redactada a mano
  siguiendo el mismo pipeline, 7/7 ítems verificados por el gate).

## Retención y descubrimiento — lo que sigue vivo

- **Curso** `/empieza-aqui`: itinerario de los 6 posts interactivos en orden pedagógico
  (`src/config/course.ts` = SSOT de slugs), progreso en localStorage (`CourseList` +
  `CourseProgressMarker` montado en la página del post vía `COURSE_SLUGS`).
- **`getRelatedPosts()`** (`src/lib/posts.ts`, por tags compartidos, excluye radar) →
  `RelatedPosts`, ahora dentro de `ArticleClosing`.
- **`src/lib/radar.ts`** parsea los `<RadarItem>` de la última edición (fs, build-time).
- **Franja YouTube autoactivable** (`youtube-strip.tsx`): render null hasta que exista un post
  publicado con `youtubeId`. Miniaturas `i.ytimg.com` whitelisted en `next.config.ts`.
- OJO: `ViewTransition` de React NO está en react 19.2.4 estable (solo canary) — no intentar
  `unstable_ViewTransition`; la flag `experimental.viewTransition` está activa pero sin el
  componente no anima la navegación cliente.
- **Regla al implementar mocks del proyecto Claude Design**: traen datos fake ("12.400+
  suscriptores", "Soy Álex") — SIEMPRE sustituir por datos reales y traducir hex → tokens.

## Rediseños retirados (registro)

- **"El Universo"** (2026-07-23, retirado 2026-07-26): mapa estelar navegable + copiloto NOVA.
  Feedback de Kata: "no parecía blog profesional". `src/components/{universe,nova}/` y los tokens
  "Cosmic layer" se eliminaron por completo. Spec:
  `docs/superpowers/specs/2026-07-23-rediseno-universo-design.md`.
- **Gotchas que sobrevivieron a su retirada**: `setPointerCapture` en pointerdown se traga los
  clicks de los hijos; rAF no dispara en pestañas ocultas; el lint prohíbe `ref.current=` en
  render y `setState` directo en effects (usar `useSyncExternalStore`).

## Rediseño editorial (2026-08-05) — VIGENTE

Cuarto rediseño, pedido por Kata **pese al congelado de 60-90 días** del diagnóstico del 26-jul.
A diferencia de los tres anteriores (que fueron cambios de concepto y por eso se cayeron), este
deriva de reglas editoriales y de datos: la identidad visual (negro cálido + rojo, Anton + Inter)
no se tocó. Plan completo en `~/.claude/plans/quiero-que-act-es-como-mighty-sparrow.md`.

**Posicionamiento: sin cambios** (validado ya por tres rediseños) — "construyo NBI en público;
sistemas replicables probados en un negocio real"; lector nº1 = emprendedor en marcha; NBI jamás
se vende en la home (solo downstream, email día 8); filtro de identidad en el copy.

**Copy / compliance**: "una empresa de IA" → **"mi negocio de soluciones de IA"** en `site.ts`,
masthead y manifesto. `QUE_PUEDO_DECIR.md` prohíbe atribuirse personalidad jurídica hasta que se
resuelva la capitalización — **revisar este copy cuando se resuelva**.

**Nav (6 + CTA)**: `/sistemas` entró (no estaba ni en nav ni en footer, siendo el escaparate del
posicionamiento); `Blog` se etiqueta `Artículos` con la ruta `/blog` intacta.
**Orden actual, reordenado el 2026-08-05 (segunda sesión)**:
`Curso · Recursos · Artículos · Sistemas · Radar · Sobre mí`. Curso primero por ser el activo
diferencial; Recursos sube al 2º ahora que sirve algo (antes iba 5º apuntando a un estado vacío);
Sistemas baja al 4º mientras 2 de sus 5 items sigan `en-taller`. **Radar se queda en la nav**: se
consideró bajarlo al footer y se descartó — es lo único del sitio que demostrablemente funciona solo,
y `getRadarCadence()` ya degrada la promesa si se para.

**Ruta nueva `/radar`** (qué es la serie + cómo se verifica + ediciones). `/blog/tag/radar` → 308
→ `/radar`; ese tag sale del sitemap para no listar redirects. Las ediciones conservan
`/blog/<slug>`.

**Taxonomía cerrada** (`src/config/taxonomy.ts`): `tema` (`ia-aplicada` · `captacion` ·
`contenido` · `operaciones` · `economia`) + `formato` (`sistema` · `radar` · `nota` · `leccion` ·
`herramienta` · `caso`), **ambos obligatorios** en frontmatter y validados con Zod en
`velite.config.ts`. Los `tags` libres sobreviven como keywords secundarias y **no generan
navegación**. Los 11 MDX ya llevan backfill. `RADAR_AXES` también vive aquí (estaba duplicado).

**Evidencia** (`src/lib/evidence.ts`) — el núcleo: los badges de credibilidad son un tipo, no un
string. `en-produccion | reproducible | medido | experiencia | en-taller`, con invariantes que
**rompen la build**: ETA obligatoria y no vencida, cifra sin fuente, `en-produccion` sin url, e
item cuyo `slug` sea draft (antes devolvía `null` y la tarjeta desaparecía en silencio).
`status` se **deriva** de la evidencia (`libraryStatus()`), ya no se declara al lado y por tanto
no puede contradecirla. ETAs vigentes: Stack GEO `2026-09`, máquina de bienvenida `2026-10`.

**Cadencia auto-degradante** (`getRadarCadence()`): si la última edición pasa de 10 días, la home
sustituye sola "Cada lunes · en automático" por "Última edición: <fecha>". El sitio no puede
mentir sobre su cadencia aunque el CI falle.

**Tipografía — la causa real del "no parece premium"**: `--font-display` y `--font-body` resolvían
**los dos a Inter**, así que no había ningún contraste tipográfico. Clase `.headline` (Anton) en
21 titulares grandes. Reglas duras: sentence case (nunca mayúsculas — se comen las tildes),
`letter-spacing .01em`, `line-height 1.02`, **nunca bajo ~28px ni en cuerpo**. Los h2 de
subsección a `text-2xl` se quedan en Inter a propósito.

**Home (8 secciones, 2 forms y ambos bajo el fold; antes 3, uno sobre el fold)**: `Masthead` (sin
formulario, dos enlaces de entrada) → `StartHere` (3 rutas derivadas de contenido real) →
`LibraryShowcase` → `CadenceStrip` → `HomeArchive` (lista densa) → `YouTubeStrip` → `ClosingCta`
→ `Manifesto` (al final, y sin el monograma "KI" de `BrandVisual`). `hero.tsx` eliminado.

**Artículo**: cabecera y cuerpo comparten columna del grid — antes eran contenedores distintos
(`max-w-3xl` centrado sobre un grid `max-w-5xl`) y el `h1` no compartía eje óptico con su texto.
Medida 70ch (el español corre 15-20% más largo que el inglés). Rail sticky = TOC + compartir.
Los 4 bloques apilados del final → `ArticleClosing`, **una sola** llamada elegida por `formato`.
TOC desde >1 heading. `updated` visible vía `PostMeta` (ningún post lo usa todavía).

**Primitivos compartidos** (`src/components/content/`): `PostMeta`, `TagPill`, `ContentRow` +
`ArchiveList`. Antes había **11 implementaciones de card**, el string canónico copiado a mano en
8 ficheros, 3 hovers distintos y 3 píldoras de tag no intercambiables.

**Lo que sigue vigente de "Biblioteca de Sistemas" (2026-07-22)**: patrón biblioteca-como-página /
home-como-argumento; `/sistemas` por temas; `JourneyPanel` (consola `kata --status` con datos de
build); `LibraryCard` con bento asimétrico, ordinales cromados y halo en la destacada;
`ClosingCta` carmesí; `ParticleField` + grano + viñeta; `getConfirmedSubscriberCount()` y
`revalidate = 3600`. Spec: `docs/superpowers/specs/2026-07-22-rediseno-biblioteca-sistemas-design.md`.

## Máquina de captación (2026-08-05, segunda sesión) — VIGENTE

Cinco fases en producción. **No es un rediseño**: no se tocó ni un token visual. Cerró las tres
fugas del diagnóstico del 26-jul (`/recursos` vacía recibiendo tráfico, sin entrega inmediata al
confirmar, sin CTA en el cuerpo de los artículos) y de paso cuatro bugs que llevaban vivos semanas.

- **`/recursos`** ya no es un estado vacío: calculadora con captura + el PDF "25 datos" + "En el
  taller" **derivado de `LIBRARY_ITEMS`** (no escrito a mano, así no puede contradecir a `/sistemas`
  ni caducar en silencio — `assertEvidencia` rompe la build). Lee `?need_email` y explica el rebote.
- **La calculadora se usa entera sin registrarse.** No negociable: el sitio promete "sin registro" y
  el argumento del blog es que los números se comprueban. El email compra **entrega** (el desglose
  por escrito + la fórmula), no acceso. `captureMode` apagado por defecto → el artículo que la aloja
  renderiza **igual byte a byte**.
- **`<SuscripcionInline/>` en el cuerpo de los 9 artículos.** Copy desde `cta_inline` en frontmatter,
  fallback por `formato` (`src/config/cta-inline.ts`). **El cuerpo MDX no ve su propio frontmatter**:
  `blog/[slug]/page.tsx` liga el componente al post al construir el mapa de `components`; por eso NO
  está en `widgets/index.ts`. En `cuanto-cuesta-la-ia` no hay formulario aparte, se enciende la
  captura de la calculadora. En el Radar va **entre dos `</RadarItem>` y `<RadarItem`, nunca
  dentro**: los dos parsers leen esas etiquetas y rompería la verificación (está en la plantilla con
  la restricción escrita).
- **`CierreEstandar` mató el switch por `formato`** de `ArticleClosing`: tres salidas fijas siempre
  (curso · trabajar conmigo · responder), y `formato` solo decide cuál se destaca. El switch no era
  incorrecto, era **inmedible** — nadie veía dos veces el mismo cierre. Copy en
  `src/config/cierre.ts`, compartido con la versión email — **strings sí, JSX no**: uno es Tailwind y
  el otro sobrevive a Outlook. `NewsletterEmail` lo pinta con `showClosing` (true en boletines, false
  en la secuencia, cuyo email 3 ya *es* la oferta).
- **La salida 2 NO dice "diagnóstico".** `EMBUDO.md` es explícito: *"Diagnóstico con entregable por
  encima de la charla gratis. **Hoy no se ofrece.**"* No hay alcance, precio ni entregable detrás de
  la palabra, y la primera conversación de venta es en septiembre. La petición es que describan su
  proceso, que además es la métrica declarada de la fase. **Revisar cuando se defina el precio de
  NBI**; el destino vive en `siteConfig` para cambiarlo en una línea.
- **`/panel`** (no `/admin`, que es lo que escanean los bots): 6 tablas, sin gráficas, tras
  contraseña con cookie firmada por HMAC. El gate va **en la página, no en `middleware.ts`**, porque
  el middleware corre en Edge y ahí no existe `node:crypto`. Agregación en TypeScript sobre selects
  planos, con `ROW_CAP` como aviso de cuándo moverla a SQL.
  Dos métricas etiquetadas con cuidado: **"desgloses pedidos", no "usos"** (usar la calculadora no
  toca el servidor; el uso está en Vercel WA, evento `calculadora_usada`), y **sin open rate**
  (necesita webhook de Resend, y Apple Mail precarga los píxeles).
- **Pendiente de decisión de Kata**: la frase del masthead. Se propusieron 3 alternativas que
  filtran por promesa en vez de por advertencia; ninguna aplicada.

## Diagnóstico estratégico y hoja de ruta de negocio (2026-07-26)

Detalle completo por tema en
`docs/superpowers/specs/2026-07-26-diagnostico-estrategico-y-monetizacion.md`. Lo que hay que
recordar sin abrirlo:

- **Los huecos son de oferta y volumen, no de diseño**: precio/alcance de NBI sin definir
  (bloquea `/trabaja-con-nbi` y el email día 8), 0 vídeos reales de YouTube, cadencia editorial
  baja. Nada de eso se arregla rediseñando.
- **Se recomendó congelar el diseño 60-90 días** y Kata pidió el 4º rediseño igualmente el
  2026-08-05 (ver sección "Rediseño editorial"). La recomendación sigue en pie para el 5º.
- **Monetización**: 0€ activo es lo correcto por debajo de 100 suscriptores. Orden: precio de NBI
  → primer producto de pago barato → premium solo con cadencia sostenida y ~500-1000
  suscriptores. Idea aparcada: "NBI Inside", 12€/mes. **Nada de cobrar hasta que se resuelva la
  capitalización** (`QUE_PUEDO_DECIR.md`).
- 3 ramas `claude/*` superseded siguen sin borrar (`blog-design-changes-90fd54`,
  `blog-redesign-from-scratch-e77d7c`, `universo-mapa-intencion-04c032`). La última dejó además
  un worktree en `.claude/worktrees/` con una copia completa del repo.

## Embudo y medición (2026-07-22)

Sprint "listo para el episodio 1": con <1k suscriptores los referidos no compensan; el lead
magnet **por tema** (no por vídeo, que muere por coste de producción) es lo que sostiene; la
secuencia de bienvenida es la palanca nº1 lector→cliente. Decisiones: oferta = **NBI primero**;
analítica = **Vercel WA**.

> Aquí ponía *"~30% de conversión por vídeo vs ~2% genérico"*. **Esas cifras no tienen fuente y
> `EMBUDO.md` las retiró el 2026-07-29**; la dirección era correcta, los números no. La mecánica
> del embudo manda desde `~/Developer/Marca-Personal/EMBUDO.md`, no desde aquí.

- **Analítica**: `<Analytics/>` (`@vercel/analytics/next`) en el layout. Verificada en dev (debug mode).
- **`/yt`** → `/recursos?utm_source=youtube` (307, `next.config.ts`) — link para descripción + comentario fijado de cada vídeo.
- **Secuencia de bienvenida — 0h / 48h / 96h** (`w1-bienvenida` / `w2-historia` / `w3-sistema`).
  **El copy vive en `content/emails/*.md`** (colección Velite `sequenceEmails`) y se edita sin
  tocar TS; la lógica en `src/lib/welcome-sequence.tsx`. Se programa en `/api/confirm` con
  `scheduledAt` de Resend (sin cron, máx. 30 días → `delayHours` está topado en el schema para no
  fallar en el envío); la baja cancela pendientes y borra filas. **Best-effort**: si la tabla no
  existe o Resend falla, el opt-in NUNCA se rompe.
  - **El paso 0 se envía inmediato y entrega algo**: `{{apertura_personalizada}}` renderiza el
    desglose de la calculadora **recalculado en servidor** desde `lead_magnet_submissions`, o si no
    hay, la lección más fuerte. Placeholders en `src/lib/email-template.ts` — **un nombre
    desconocido LANZA** y el paso se salta, porque un `{{typo}}` enviado no se puede deshacer.
  - **El guard anti-duplicado mira si hay CUALQUIER fila** en `scheduled_emails`, no clave por
    clave. Comparar por clave solo era seguro mientras las claves no cambiaran: al renombrar
    `d2-curso`→`w2-historia` todos los suscriptores existentes habrían parecido no inscritos.
  - **Modo prueba**: `POST /api/welcome-sequence/test` (Bearer `NEWSLETTER_SEND_SECRET`, reutilizado
    a propósito). Manda los 3 de golpe con asunto `[PRUEBA]`, no escribe nada, y con `dryRun`
    devuelve el HTML. Es la única forma de revisar un cambio de copy sin esperar 4 días.
  - Sustituyó a `d2-curso`/`d5-historia`/`d8-nbi` y a `src/emails/welcome.tsx`, **ambos borrados**.
    Ese `welcome.tsx` iba **sin `List-Unsubscribe` ni enlace de baja** — el único de los cuatro que
    incumplía RFC 8058, y el primero que recibía cualquiera. Y `d8-nbi` decía *"montamos sistemas
    de IA"*, plural de cortesía que `QUE_PUEDO_DECIR.md` prohíbe. Al reescribir se cerraron los dos.
- **`RESEND_REPLY_TO`** (env, opcional pero importante): el subdominio de envío no recibe correo — sin esta env las respuestas a "responde a este email" rebotan. Cargar en Vercel un buzón real monitorizado. `siteConfig.replyEmail` es el mismo buzón en versión pública (para `mailto:`), porque una env de servidor no sirve en un enlace.
- **Secuencia activa desde 2026-07-29**: migraciones `0001`/`0002`/`0003` aplicadas (la BD de producción estaba **vacía** — no faltaba la secuencia, faltaba `subscribers`), `RESEND_REPLY_TO` = `info@ianexora.com` desplegada. **Verificado end-to-end el 2026-08-05**: Kata respondió a un email de la secuencia y la respuesta llegó a `info@ianexora.com`. Era el último eslabón sin comprobar del embudo y el que sostiene la métrica de la fase (*reply rate*); llevaba dos sesiones abierto.
- **GEO: construido a medias, y el corte es deliberado** (2026-08-05). **SÍ hay**:
  `TechArticle`/`Article` por `formato`, `BreadcrumbList`, `DefinedTerm` en el glosario, `WebSite`
  en la home, `lastmod` real en el sitemap, fechas visibles, `AuthorBio` al pie,
  `scripts/geo/audit-ssr.mjs` y `docs/geo-checklist.md`.
  **NO hay, y no se adelanta**: `robots.ts`, `llms.txt` y el nodo `Person` con `sameAs` en
  `/sobre-mi` — es el contenido EN CÁMARA del episodio 1 (memoria `guion-episodio-1-geo`) y el 404
  de `/llms.txt` es la toma del "antes".
  **Tampoco** `SearchAction` (no hay buscador) ni `FAQPage` en ninguna página: `faqJsonLd()` existe
  sin llamadores esperando el primer `## Preguntas frecuentes` real. Los `<Quiz>` son ejercicios, no
  FAQ, y marcarlos así sería spam estructurado.
  **Consecuencia útil**: al no existir `robots.txt`, **no hay ningún crawler de IA bloqueado**. El
  requisito "verificar que no se bloquea a GPTBot/OAI-SearchBot/PerplexityBot/ClaudeBot" se cumple
  hoy sin escribir nada, y el script lo comprueba y lo dice.
- Descartado consciente (jul-2026): programa de referidos (<1k subs), comentarios giscus, Discord/Telegram (moderación vs tope 1,5h/sem — revisar a ~500-1k subs), analítica self-host.

## Modelo de datos (diseñado día 1, construido por fases)

`RLS ON` en todas. Default-deny; escrituras vía servidor (`service_role`) o RPC
`SECURITY DEFINER` (`SET search_path=''`, esquema no expuesto, `REVOKE EXECUTE
FROM PUBLIC` + `GRANT` explícito, verificar con `has_function_privilege`).

**`subscribers`** (Fase 2) — `id uuid pk`, `email citext unique`, `status enum(pending|confirmed|unsubscribed)`, `confirm_token_hash` (solo `sha256`; el token claro solo viaja en el email), `confirm_expires_at`, `confirmed_at`, `unsubscribe_token unique`, `unsubscribed_at`, `consent_ip`, `source` (el **cubo semántico**: `footer`, `post-inline`, `lead_magnet:<slug>`, con sufijo `:<utm_source>` cuando lo hay), `signup_path` (migración `0005`, la **ruta literal** del alta: `/recursos`, `/blog/que-es-rag` — responde "qué artículo capta", que `source` no puede sin volverse una segunda taxonomía ambigua), `locale default 'es'`, `created_at`.
RLS: **sin** policies anon/authenticated. Alta vía Route Handler con `service_role` + verificación Turnstile + rate-limit. Token CSPRNG, single-use, compare en tiempo constante. Respuesta 200 genérica (anti-enumeración). **El `consent` del checkbox se valida en servidor** desde 2026-08-05: antes el `required` era solo del navegador y un POST a mano suscribía sin dejar rastro de consentimiento, que es justo la prueba de base legal.

**`scheduled_emails`** (2026-07-22, migración `0002`) — `id uuid pk`, `subscriber_id fk → subscribers on delete cascade`, `email_key` (`w1-bienvenida`/`w2-historia`/`w3-sistema`; las viejas `d2-curso`/`d5-historia`/`d8-nbi` pueden seguir en filas antiguas), `resend_email_id` (para cancelar), `scheduled_at`, `created_at`, `unique(subscriber_id, email_key)`.
RLS: sin policies (solo `service_role`). Filas borradas al darse de baja.

**`lead_magnet_submissions`** (2026-08-05, migración `0005`) — `id uuid pk`, `email citext` (**sin FK**: la fila se escribe ANTES de que exista el suscriptor), `magnet_slug`, `payload jsonb`, `source_path`, `created_at`. Índices por `(email, created_at desc)` y `(magnet_slug, created_at desc)`.
RLS: sin policies (solo `service_role`). **El payload se recalcula en servidor**, nunca se guarda como lo mandó el cliente: el email 1 cita esas cifras y una cifra de origen cliente es una afirmación que no respalda nada.
**RGPD — ojo**: está claveada por email, es dato personal, y **al no haber FK el borrado no cascadea**. La baja llama a `deleteSubmissions()`, y una petición de supresión necesita los dos `delete`. La política de privacidad ya afirma que se borran con la dirección: si se quita ese `delete`, la política pasa a describir algo que no ocurre.

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

**Añadidos 2026-08-05 (todos vistos en vivo, no teóricos):**

- **Velite salía con 0 ante errores de schema.** Registraba `Invalid enum value` y seguía: el post
  simplemente desaparecía de la colección, y por tanto de listados, sitemap y RSS, sin romper
  nada. Aplicaba a **cualquier** campo. Por eso `build:content` lleva ahora `--strict`. No
  quitarlo.
- **`npm run lint` estaba inservible**: recorría `.claude/worktrees/`, que son copias completas
  del repo, y daba 1681 errores de ramas abandonadas. `.claude/**` está en `globalIgnores`.
- **Verificar con el servidor equivocado.** `pkill -f "next-server (v16"` no mata nada: el
  paréntesis es un metacarácter de regex. `npm start` falla entonces con `EADDRINUSE` **en
  segundo plano**, y `curl` sigue respondiendo — desde un build anterior cuyo chunk de CSS ya
  borró `--clean`, así que la página sale sin estilos y parece un bug de CSS. Matar por PID
  (`lsof -t -iTCP:<puerto> -sTCP:LISTEN`) y **comprobar `EADDRINUSE` en el log** antes de creerse
  una captura. Ojo también: hay un `next-server` ajeno (NBI-WEB) ocupando el 3000.
- **Capturas de pantalla**: `whileInView` no dispara sin scroll (parrillas vacías) y el canal
  `chrome` no existe en esta máquina → `open --browser webkit` (+ `--mobile`).
- **CSS sin capa gana a las utilidades de Tailwind v4**: `.headline` define `line-height` fuera de
  `@layer`, así que pisa el que trae `text-3xl`. Es deliberado.

**Añadidos 2026-08-05, segunda sesión (embudo). Todos vistos en vivo:**

- **No cuentes nada con `grep -c` sobre el HTML de Next.** El payload de React (los
  `self.__next_f.push`) vuelve a incluir los mismos strings de atributos, así que todo sale
  duplicado: contando `data-cierre` salían 6 donde el DOM tiene 3. Para contar elementos, usa el
  DOM (Playwright) o quita los `<script>` antes. Es el mismo motivo por el que
  `scripts/geo/audit-ssr.mjs` los borra primero: sin eso, una página que solo funciona con JS
  parecería correcta.
- **Para comprobar "no he cambiado nada visible"**: captura el HTML servido antes y después y
  diffea **normalizando los hashes de chunk y el build id de Next** (`"b":"…"`). Sin normalizar
  salen ~100 KB de diferencias que son solo del build; con normalización, el artículo de la
  calculadora salió idéntico byte a byte.
- **`s.markdown()` de Velite resuelve los enlaces como ficheros locales.** Un `[x]({{url_sitio}}/y)`
  muere con `ENOENT … content/emails/%7B%7Burl_sitio%7D%7D/y`. Fix: `s.markdown({ copyLinkedFiles:
  false })`. Es lo que permite que el copy no lleve el dominio a fuego (las ediciones de
  `content/newsletters/` sí lo llevan — pendiente de arreglar).
- **YAML: un valor sin comillas que contenga `: ` rompe la build** con *"Nested mappings are not
  allowed in compact mappings"*. Pasó con un `preheader`. En `content/emails/` van entrecomillados
  `subject`/`preheader`/`title` a propósito: es copy que se edita a mano.
- **Un `upsert` con una columna que aún no existe falla, y nadie se enteraba.** El resultado no se
  comprobaba, así que se seguía enviando el email de confirmación con un token que nunca se guardó:
  el lector pulsa y ve "enlace no válido". Despliegue y migración-a-mano **no son atómicos**, así
  que `/api/subscribe` reintenta sin la columna nueva y ahora sí comprueba el error.
- **Ejecutar TS del repo en un script suelto**: `./node_modules/.bin/esbuild fichero.ts --bundle
  --platform=node --format=esm --alias:@=./src --alias:#site/content=./.velite/index.js`. El
  `--outfile` **tiene que caer dentro del repo** o los `--external` (react, @react-email/render) no
  resuelven. Útil para probar funciones puras sin montar un framework de test.
- **Playwright solo está instalado global** (`~/.local/share/fnm/aliases/default/lib/node_modules/`).
  En ESM hay que importarlo por **ruta absoluta**: `NODE_PATH` no funciona para módulos ESM.
- **`.env.example` no se puede leer desde el sandbox** (Read y `grep` denegados). La lista de envs
  vive en este fichero.
- **El proyecto Supabase del blog no está en la cuenta del MCP** (solo `Maître-prod` y `NbiOps`).
  Desde aquí **no se puede verificar el esquema ni contar filas**: o lo confirma Kata, o se diseña
  para degradar (que es lo que hacen la secuencia y la captura).
