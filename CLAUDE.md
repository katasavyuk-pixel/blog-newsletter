@AGENTS.md

# CLAUDE.md — Blog + Newsletter de marca personal (IA)

> Documento vivo. Se mantiene al cerrar cada fase. Última actualización: **Rediseño "El Universo"** (2026-07-23).

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
| Tipografía | Montserrat (cuerpo/UI) + Anton (display); mono = stack del sistema | `next/font/google` |
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
- **Marca = Kata Ivanovych — "Atardecer Coral" → "Kata Pro"** (subdominio de NBI `ianexora.com`): paleta cálida espresso `#15100d` + coral/terracota `#d8442b` (texto = `--color-accent-ink #be3621`, AA) + crema `#f4eee3`; acentos salmón/terracota/oro y chips de categoría. Tipografía real del código: **Montserrat** (cuerpo/UI, `--font-body`/`--font-display`) + **Anton** (display condensada, `--font-punch`) + mono del sistema (`--font-mono`, sin webfont). Valores AA-verificados en `globals.css`. (La paleta NBI navy/cian quedó obsoleta en el rebrand `b044460` y el rediseño Kata Pro.)
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

## Retención y descubrimiento (2026-07-22) — PARCIALMENTE SUPERSEDIDO: las secciones de home aquí descritas ya no existen (ver "El Universo"); siguen vivos `/empieza-aqui`, related posts, `radar.ts` y el curso

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
- **Hero VIVO (2026-07-22)**: el panel del hero es un tokenizador interactivo real
  (`src/components/home/hero-tokenizer.tsx`, o200k on-demand) + consola `$ kata --status`
  con datos build-time. Identidad "laboratorio": eyebrows/footers mono con `▸`, footer
  "construido en público · build <fecha>". OJO: `ViewTransition` de React NO está en
  react 19.2.4 estable (solo canary) — no intentar `unstable_ViewTransition`; la flag
  `experimental.viewTransition` está activa pero sin el componente no anima client-nav.
- **Regla al implementar diseños del proyecto Claude Design**: los mocks traen datos fake
  ("12.400+ suscriptores", "Soy Álex") — SIEMPRE sustituir por datos reales/honestos, y
  traducir hex → tokens.

## Rediseño "EL UNIVERSO" (2026-07-23) — VIGENTE, en producción

