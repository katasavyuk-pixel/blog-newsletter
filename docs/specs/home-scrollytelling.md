# Home scrollytelling (F2)

Fecha: 2026-08-05 · Estado: **implementado y verificado en navegador real** (2026-08-06)

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

## La trampa que casi se cuela: motion acelera esto y lo rompe

Escrito con la forma normal —`useTransform(progress, [a, b], [x, y])`— **nada
funcionaba, y funcionaba de una manera que no se ve mirando**: las escenas
animaban, solo que con los valores equivocados.

Motion v12 compila esos `useTransform` a animaciones WAAPI ligadas al scroll
cuando la propiedad es acelerable (`opacity`, `transform`, `filter`). El timeline
que construye es un **`ViewTimeline` anclado al elemento animado**, y aquí cada
elemento vive dentro de un viewport `position: sticky`. Un elemento clavado
apenas recorre el viewport, así que su ViewTimeline apenas avanza: medido, con la
página al 50 % de la escena el `currentTime` de la animación iba por el 20,6 %, y
a partir de ahí retrocedía. El `offset: ["start start", "end end"]` de
`useScroll` no llegaba a la animación compilada.

El síntoma en pantalla: filas que se desvanecían después de haber entrado, el
ruido resucitando y el titular de cierre apagándose justo al final. Todo
plausible, ninguno visible sin medir.

**Fix**: `src/components/home/scrolly/use-scene-range.ts`. Misma firma, pero pasa
una **función** a `useTransform` en vez de dos arrays — no queda nada que
compilar a keyframes, así que el valor se calcula por frame desde el progreso que
pedimos. Usa `transform` de motion como interpolador, así que unidades y strings
(`blur(7px)`, `-24vw`, `inset(0 100% 0 0)`) siguen igual.

**No volver a `useTransform` con arrays dentro de un `sticky`.** Es la única
regla de este directorio.

Segunda trampa, misma familia: **una animación CSS sobre `opacity` gana a un
estilo inline**, así que `animate-pulse` en el mismo elemento que la opacidad de
motion se comía la puerta del cursor del terminal. Va en un `<span>` interior; las
dos opacidades se multiplican.

## Verificación hecha (2026-08-06)

Navegador real, `chromium` 1440×900 y `webkit` 390×844:

- **Progreso real medido** en 6 puntos por escena (`0.05` … `0.99`), comprobando
  que cada valor es monótono: el ruido entra y no vuelve, las 7 señales entran
  escalonadas y se quedan en 1, el terminal imprime línea a línea y el cursor solo
  aparece pasado el final del tecleo.
- **Reduced-motion**: 0 escenas en el DOM, 0 enlaces de salto, altura de documento
  5321 px frente a 10959 px. La intro no existe, no está atenuada.
- **0 errores de consola** y ningún aviso de hidratación, en ambos navegadores.
- **0 px de overflow horizontal** en móvil y escritorio.
- Enlace "Saltar intro" aterriza en el masthead con el `h1` en pantalla.
- `node scripts/geo/audit-ssr.mjs http://localhost:3000` sin problemas, y ninguno
  de los titulares de hype aparece en el HTML servido.
- `eslint`, `tsc --noEmit` y `npm run build` limpios.
