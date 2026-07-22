# Rediseño "Biblioteca de Sistemas" — kata.ianexora.com

## Contexto

El blog está posicionado 100% como "aprende IA sin humo", pero el canal de YouTube (top-of-funnel
real) tratará **emprendimiento, desarrollo personal y habilidades**. Al entrar hoy no hay "wow" ni
curiosidad. Sesión de brainstorming + 2 rondas de investigación (2026-07-22) cerraron:

- **Hilo conductor**: *construyo NBI (empresa de IA) en público* — la historia central.
- **Lector nº 1**: emprendedor/autónomo **ya en marcha**.
- **Promesa**: **sistemas replicables probados en mi negocio real**; historia y números como prueba.
- **Comunidad (<1k subs)**: newsletter conversacional + YouTube. Sin Discord.
- **Concepto**: **Biblioteca de Sistemas**, con **huecos anunciados** (cards "en construcción").
- **Curso interactivo de IA = pilar nº 1** — ninguna de las 10 referencias analizadas tiene
  contenido interactivo; es el diferenciador wow.
- **Identidad visual intacta**: rojo/negro premium, Anton + Montserrat, chrome, grano, glow.
  El rediseño es de arquitectura, estructura y copy — no de tokens.

Patrones validados en referencias (Clear, Ness Labs, Barry, Welsh, Koe, levels.io, Sahil, Abdaal,
Bravo, Pastor, sinoficina; anti-ejemplo Scipion):
1. **Biblioteca-como-página, home-como-argumento** (unánime): home = curación + identidad +
   captura; archivo por **temas con best-of curado**, nunca cronológico desnudo.
2. **El curso gratuito ES el mecanismo de captura** (modelo Clear "30 Days"): bloque grande de la
   home, inscripción ligada a email — no página huérfana.
3. **Nav 3-6 items (mediana 4)**: contenido primero, About último.
4. **Máx. 2 forms por home** (apertura + cierre), **un solo magnet nombrado**; cadencia explícita
   y cifra/credencial casual en el form.
5. Sin cifras grandes → **transparencia radical de métricas pequeñas reales** (levels.io `/stats`);
   la consola `kata --status` ya apunta ahí.
6. **Filtro de identidad** en el copy (para quién es / para quién NO).
7. **NBI invisible en la home** — high-ticket se vende downstream (secuencia día 8, ya construida).
8. Radar separado de la biblioteca, presentado como **cadencia** ("cada lunes"), como Clear separa
   la newsletter 3-2-1 de /articles.

## Arquitectura de información (mapa del sitio)

**Nav final: 4 items + CTA** — `Biblioteca (/biblioteca) · Curso (/empieza-aqui) · Noticias
(/blog/tag/radar) · Sobre mí (/sobre-mi)` + botón "Suscríbete". Salen de la nav: Blog y Recursos
(las rutas NO se borran; ver abajo).

- **`/` (home)** = argumento de venta con biblioteca curada (ver composición).
- **`/biblioteca` (NUEVA)** = la biblioteca completa, organizada **por temas/sistemas** (modelo
  Clear /articles): bloques temáticos con 2-3 piezas destacadas cada uno + cards "en construcción"
  + recursos descargables integrados + link discreto al archivo cronológico (/blog).
- **`/blog`** queda como archivo cronológico secundario (SEO, URLs intactas), enlazado desde
  /biblioteca — deja de estar en nav.
- **`/empieza-aqui`** sigue siendo la página del curso (funciona, tiene progreso); se re-encuadra
  como pilar de la biblioteca y su promoción principal pasa a ser el bloque de la home.
- **`/recursos`** INTOCABLE como ruta (destino del embudo `/yt`, episodio 1 se graba 2026-07-23);
  su contenido se lista también en /biblioteca.
- **`/sobre-mi`** = "el viaje": identidad en 1 frase → credencial honesta → misión/filosofía →
  CTA newsletter (estructura Barry/Welsh; nunca biografía cronológica).
- Idea futura (NO ahora): página `/stats` pública estilo levels.io.

## Composición de la home (~6-7 scrolls, 2 forms)

1. **Hero — identidad + captura** (`GlowSection`): eyebrow mono "▸ construyendo una empresa de IA
   en público · semana N"; H1 (Anton) tipo "SISTEMAS PROBADOS EN UN NEGOCIO REAL. LLÉVATELOS.";
   sub con filtro de identidad; **form #1** con magnet nombrado + cadencia. Panel derecho:
   **panel de estado del viaje** (consola `kata --status` ampliada: misión, semana, sistemas,
   métricas reales).
2. **Bloque curso (pilar, grande)**: "Entiende la IA tocándola" — 6 lecciones interactivas, con el
   tokenizer embebido como demo tocable (se muda aquí desde el hero) + progreso localStorage +
   CTA "Empieza gratis". El curso como argumento-captura, modelo Clear.
3. **Biblioteca destacada (el wow visual)**: grid curado de 3-6 sistemas (`LibraryCard`) + 2-3
   cards "en construcción" con barra de progreso ("construyéndose en NBI · sem N") + CTA
   "Ver toda la biblioteca →" (/biblioteca).