Tercer rediseño, de concepto raíz (a Kata los dos anteriores "no le convencían: sin
personalidad ni originalidad"). Brainstorming completo + plan aprobado; spec en
`docs/superpowers/specs/2026-07-23-rediseno-universo-design.md`. **Desplegado a prod
2026-07-23** (merge fast-forward a `main`, deploy automático verificado en vivo).

- **Concepto (idea de Kata)**: la web ES un **universo rojo/negro en expansión** — el universo
  de NBI construyéndose en público. Big bang = 2026-06-24; anillos = semanas; cada sistema
  publicado = un sistema estelar que se enciende. Identidad visual previa (tokens, Anton/
  Montserrat, grano/viñeta) intacta; personalidad elegida: directo sin filtros + explorador
  en misión + científico juguetón (NO "constructor obsesivo").
- **Home = mapa estelar navegable** (`src/components/universe/`): cámara pan/zoom/inercia con
  motion values (`universe-map.tsx`), astros por tipo (`astro-node.tsx`: núcleo NBI,
  constelación=curso con estrellas que ENCIENDE el progreso real del lector, sistemas,
  protoestrellas con % formación, púlsar=radar con blips reales, baliza=la Señal con form,
  sonda=YouTube autoactivable, cometas=posts), panel de foco con CTA "aterrizar"
  (`astro-panel.tsx`), fondo canvas parallax (`starfield.tsx`). **Capa semántica SSR** bajo el
  mapa (`semantic-layer.tsx`): h1, enlaces reales, form `#senal` — SEO/a11y/no-JS. Móvil =
  vuelo guiado (`touch-action: pan-y`, el scroll de página sobrevive; modo libre opt-in).
- **SSOT**: `src/config/universe.ts` (geometría pura client-safe: tipos, anclas, bandas, hash
  determinista — cero coordenadas a mano en colecciones) + `src/lib/universe.ts`
  (`buildUniverse()` server-only desde library/course/posts/radar/journey + `getUniversePulse()`
  para NOVA). Home con `revalidate=3600`.
- **Cinemática de entrada** (`entry-sequence.tsx`): negro+logo → vuelo warp → partícula → bloom
  carmesí → mapa. Solo 1ª visita (localStorage `universe-intro-seen`), saltable siempre,
  visitas siguientes fundido ~300 ms, reduced-motion estático, `<noscript>` la oculta, dobla
  como pantalla de carga.
- **NOVA, la copiloto** (`src/components/nova/`): TODA su voz en `nova-script.ts` (editar ahí).
  v1 guionizada 0-coste-API (Fase 4 embeddings = darle cerebro). Wizard de llegada tras la
  cinemática (ruta → email `source: nova-wizard` → vuelo a tu órbita; máx. 1 auto-apertura
  por sesión, solo en el mapa). Dock brasa en toda la web: llévame a / ¿qué es esto?
  (contextual por ruta) / mi progreso (★☆ + siguiente lección) / guardar coordenadas
  (`nova-dock`) / no molestar. "Desde tu última visita" con datos reales (`getUniversePulse`
  vía layout); celebración al encender estrella (gamificación "Fase C" absorbida).
- **Rutas**: `/biblioteca` → **`/sistemas`** (308 en `next.config.ts`); nav = Sistemas · Curso ·
  Radar · Sobre mí; announcement bar y las 11 secciones de la home anterior BORRADAS
  (`components/home/` ya no existe; también fuera glow-section, brand-visual, typography).
  Sagrado intacto: URLs de posts, `/recursos`, `/yt`, backend completo, Velite, widgets MDX,
  Radar CI, RSS/sitemap.
- **Verificación**: build+lint verdes por commit; e2e con playwright-cli (WebKit): intro
  1ª/skip/repetida, wizard completo con alta en preview-mode, mapa clic→panel→aterrizaje,
  vuelo guiado móvil emulado, barrido rutas 200/307/308, form Señal. Prod verificado con curl.
- **Gotchas nuevos**: (1) `setPointerCapture` en pointerdown se traga los clicks de los hijos —
  capturar solo al superar el umbral de drag; (2) rAF NO dispara en pestañas ocultas — la
  decisión post-hidratación de la intro usa `setTimeout(0)`; (3) el lint prohíbe `ref.current=`
  en render y `setState` directo en effects — patrones: `useSyncExternalStore`
  (`use-coarse-pointer.ts`) o setTimeout; (4) playwright-cli en esta máquina: canal chrome no
  existe → `open --browser webkit` (+ `--mobile` para coarse pointer); el Browser-pane del IDE
  con panel oculto da screenshots negros y throttlea timers — no fiarse para verificar
  animaciones.
- **Pendiente de Kata (gusto)**: densidad/posiciones de astros, intensidad de partículas,
  pulir el guion de NOVA a su voz, sensación del mapa en su móvil real. Técnico pendiente:
  momento "fin de post → siguiente órbita" (descartado consciente en v1: RelatedPosts ya
  cubre), rachas del radar, `/stats`.

## Rediseño "Biblioteca de Sistemas" (2026-07-22) — SUPERSEDIDO por "El Universo" (estructura/home/nav ya no aplican; el POSICIONAMIENTO estratégico sigue vigente)

Pivote de posicionamiento + rediseño de arquitectura (spec completa en
`docs/superpowers/specs/2026-07-22-rediseno-biblioteca-sistemas-design.md`; brainstorming + 2
rondas de benchmark de 10 referencias). **Identidad visual intacta** (tokens rojo/negro, Anton +
Montserrat); lo que cambió es estructura y copy.

- **Posicionamiento**: de "aprende IA sin humo" → **"construyo NBI en público; sistemas replicables
  probados en un negocio real"**. Lector nº 1 = emprendedor ya en marcha (el canal de YouTube
  tratará emprendimiento/desarrollo/habilidades). NBI jamás se vende en la home — solo downstream
  (email día 8). Filtro de identidad en el copy ("no encajarás si buscas atajos").
