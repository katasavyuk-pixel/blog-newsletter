# Historia del sitio — rediseños, embudo y diagnóstico

> Extraído de `CLAUDE.md` el 2026-08-21, **sin editar el texto**. Estaba allí porque se fue
> escribiendo sesión a sesión, y llevó el fichero a 653 líneas: más de tres veces el
> presupuesto de contexto, y un documento que nadie relee entero es un documento que se
> contradice sin que nadie lo note.
>
> Esto es el registro de qué se decidió y por qué. Lo que rige hoy está en `CLAUDE.md` y,
> cuando discrepen, manda el código.
>
> Ojo: aquí dentro hay afirmaciones que ya eran falsas cuando se extrajeron (los "11 MDX",
> "2 de 5 items en-taller", "breaker por cuota"). Se conservan a propósito — corregirlas
> convertiría un registro histórico en una ficción ordenada. Las correcciones están en
> `CLAUDE.md` y en `ESTADO.md`.

## Capa interactiva — "Caja de Cristal" (rediseño)

Concepto: cada post es un artefacto manipulable, no solo texto. Stack añadido: `motion` (animaciones), Radix Popover (glosario accesible), `gpt-tokenizer` (cliente), View Transitions (`experimental.viewTransition`), CSS scroll-driven (barra de progreso).

- **Widgets en MDX**: cada interactivo es una isla `"use client"` registrada en `src/components/mdx/widgets/index.ts` (`widgets`) y pasada por la prop `components` de `MDXContent` en `src/app/blog/[slug]/page.tsx`. **Para añadir uno**: crear el componente en `src/components/mdx/widgets/`, exportarlo en `index.ts`, y usarlo en el `.mdx` (`<TokenizerPlayground/>`, `<Quiz/>`, `<Term id="token">…</Term>`, `<Callout>`, `<GuessReveal>`). Datos pesados precomputados en JSON colocado en `content/posts/<slug>/`.
- **Toolkit** (`src/components/mdx/widgets/`): primitivos — `WidgetFrame` (la "lab card" que envuelve todo), `Param` (range accesible), `Quiz` (explicación por opción, sin "fallar", localStorage), `Term` (glosario `src/lib/glossary.ts`), `Callout`, `GuessReveal`. Widgets — `TokenizerPlayground`, `TemperatureSandbox` (softmax/top-p), `CostCalculator`, `HallucinationQuiz`, `PromptDiff`, `LifeOfAPrompt` (explorable scrollytelling sticky con IntersectionObserver). Todos cliente, datos pre-calculados, 0 coste API.
- **Estado/gamificación**: `src/hooks/use-local-state.ts` (localStorage vía `useSyncExternalStore`, SSR-safe, claves `slug+widgetId`). Persistencia híbrida: localStorage ahora → Supabase Auth cuando haya tracción.
- **Motion/a11y (reglas duras)**: `MotionProvider` (`reducedMotion="user"`) en el layout; bloque global `@media (prefers-reduced-motion: reduce)` en `globals.css`; `useReducedMotion` hook. **Coral solo superficie; texto en coral oscuro** (`--color-accent #d8442b` no pasa AA como texto pequeño → usar `--color-accent-ink #be3621`; sobre espresso, links en salmón). Cada widget: operable por teclado, fallback estático, `not-prose`.
- **Lectura inmersiva**: `ReadingProgress` (CSS scroll-timeline, 0 JS), `Toc` con scroll-spy (IntersectionObserver), `CopyCode` (botón sobre los bloques Shiki), cabecera de post tipo revista (frontmatter `kicker`/`dek` en `velite.config.ts`).
- **Rollout**: Fase A ✅ (fundación + toolkit + Tokenizer + rediseño). Fase B ✅ (4 widgets + explorable insignia + 4 posts interactivos). Pendiente: Fase C (juegos + gamificación localStorage: rachas/logros + loop newsletter), Fase D (cuentas Supabase Auth + repaso espaciado). Catálogo completo en el plan y `tasks/wi7u5i5it.output`.

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

## Capa cinemática — wizard, Chispa y la intro de la home (2026-08-06) — VIGENTE

Quinto rediseño. Al contrario que la máquina de captación, **este sí toca lo
visual**, aunque no cambia ni un token: la identidad (negro cálido + rojo, Anton
+ Inter) se queda igual. Specs en `docs/specs/{intent-wizard,chispa-assistant,
home-scrollytelling}.md`.

