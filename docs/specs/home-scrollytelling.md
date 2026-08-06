# Home scrollytelling (F2)

Fecha: 2026-08-05 · Estado: **implementado y verificado en navegador real**
(2026-08-06; segundo pase el mismo día — ver «Pase 2»)

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

### 1 · Ruido (`noise-scene.tsx`, 140vh / 100vh móvil)
24 titulares de hype repartidos en **tres planos de profundidad** (`band` en
`noise-layout.ts`): el lejano pequeño y con `blur-[2px]` fijo, el cercano en
`text-2xl/4xl font-black`. El campo hace dolly-in con rotación 3D leve (solo ≥sm)
y cada palabra deriva **hacia fuera** desde el centro, así el empuje lee como
tres dimensiones y no como un zoom. Cierra implosionando hacia un punto mientras
sube «Cada semana, esto.».

### 2 · Señal (`signal-scene.tsx`, 190vh / 130vh móvil)
**Dos pases.** En el primero (0.04→0.38) Chispa cruza el cuadro con estela de 5
brasas y un haz anclado a su `x`, y el ruido residual se apaga columna a columna
a su paso. En el segundo (0.46→0.76) **baja por el lateral de la lista y cada
titular se enciende cuando ella llega a su altura** — el reparto de rangos sale
de `ROW_STEP`, no de un ajuste a ojo. Los 7 ítems son la edición
`radar-2026-08-04` verbatim. Cierra con «De cien ruidos, siete señales.».

### 3 · Sistema → aterrizaje (`pipeline-scene.tsx`, 170vh / 120vh móvil)
El **pipeline del Radar dibujado**: `recolecta → verifica → publica`, con los
conectores trazándose por `pathLength` y una brasa recorriéndolos. En el gate,
un ítem sale rebotado con ✗ y la razón («título reescrito»), que es el modo de
fallo real que costó dos ediciones. El terminal `kata --status` sobrevive como
**salida de la máquina**, más pequeño y abajo, tecleado por `clip-path` y con los
mismos datos que `JourneyPanel` (`getJourneyStatusLines()`). Entrega al masthead
con `section-fade-bottom`.

## Archivos

- `src/config/scrolly.ts` — copy, ruidos, señales (curadas de radar real).
- `src/lib/journey.ts` — `getJourneyStatusLines(subscriberCount)` compartido
  (refactor mínimo de `JourneyPanel` para no duplicar).
- `src/hooks/use-media-query.ts` — gate ≥sm (mismo patrón que reduced-motion).
- `src/components/home/scrolly/` — `scrolly-intro.tsx` (cliente; null si
  reduced-motion), `noise-scene.tsx`, `noise-layout.ts`, `signal-scene.tsx`,
  `pipeline-scene.tsx`, `scene-chrome.tsx`, `use-scene-progress.ts`,
  `use-scene-range.ts`.
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

## Pase 2 (2026-08-06): «lo veo muy simplón»

Petición de Kata. El diagnóstico, mirando el código y no la pantalla:

1. **Nada llevaba easing.** `transform()` interpola linealmente entre stops, y la
   constante `EASE` estaba exportada en `scene-chrome.tsx` **sin un solo
   consumidor**. Todos los movimientos de las tres escenas arrancaban y paraban
   en seco. Es el arreglo de mayor efecto por línea escrita: `useSceneRange` gana
   un 4º parámetro `ease` opcional —`transform` acepta una función o una por
   tramo— que **por defecto sigue siendo lineal**, así que nada cambió de forma
   en silencio; se aplicó beat a beat.
2. **Fondo `bg-dark` liso, sin una capa de luz**, teniendo el repo `.glow-layer`
   en producción. De ahí `SceneAtmosphere`: dos discos rojos fuera de cuadro
   respirando con el progreso. **Techo: dos capas con blur por escena, y
   hermanas** — un `filter` en un ancestro vuelve a difuminar todo el subárbol ya
   rasterizado, que es justo lo que ensuciaba la entrada del wizard.
3. **La escena 2 no cumplía lo que prometía**: las filas corrían con un
   temporizador propio (`0.2 + i*0.062`) mientras Chispa volaba por otro lado. El
   acto afirmaba que se estaba filtrando y enseñaba dos cosas sin relación.
4. **La escena 3 era el masthead otra vez**: el mismo panel `kata --status`,
   idéntico, 300 px por encima del `JourneyPanel` que introduce.
5. Tipografía: los 24 titulares iban todos a `text-sm/base`, así que no había
   muro de hype que sostener. Siguen en Inter y no en Anton — la regla de la casa
   (Anton se come las tildes en mayúsculas), y de paso el ruido se queda con la
   tipografía genérica y solo la voz de Kata se lleva la de display.

**El dial no se movió**: 500vh escritorio / 350vh móvil, igual que tras
`b772c44`. La escena 3 se llevó lo que soltó la 1.

### Verificado en navegador (webkit, 1440×900 y 390×844)

- Progreso **monótono** en 6 puntos por escena, y **ninguna animación colgada de
  un `ViewTimeline`** (`element.getAnimations()`, no el `style` inline: por la
  vía acelerada el atributo miente).
- La brasa recorre el pipeline de verdad: `cx` −20 → 258 → 588 → 898.
- Intro = 5.00 pantallas exactas en escritorio, 3.50 en móvil.
- Reduced-motion: 0 escenas, documento 5309 px frente a 9777 px.
- 0 px de overflow horizontal en ambos anchos; `audit-ssr.mjs` sin problemas y
  los titulares de hype **siguen fuera** del HTML servido.

### Dos cosas que solo se ven midiendo

- **`offsetTop` no sirve para saltar a un progreso concreto.** Las escenas viven
  dentro del `<div className="relative">` de `ScrollyIntro`, que es su
  `offsetParent`, así que `offsetTop` es relativo a él y no al documento. Las
  primeras capturas salieron a un progreso menor del pedido y parecía que el
  pipeline no avanzaba. Usar `getBoundingClientRect().top + scrollY`.
- **El texto en SVG no se ajusta solo.** `url verbatim, o no hay PR` se salía de
  su caja en escritorio y `título reescrito` se salía del viewBox en móvil. Las
  dos geometrías llevan ahora el ancho calculado contra la cadena más larga; al
  tocar el copy de `PIPELINE_STEPS` hay que volver a mirarlo.