- **Arquitectura** (patrón Clear/Ness Labs: biblioteca-como-página, home-como-argumento): nav de 4
  items `Biblioteca (/biblioteca) · Curso · Noticias · Sobre mí` + CTA. `/blog` y `/recursos`
  siguen vivos fuera de la nav (SEO + embudo `/yt` intactos). **`/biblioteca`** = biblioteca
  completa por temas con destacados curados. `/sobre-mi` = "el viaje" (identidad → credencial →
  misión → CTA).
- **Home** (~7 secciones, exactamente 2 forms): hero captura (form + magnet nombrado) con **panel
  de estado del viaje** (`JourneyPanel`: consola `kata --status` con misión/semana/sistemas/
  suscriptores) → **pilar curso** (`CoursePillar`, tokenizador movido aquí como demo) →
  **biblioteca curada** (`LibraryShowcase` + `LibraryCard`, cards "EN EL TALLER" con barra de
  progreso = huecos anunciados) → cadencia Radar (`CadenceStrip`) → manifiesto → YouTube strip →
  cierre que vende contenido FUTURO (`ClosingCta`, ancla `#newsletter`). Eliminados:
  `blog-highlights`, `interactive-showcase`, `news-today`, `newsletter-cta`, `about-teaser`,
  `final-cta`.
- **SSOT nuevo**: `src/config/library.ts` (`LIBRARY_ITEMS` con `status disponible|en-construccion`,
  temas, proof lines honestas; `COURSE_LESSON_META`). Regla de honestidad: cada item debe ser real.
  `siteConfig.journey` (`start` = primer commit 2026-06-24, `mission` — actualizar cuando cambie).
- **Métricas**: `getConfirmedSubscriberCount()` (`src/lib/subscribers.ts`, admin client, degrada a
  `null`); home con `revalidate = 3600` (ISR). El contador solo se muestra desde
  `newsletter.showCountFrom` (100).
- Verificado e2e con Playwright: rutas 200, `/yt` → 307 con utm, form del hero (preview mode),
  screenshots desktop/móvil. Gotcha lint: `Date.now()` en render viola `react-hooks/purity` →
  calcular en scope de módulo.
- **Capa "impacto" (feedback "no me llama la atención" + storyboard partículas del usuario)**:
  (1) `ParticleField` (`src/components/effects/`, canvas client global en el layout, z-30 bajo
  viñeta/grano z-40/41): brasas carmesí con estallido inicial que se asienta en deriva, sprites
  pre-renderizados (nada de shadowBlur por frame), pausa con visibilitychange, `null` bajo
  reduced-motion; (2) `StatusTicker` — marquesina CSS (`.ticker-track`, contenido duplicado,
  loop -50%) con datos reales del viaje; (3) biblioteca en **bento asimétrico** con ordinales
  cromados gigantes (`chrome-text` + Anton) y halo radial en la card destacada (`LibraryCard`
  props `hero`/`ordinal`); (4) clímax carmesí de vuelta: `ClosingCta` = panel `bg-accent`
  saturado con card de form espresso flotando; (5) `ScrollReveal` escalonado en hero/parrillas.
  OJO: los full-page screenshots salen con parrillas "vacías" (whileInView no dispara sin
  scroll) — verificar scrolleando. El look que quiere Kata: cinematográfico rojo/negro con
  partículas, momentos "wow" — no minimalismo plano.

## Embudo y medición (2026-07-22)