- **`IntentWizard`** (`src/components/wizard/`) — enrutador de intención
  **opt-in**. **Dejó de abrirse solo el 2026-08-06**: las dos únicas puertas son
  `?wizard=1` y el chip «¿Te pongo en ruta?» del dock de Chispa. Se quitó de la
  entrada porque (a) es un modal opaco que bloquea el sitio entero pidiendo 20 s
  y 4 clics **antes de dar nada** — el mismo reflejo por el que se quitó el
  formulario del masthead — y (b) `sessionStorage` se borra al cerrar la pestaña,
  así que «una vez por sesión» era **una vez por visita**: el lector que vuelve
  cada lunes a por el Radar lo pagaba entero cada vez. Rutear sigue siendo su
  trabajo, pero eso ya lo hacen `StartHere` y la nav sin bloquear. **Sin
  persistencia** (las dos entradas son deliberadas) y **cada apertura remonta**
  (`key={openCount}`), o reabrirlo devolvía la elección anterior ya hecha.
  Vuelo cinemático de la mascota → 4 pasos: intro · intención · formato · rumbo.
  **El vuelo se recoreografió el 2026-08-06** (Kata: «se ve como un doble
  difuminado y queda feo»): converge a su hueco, **se acerca nítida hasta llenar
  el cuadro** (≈560 px medidos), sostiene un beat y solo entonces se desenfoca al
  pasar la cámara. Un único desenfoque en toda la secuencia, verificado
  muestreando `getComputedStyle`. El porqué del bug, en `docs/specs/intent-wizard.md`.
  **No pide email a propósito** — pedirlo antes de haber dado nada es el mismo
  reflejo de landing por el que se quitó el formulario del masthead. El porqué
  está escrito en `src/config/intent.ts`; no volver a añadirlo sin releerlo.
  Cliente puro: `null` en SSR y `null` con reduced-motion.
- **Chispa asistente** (`src/components/assistant/`, `src/app/api/assistant/`) —
  dock global de chat, anclado al índice del sitio (`src/lib/assistant-index.ts`)
  para que no invente. Proveedor neutro por env (`LLM_BASE_URL` / `LLM_API_KEY` /
  `LLM_MODEL`, Groq por defecto); sin clave responde un mensaje honesto, nunca un
  500. **El prompt lleva la regla del singular**: generaba «nuestro sitio» en cada
  respuesta, que es el plural de cortesía que `QUE_PUEDO_DECIR.md` prohíbe.
- **Intro scrollytelling de la home** (`src/components/home/scrolly/`) — tres
  escenas pinned, ruido → señal → sistema, que entregan al masthead. Datos en
  `src/config/scrolly.ts`; el terminal comparte `getJourneyStatusLines()` con el
  `JourneyPanel` para no poder contradecirlo. Añade **5,0 pantallas** de scroll
  antes del `h1` en escritorio (3,5 en móvil), con botón de saltar sticky.
  **Segundo pase el 2026-08-06** (Kata: «muy simplón»), sin mover el dial:
  easing de verdad (`useSceneRange` acepta `ease`; la constante de la casa
  llevaba semanas exportada **sin un solo consumidor**, así que todo interpolaba
  linealmente), `SceneAtmosphere` para que el negro deje de ser un vacío, tres
  planos de profundidad en el ruido, y **la escena 2 por fin es causal**: Chispa
  barre, gira y baja por el lateral encendiendo cada fila al llegar a su altura
  — antes las filas corrían con un temporizador propio mientras ella volaba por
  otro lado. La **escena 3 es ahora el pipeline del Radar**
  (`pipeline-scene.tsx`, sustituye a `system-scene.tsx`): `recolecta → verifica
  → publica` trazado con `pathLength`, y en el gate un ítem sale rebotado con ✗
  y su razón. Era el mismo panel `kata --status` del masthead 300 px más abajo;
  ahora el terminal es la *salida* de la máquina. Detalle en
  `docs/specs/home-scrollytelling.md`.
  **Con reduced-motion no se atenúa: no se monta** — `MotionConfig
  reducedMotion="user"` mata transform pero deja pasar opacity, así que atenuar
  dejaría media coreografía viva.
  - **Los 24 titulares de hype se pintan solo tras hidratar.** No son
    afirmaciones de Kata, y dejarlas en el HTML servido por delante del `h1` real
    le da a un crawler de IA dos docenas de frases que atribuir mal — en el único
    sitio que discute justo eso en público. Arrancar en negro y subirlas es
    además mejor primer compás. `scripts/geo/audit-ssr.mjs` lo comprueba.
  - `SIGNAL_ITEMS` son los **7 ítems de `radar-2026-08-04` verbatim**, porque la
    escena cierra con «de cien ruidos, siete señales». Había cinco decorativos.
- **`ScrollReveal` tiene variante `blur`** además de `rise` (por defecto).
  Aplicada a las 4 secciones de la home que no revelaban nada **y a las 7 páginas
  que no tenían movimiento ninguno** (`/sistemas`, `/radar`, `/empieza-aqui`,
  `/recursos`, `/glosario`, `/sobre-mi`, `/trabaja-con-nbi`): el rediseño solo
  había tocado la portada, así que el sitio animaba delante y se moría al primer
  clic. Aperturas de sección en `blur`, rejillas de tarjetas escalonadas a
  `i * 0.07`. Dos detalles que cuestan un rato descubrir: el reveal va **dentro**
  del `<li>` (un `<div>` no es hijo válido de `<ul>`) y las rejillas necesitan
  `h-full` en el wrapper o la tarjeta deja de estirarse a su fila.
- **Nada pendiente.** `LLM_API_KEY` está en producción desde el 2026-08-06
  (verificado con `vercel env ls production`), y es la **única** que hace falta:
  `LLM_BASE_URL` y `LLM_MODEL` tienen valor por defecto en
  `src/app/api/assistant/route.ts` (Groq + `llama-3.3-70b-versatile`), así que
  solo se suben si se cambia de proveedor. **Las dos decisiones abiertas también
  están cerradas**: las pantallas, en `b772c44` (500vh/350vh, y el segundo pase
  no las movió); las intros encadenadas, sacando el wizard de la puerta.

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
