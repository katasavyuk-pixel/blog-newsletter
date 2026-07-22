# Rediseño "EL UNIVERSO" — kata.ianexora.com

> Spec validada en brainstorming con Kata el 2026-07-23 (concepto, arquitectura §1, entrada+NOVA §2,
> visual/voz/fases §3 — cada sección aprobada explícitamente). Sustituye el enfoque de home del
> rediseño "Biblioteca de Sistemas" (2026-07-22); el posicionamiento estratégico de aquella spec
> (lector nº1, NBI en público, honestidad radical) sigue vigente.

## Contexto y diagnóstico

Tras dos rediseños (Kata Pro, Biblioteca de Sistemas) el sitio seguía sin personalidad: composición
de "landing de newsletter" con adornos. Diagnóstico validado: fallan **concepto raíz, diseño visual
y voz** — no la estructura de embudo. Personalidad a transmitir: **directo sin filtros + explorador
en misión + científico juguetón**. El rojo/negro se queda como firma. Motor backend intacto.

## El concepto

**La web ES un universo rojo/negro en expansión** — el universo de NBI construyéndose en público.
No es una landing con efectos: cada elemento del negocio es un objeto celeste real.

- **Big bang** = primer commit del viaje (2026-06-24, `siteConfig.journey.start`).
- **Anillos de expansión** = semanas del viaje; los objetos nuevos aparecen en la frontera.
- **Cada sistema publicado = un sistema estelar que se enciende** ("Biblioteca de Sistemas" pasa
  a ser literal).
- Se entra **volando** (cinemática), una **partícula roja** te recibe y se convierte en **NOVA**,
  la copiloto persistente del sitio (una nova = estrella que se enciende de golpe; eco de Nexora).
- La home es un **mapa estelar navegable** (decisión explícita de Kata frente a opciones más
  conservadoras: quiere el máximo de originalidad).

## Arquitectura del universo

### El mapa (home `/`)

Pantalla completa navegable: drag para desplazarse, rueda/pinch para zoom, clic en un astro →
vuelo de cámara + bloom carmesí + "aterrizaje" en su página (estación). Centro = **el Núcleo**
(NBI). Anillos concéntricos marcan las semanas de expansión.

| Objeto | Qué es | Aterriza en |
|---|---|---|
| El Núcleo (centro) | NBI + el viaje | `/sobre-mi` |
| La Constelación | Curso: 6 estrellas que enciende el progreso del lector | `/empieza-aqui` |
| Sistemas estelares | Items `disponible` de `library.ts` | `/sistemas` |
| Protoestrellas | Items `en-construccion` con % de formación | overlay en el mapa |
| El Radar | Púlsar que barre; blips = titulares de la última edición | `/blog/tag/radar` |
| La Señal | Baliza newsletter — form nº 2, siempre visible | form en el mapa |
| La Sonda | Canal YouTube transmitiendo (autoactivable) | strip de vídeos |
| Cometas | Últimos posts cruzando | `/blog/[slug]` |

### Riesgos resueltos (no negociable)

- **Conversión**: 3 capturas — wizard de NOVA (`source: nova-wizard`), la Señal
  (`source: senal-mapa`), forms de las páginas clásicas. Medición por `subscribers.source`
  + Vercel Analytics.
- **Móvil**: mismo mapa en **vuelo guiado** (ruta Núcleo→Constelación→Sistemas→Radar→Señal con
  swipe); mapa libre tras gesto. Nunca una versión empobrecida.
- **SEO/a11y**: **capa semántica SSR** bajo el mapa (mismos destinos como enlaces reales) +
  toggle "Vista lista" en el HUD; navegación por teclado entre astros; `prefers-reduced-motion`
  = mapa estático sin vuelo. LCP = capa semántica/HUD SSR.
- **Lectura**: las estaciones (páginas de contenido) son calma editorial; el universo queda en
  los bordes y en la cabecera de "coordenadas" (`SISTEMA · TOKENIZACIÓN`).

### Rutas

