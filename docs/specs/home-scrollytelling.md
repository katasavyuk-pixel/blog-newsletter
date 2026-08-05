# Home scrollytelling (F2)

Fecha: 2026-08-05 · Estado: aprobado por Kata · Spec previa a implementación

## Decisión

Intro cinemática de 3 escenas pinned (ruido → señal → sistema) que aterriza en
el masthead actual + secciones existentes con reveals consistentes. Móvil:
versión ligera. Reduced-motion: la intro se omite por completo.

## Enfoque técnico

Motion `useScroll` + `useTransform` sobre secciones altas con viewport sticky.
Sin dependencias nuevas. Posiciones pseudoaleatorias **deterministas** (PRNG con
semilla en módulo, nunca `Math.random()` en render → sin hydration mismatch).
Todo el contenido real queda en el DOM (H1 en masthead); las escenas son
`aria-hidden`.

## Escenas

### 1 · Ruido (`noise-scene.tsx`, ~200vh / ~130vh móvil)
~24 titulares de hype flotando; el contenedor hace dolly-in + rotación 3D leve
según progreso (solo ≥sm; en móvil fade/translate). Palabras extra ocultas en
móvil por CSS. Cierra con «Cada semana, esto.».

### 2 · Señal (`signal-scene.tsx`)
Chispa (Mascot) cruza la pantalla; a su paso el ruido residual se apaga y 5
titulares reales del Radar (de `RadarItem` reales, curados en config) se alinean
en lista limpia, staggered por rangos de progreso. Cierra con
«De cien ruidos, siete señales.».

### 3 · Sistema → aterrizaje (`system-scene.tsx`)
Las señales se pliegan; aparece el terminal `kata --status` que se "teclea"
línea a línea con datos reales (misma fuente que `JourneyPanel`, extraída a
`src/lib/journey.ts`). Fade final que entrega al masthead.

## Archivos

- `src/config/scrolly.ts` — copy, ruidos, señales (curadas de radar real).
- `src/lib/journey.ts` — `getJourneyStatusLines(subscriberCount)` compartido
  (refactor mínimo de `JourneyPanel` para no duplicar).
- `src/hooks/use-media-query.ts` — gate ≥sm (mismo patrón que reduced-motion).
- `src/components/home/scrolly/` — `scrolly-intro.tsx` (cliente; null si
  reduced-motion), `noise-scene.tsx`, `signal-scene.tsx`, `system-scene.tsx`,
  `use-scene-progress.ts`.
- `src/app/page.tsx` — monta `<ScrollyIntro statusLines={...}/>` antes del
  masthead; pasa las líneas reales por prop.
- `ScrollReveal` gana variante `blur` y se aplica a las secciones que no lo
  tienen.

## Verificación

Navegador real: scroll programático por las 3 escenas (posiciones/opacidades),
aterrizaje en masthead, reduced-motion (intro ausente), viewport móvil (escenas
cortas, sin 3D), 0 errores consola, `eslint` + `tsc` limpios, screenshots en
`.playwright-cli/`.
