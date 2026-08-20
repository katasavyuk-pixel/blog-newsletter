# Pitfalls — cosas que costaron tiempo y no deberían costarlo dos veces

> Extraído de `CLAUDE.md` el 2026-08-21, sin editar. Es la sección que más se consulta y la
> que menos tiene que ver con "cómo trabajar en este repo", así que vive mejor aquí.

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

**Añadidos 2026-08-06 (capa cinemática). Los dos primeros animaban «bien» en
pantalla y estaban mal; solo se vieron midiendo el DOM:**

- **Nunca `useTransform(progress, [a, b], [x, y])` dentro de un `position:
  sticky`.** Motion v12 lo compila a una animación WAAPI ligada al scroll cuando la
  propiedad es acelerable (`opacity`/`transform`/`filter`), y el timeline que
  construye es un **`ViewTimeline` anclado al elemento animado**. Un elemento
  clavado apenas recorre el viewport, así que su timeline apenas avanza: medido,
  con la página al 50 % de la escena el `currentTime` iba por el **20,6 %** y a
  partir de ahí retrocedía; el `offset` de `useScroll` no llegaba a la animación.
  Fix: `src/components/home/scrolly/use-scene-range.ts` pasa una **función** en vez
  de dos arrays, así no queda nada que compilar a keyframes.
- **Una animación CSS sobre `opacity` gana a un estilo inline.** `animate-pulse`
  en el mismo elemento que una opacidad de motion se come la puerta: el cursor del
  terminal parpadeaba desde el principio de la escena. Va en un hijo; se multiplican.
- **Para depurar animaciones de motion, lee `element.getAnimations()`**, no el
  `style` inline: con la vía acelerada el atributo se queda en el valor
  renderizado por React mientras el valor real vive en la animación. Comparar
  `getComputedStyle` con el inline es lo que destapó el bug del ViewTimeline.
- **`grep -c` sobre el HTML de Next cuenta LÍNEAS, y el HTML va en una sola.**
  Sirve para presencia/ausencia (0 vs ≥1), nunca para contar. Es distinto del aviso
  de más arriba (que va de los strings duplicados en el payload de React).
- **Next 16 no deja levantar un segundo `next dev` para el mismo directorio.**
  Sale `Another next dev server is already running` con el PID. El `next-server`
  del 3000 en esta máquina **es de este proyecto**, no de NBI-WEB como decía una
  nota vieja.

**Añadidos 2026-08-06, segundo pase (Chispa + scrollytelling):**

- **Un `filter` en un ancestro vuelve a difuminar el subárbol ya rasterizado, y
  se aplica ANTES del transform.** Es la causa del «doble difuminado» del wizard:
  `blur(30px)` en el wrapper que contiene el `.glow-layer blur(80px)` del
  `Mascot`, todo multiplicado por `scale: 9` → ≈270 px encima de ≈720 px. Regla:
  capas con blur **hermanas, nunca anidadas**. Para poder apagar el halo desde
  fuera se usa `--mascot-halo`, y **va en un padre**, no en el elemento con
  `glow-pulse` — una animación CSS sobre `opacity` se come el estilo inline (es
  la misma trampa del cursor del terminal; anidadas se multiplican).
- **Para descartar un estado de animación sin que se vea, usa keyframes.** Motion
  salta al primer valor de un array de inmediato. El aterrizaje del wizard pone
  *todas* las propiedades como keyframes, así el `scale 6.8 / blur(12px)` se tira
  con ella a `opacity: 0` en vez de destejerse — que es lo que producía el
  segundo desenfoque.
- **`transform()` de motion acepta `{ ease }`** (una función o una por tramo,
  `input.length - 1`), y `cubicBezier`/`easeIn`/`easeOut`/`easeInOut` se exportan
  desde `motion/react`. Usar **funciones y no tuplas** en un array evita pelearse
  con el tipo `Easing`. Sin esto todo interpola lineal y arranca y para en seco.
- **`pathLength` es un valor de primera clase de Motion en SVG** (lo compila a
  `stroke-dashoffset`). En cambio `cx`/`cy` van **como props, no en `style`**:
  las propiedades geométricas CSS del mismo nombre no son algo en lo que apoyarse.
- **`offsetTop` no sirve para saltar a un progreso de escena.** Las escenas viven
  dentro del `<div className="relative">` de `ScrollyIntro`, que es su
  `offsetParent`. Las primeras capturas salieron a un progreso menor del pedido y
  parecía que el pipeline no avanzaba. `getBoundingClientRect().top + scrollY`.
- **El texto SVG no se ajusta solo.** Dos cadenas se salieron de su caja
  (escritorio) y del viewBox (móvil). Al tocar `PIPELINE_STEPS` hay que volver a
  medir el ancho contra la cadena más larga.
- **Una captura a 1× no vale para juzgar nitidez.** Un primer plano parecía
  rasterizado y blando en las dos versiones; a `deviceScaleFactor: 2` salía
  nítido en ambas. Casi lleva a "arreglar" un bug inexistente.
- **La herramienta de lectura de imágenes cachea por ruta.** Dos capturas
  distintas del mismo fichero se leyeron idénticas y parecía que el build no
  había entrado. Escribir a un nombre nuevo, o confirmar contra el DOM.

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