Único rename: `/biblioteca` → `/sistemas` (redirect 301 en `next.config.ts`). Sagrado e intacto:
URLs de posts, `/recursos`, `/yt` → `/recursos?utm_source=youtube` (embudo episodio 1), `/blog`,
`/empieza-aqui`, RSS/sitemap/OG.

## Entrada + NOVA

### Cinemática (solo primera visita, ~4 s, siempre saltable)

1. **Negro** (0,5 s): rombo del logo pulsando — la intro dobla como pantalla de carga real.
2. **El vuelo** (2,5-3 s): cámara avanzando con parallax (placas de nebulosa, polvo, estrellas
   como líneas). "Saltar →" visible desde el segundo cero; clic/tecla también salta.
3. **La partícula** (1 s): desaceleración hacia una brasa roja que crece y estalla en bloom carmesí.
4. **NOVA emerge** y arranca el wizard.

Visitas siguientes: fundido ~1 s directo al mapa (flag localStorage). `reduced-motion`: fundido
estático, sin vuelo.

### Wizard de NOVA (form nº 1)

Saludo con descaro → "¿Qué te trae por aquí?" (montando algo → Sistemas / entender la IA →
Constelación / vengo del vídeo → recurso / curiosear → tour 30 s) → oferta de email «¿Te guardo
las coordenadas? Cuando se encienda un sistema nuevo, te aviso. Sin spam — ni tengo tiempo de
mandarlo.» → vuelo a la órbita elegida → NOVA se dockea.

### NOVA por el sitio (copiloto persistente)

- **v1 guionizada, sin LLM** (0 coste API). Upgrade futuro = Fase 4 (embeddings) le da cerebro.
- Estados: brasa idle (pulso suave) → aviso (pulso brillante + badge) → diálogo abierto.
- Menú al clic: *Llévame a… · ¿Qué es esto? · Mi progreso · Guardar coordenadas* (si no suscrito).
- Momentos guionizados: fin de post → siguiente órbita; lección completada → ignición de su
  estrella en el mapa; primer aterrizaje → micro-tour (3 tooltips); al volver → "desde tu última
  visita: …".
- Disciplina: jamás interrumpe lectura, máx. 1 aviso proactivo por página, toggle "no molestar"
  persistente, estática bajo `reduced-motion`.
- Guion en archivo propio editable (`src/components/nova/nova-script.ts`).

### Gamificación v1 (absorbe la antigua "Fase C")

Cartografía personal en localStorage (hook `use-local-state` existente): estrellas del curso
encendidas, sistemas visitados; rachas en fase posterior. NOVA anuncia desbloqueos.

## Visual + voz

- **Sobrevive**: tokens rojo/negro de `globals.css`, Anton + Montserrat + mono, grano + viñeta,
  técnica de sprites pre-renderizados de `particle-field`.
- **Entra**: placas de nebulosa por capas con parallax + campo estelar generativo (canvas) +
  astros interactivos en DOM/SVG. Tres capas: arte para el cine, canvas para la vida, DOM para
  tocar. *Técnica de placas*: generativas (pre-renderizadas a offscreen canvas al cargar, patrón
  sprite existente) en vez de binarios pesados — mismo look, cero peso de descarga; si algún día
  se quiere la imagen exacta de referencia, una placa se sustituye por `<img>` trivialmente.
- **HUD**: líneas finas, mono caps para datos ("SEM 5 · 3 SISTEMAS · RADAR ✓"), nombres de astros
  en Anton, mucho vacío deliberado.
- **Movimiento**: física de cámara (inercia, desaceleración), transiciones mapa↔estación con
  bloom carmesí, animación de ignición de estrellas.
- **Voz global**: directa, 1ª persona, frases cortas, descaro medido. Muestras validadas:
  la Señal → *"Sin spam. Ni tengo tiempo de mandarlo."* · 404 → *"Te has salido del mapa. Aquí
  no llegan ni mis sistemas."* · protoestrella → *"Formándose en NBI. 80%. No lo publico hasta
  que funcione de verdad."* Copy centralizado en `site.ts` + guion de NOVA en su archivo.

## Arquitectura técnica

### Nuevo