4. **Franja de cadencia**: "Cada lunes: Radar IA" + 3 titulares de la última edición (compacta,
   reutiliza `radar.ts`).
5. **Manifiesto "el viaje"** (sustituye about-teaser): quién soy, qué construyo (NBI como historia,
   no como oferta), por qué regalo los sistemas + filtro de identidad. CTA → /sobre-mi.
6. **YouTube strip** (autoactivable, igual que hoy, re-encuadrada "el viaje en vídeo").
7. **Cierre — form #2**: vende el contenido FUTURO (lista de sistemas/series que llegarán, desde
   `library.ts` — patrón Javi Pastor). Fusiona `newsletter-cta` + `final-cta` en una sola sección.

Desaparecen de la home: `blog-highlights` (curación pasa a biblioteca), `interactive-showcase`
(absorbida por bloques 2-3), `final-cta` (fusionada en 7).

## Arquitectura técnica (de la radiografía del código)

- **`src/config/library.ts`** (nuevo SSOT, patrón `course.ts` + absorbe el mapa `SHOWCASE` inline
  de `interactive-showcase.tsx`): `LIBRARY_ITEMS: { kind: "curso"|"post"|"recurso"|"construccion";
  slug?; tema; color; glyph; level; format; status; progreso?; href }`. Items `post` se hidratan
  con `getPost`/`allPosts`; `recurso` con `getPublishedResources()` (ya degrada a `[]` sin
  Supabase); `construccion` renderiza solo desde config. Los bloques temáticos de /biblioteca
  salen de agrupar por `tema`.
- **Panel de estado** = extender `statusLines` de `hero.tsx` (ya calcula en build: nº posts,
  interactivos, fecha radar). Añadir: sistemas publicados/en construcción (library.ts), semana N
  (desde `journeyStart` nuevo en `site.ts`). Suscriptores: `getConfirmedSubscriberCount():
  Promise<number|null>` con `createAdminClient()` + guard `isSupabaseConfigured()` (patrón
  `resources.ts`) y `export const revalidate = 3600` en `page.tsx` (precedente: `feed.xml`);
  mostrar cifra solo desde umbral `showSubCountFrom` (config).
- **`LibraryCard`** nuevo primitivo compartido (hoy el patrón de card está inline y repetido en 3
  secciones). Cards "en construcción" siguen el precedente autoescondible de `youtube-strip.tsx`.
- **Progreso/estado por entregable**: reutilizar `useLocalState` (SSR-safe) y el patrón
  `CourseList`/`CourseProgressMarker`.
- **Tokenizer**: `hero-tokenizer.tsx` (client, o200k on-demand) se muda al bloque del curso; su
  patrón de import dinámico es el estándar para widgets pesados.
- **Reutilizables**: `GlowSection`, `Container`, `Card`, `IconChip`, `Badge`, `Button`, `Eyebrow`,
  `BrandVisual`, `ScrollReveal`, `SubscribeForm` (props `source/tone/layout`). Hero sigue server;
  métricas bajan por props.

## Qué NO se toca

- Tokens/identidad visual (`globals.css` `@theme`), tipografías, grano/viñeta/glow.
- Backend newsletter completo (subscribe/confirm/unsubscribe/download, secuencia día 2/5/8 NBI).
- Pipeline Velite, widgets MDX, Radar CI, página de post, RSS/sitemap/OG.
- Rutas existentes (ningún 404 nuevo) y redirect `/yt` → `/recursos?utm_source=youtube`.
- Analítica Vercel.

## Fases de implementación

- **R0 — Spec + copy**: design doc en
  `docs/superpowers/specs/2026-07-22-rediseno-biblioteca-sistemas-design.md` (commit); reescribir
  `site.ts` (tagline, bio, bullets, announcement, `journeyStart`, magnet nombrado, navLinks);
  crear `library.ts`.
- **R1 — Home nueva**: hero captura + panel de estado, bloque curso con tokenizer, biblioteca
  destacada (`LibraryCard`), franja cadencia, manifiesto, cierre "lo que viene". Componentes en
  `src/components/home/`.
- **R2 — Páginas**: `/biblioteca` nueva (bloques por tema), nav 4 items, `/sobre-mi` (el viaje),
  re-encuadre `/empieza-aqui`, integración recursos↔library.
- Commits pequeños en español, directo a `main` (push = deploy Vercel automático). Verde antes de
  cada commit.

## Verificación

- `npm run build` + lint verdes antes de cada commit.
- E2E visual con Playwright sobre `npm run dev`: screenshots home completa (desktop + móvil) y
  /biblioteca; form del hero envía (modo test); progreso del curso sigue funcionando; franja radar
  renderiza; `/yt` redirige con utm; nav nueva en móvil (menú `<details>`).
- `prefers-reduced-motion` sin animaciones; contraste AA en textos nuevos (`accent-ink`/`salmon`
  sobre oscuro).
- Barrido de rutas: /, /biblioteca, /blog, /blog/[slug], /blog/tag/[tag], /empieza-aqui, /recursos,
  /sobre-mi, /gracias, /baja, /privacidad, /feed.xml, /sitemap — ninguna rota.