Sprint "listo para el episodio 1" (investigación: con <1k subs los referidos no compensan;
lead magnet específico por vídeo ~30% conversión vs ~2% genérico; secuencia de bienvenida =
palanca nº1 lector→cliente). Decisiones: oferta = **NBI primero**; analítica = **Vercel WA**.

- **Analítica**: `<Analytics/>` (`@vercel/analytics/next`) en el layout. Verificada en dev (debug mode).
- **`/yt`** → `/recursos?utm_source=youtube` (307, `next.config.ts`) — link para descripción + comentario fijado de cada vídeo.
- **Secuencia de bienvenida** (día 2 curso / día 5 historia / día 8 pitch NBI suave): contenidos en `src/emails/welcome-sequence.tsx` (reutiliza la carcasa `NewsletterEmail` → footer de baja + `List-Unsubscribe` RFC 8058), lógica en `src/lib/welcome-sequence.ts`. Se programa en `/api/confirm` con `scheduledAt` de Resend (sin cron, máx. 30 días); la baja (`/api/unsubscribe`) cancela pendientes en Resend y borra filas (re-alta = nuevo ciclo de consentimiento). **Best-effort**: si la tabla no existe o Resend falla, el opt-in NUNCA se rompe.
- **`RESEND_REPLY_TO`** (env, opcional pero importante): el subdominio de envío no recibe correo — sin esta env las respuestas a "responde a este email" (día 5/8) rebotan. Cargar en Vercel un buzón real monitorizado.
- **Pendiente para activar la secuencia**: (1) aplicar `supabase/migrations/0002_scheduled_emails.sql` en el SQL editor del proyecto del blog (esa cuenta Supabase NO tiene MCP/CLI desde esta máquina), (2) `RESEND_REPLY_TO` en Vercel, (3) e2e en prod: confirmar un alta de test → 3 emails en "Scheduled" de Resend + 3 filas en `scheduled_emails`; baja → cancelados.
- **GEO (llms.txt, robots.ts, JSON-LD Person) deliberadamente NO construido**: es el contenido EN CÁMARA del episodio 1 (memoria `guion-episodio-1-geo`) — el 404 de `/llms.txt` es el "antes" del vídeo. No adelantar.
- Descartado consciente (jul-2026): programa de referidos (<1k subs), comentarios giscus, Discord/Telegram (moderación vs tope 1,5h/sem — revisar a ~500-1k subs), analítica self-host.

## Modelo de datos (diseñado día 1, construido por fases)

`RLS ON` en todas. Default-deny; escrituras vía servidor (`service_role`) o RPC
`SECURITY DEFINER` (`SET search_path=''`, esquema no expuesto, `REVOKE EXECUTE
FROM PUBLIC` + `GRANT` explícito, verificar con `has_function_privilege`).

**`subscribers`** (Fase 2) — `id uuid pk`, `email citext unique`, `status enum(pending|confirmed|unsubscribed)`, `confirm_token_hash` (solo `sha256`; el token claro solo viaja en el email), `confirm_expires_at`, `confirmed_at`, `unsubscribe_token unique`, `unsubscribed_at`, `consent_ip`, `source` (p.ej. `footer`, `lead_magnet:guia-rag`, `popup`), `locale default 'es'`, `created_at`.
RLS: **sin** policies anon/authenticated. Alta vía Route Handler con `service_role` + verificación Turnstile + rate-limit. Token CSPRNG, single-use, compare en tiempo constante. Respuesta 200 genérica (anti-enumeración).

**`scheduled_emails`** (2026-07-22, migración `0002`) — `id uuid pk`, `subscriber_id fk → subscribers on delete cascade`, `email_key` (`d2-curso`/`d5-historia`/`d8-nbi`), `resend_email_id` (para cancelar), `scheduled_at`, `created_at`, `unique(subscriber_id, email_key)`.
RLS: sin policies (solo `service_role`). Filas borradas al darse de baja.

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