- SSOT del universo en dos piezas (convención del repo: `config/` datos puros, `lib/` acceso):
  `src/config/universe.ts` — tipos, constantes de mundo y matemática de colocación determinista
  (pura, client-safe; banda radial semántica por tipo + ángulo/jitter por hash del slug, anclas
  fijas solo para los 5 singleton); `src/lib/universe.ts` — `buildUniverse()` (server-only) que
  hidrata astros desde `library.ts`, `course.ts`, `siteConfig.journey`, `posts.ts` y `radar.ts`.
  Cero coordenadas a mano en colecciones; el resultado serializable baja al mapa por props.
- `src/components/universe/` — `universe-map.tsx` (client; cámara pan/zoom con transforms de
  `motion` sobre un div-mundo), primitivos de astro (`star`, `constellation`, `protostar`,
  `pulsar`, `beacon`, `comet`), `entry-sequence.tsx`, `semantic-layer.tsx` (SSR),
  `guided-flight.ts` (móvil).
- `src/components/nova/` — `nova-provider.tsx` (máquina de estados + contexto), `nova-dock.tsx`,
  `nova-dialog.tsx`, `nova-script.ts`.
- Tokens cósmicos añadidos a `globals.css` sin romper los actuales.

### Se reescribe / se borra

- Reescribe: `src/app/page.tsx` (el mapa sustituye a las 8 secciones), header/footer → HUD,
  `/sobre-mi` (el origen), `/biblioteca` → `/sistemas` (+301), re-encuadre de `/empieza-aqui`.
- Borra: `src/components/home/*`, `src/components/ui/typography.tsx` (huérfano). `StatusTicker`/
  `GlowSection`/`BrandVisual` solo si ninguna estación los reutiliza.

### Se reutiliza

`use-local-state` (SSR-safe), `SubscribeForm` (prop `source`), `lib/{posts,radar,subscribers,
resources}`, `MotionProvider`/`useReducedMotion`, `Container`/`Prose`/`Button`, patrón
sprites+visibilitychange de `particle-field`.

### Ni se toca (sagrado)

Backend completo (`src/app/api/*`, emails, secuencia día 2/5/8, Supabase), pipeline Velite,
widgets MDX, Radar CI, RSS/sitemap/OG, analítica, redirect `/yt`.

## Fases

| Fase | Entrega |
|---|---|
| U0 | Esta spec (commit) + `universe.ts` + tokens cósmicos |
| U1 | Mapa (desktop + vuelo guiado móvil) + capa semántica + HUD + la Señal + estaciones re-vestidas |
| U2 | Cinemática de entrada (skip, solo-primera-visita, reduced-motion) |
| U3 | NOVA v1 (wizard + dock + menú + momentos) → **merge a `main` = deploy a prod** |
| U4 | Gamificación + "desde tu última visita" + pulido móvil + OG cósmicas + CLAUDE.md/memoria |

Se construye en la rama `claude/blog-redesign-from-scratch-e77d7c`; prod no ve estados a medias
(merge único al cerrar U3, con `main` rebasado/integrado antes por si el Radar CI ha mergeado
ediciones nuevas). Commits pequeños en español, verde antes de cada commit.

## Verificación (por fase y antes del merge)

- `npm run build` + lint verdes antes de cada commit.
- Playwright e2e sobre dev: intro (1ª vez, skip, no repite), mapa (pan/zoom/clic → estación
  correcta), capa semántica (enlaces reales + teclado), vuelo guiado móvil (375px), wizard NOVA
  completo con alta en modo test (`source` correcto), la Señal envía, reduced-motion sin
  animaciones, barrido de rutas 200 (incl. `/sistemas` y 301 desde `/biblioteca`), `/yt` → 307.
- Web Vitals: LCP sin regresión en estaciones; canvas pausado con pestaña oculta.
- Prueba en móvil real antes del merge (los screenshots full-page mienten con reveals).

## Fuera de alcance (consciente)

Reescribir la voz de los 10 posts existentes (gradual, post-rediseño) · cerebro LLM de NOVA
(Fase 4) · re-skin de emails · tier premium (Fase 3) · página `/stats`.
