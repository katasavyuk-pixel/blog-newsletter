# Spec — IntentWizard (Fase 1 del rediseño)

> 2026-08-05, actualizado el 2026-08-06. En producción.
>
> Este documento describía **5 pasos con captura de email** y la clave
> `kata-intent-v2` mucho después de que el código pasara a 4 pasos sin email y a
> `v3`. El paso de email se quitó a propósito: pedirlo antes de haber dado nada
> es el mismo reflejo de landing por el que se quitó el formulario del masthead
> (el porqué está escrito en `src/config/intent.ts`; no volver a añadirlo sin
> releerlo).

## Qué es

Overlay de bienvenida **de una sola visita por sesión** que pregunta a quién
entra qué viene a buscar y le rutea a la sección correspondiente. Aparece solo
la primera vez (guardado en `sessionStorage`, clave `kata-intent-v3`; `?wizard=1` lo fuerza); después
nunca, hasta cerrar la pestaña. Lo dirige **Chispa**, la mascota de la casa: un
núcleo de ascua con ojos que respira (CSS puro, paleta roja) y suelta una línea
por paso.

## Cómo se comporta

- **Visibilidad**: solo cliente. En SSR renderiza `null` (cero hydration
  mismatch). Con `prefers-reduced-motion` no aparece nunca: la home con scroll
  es el fallback tranquilo.
- **Flujo (4 pasos)**, precedido del vuelo de entrada:
  0. **Intro** — Chispa se presenta y propone guiarte (`Empezar`).
  1. **Intención** — 4 tarjetas que rutean: aprender (`/empieza-aqui`),
     resultados (`/sistemas`), actualidad (`/radar`), montar algo
     (`/trabaja-con-nbi`).
  2. **Formato** — leer / ver / mixto. Preferencia guardada, no rutea; solo
     personaliza el cierre.
  3. **Rumbo** — confirma el destino; "Ir a X" (rutea) o "Seguir en la
     portada".
- **Salidas**: "Saltar intro" durante el vuelo, botón "Saltar" (arriba derecha),
  tecla Escape, ruteo y "Seguir en la portada". Todas marcan `seen` y cierran.
- **Estética**: negro cálido + halo rojo (`glow-layer`/`glow-pulse`), Anton
  para titulares, barra de progreso roja, Chispa como guía (CSS puro),
  transiciones con `Motion`.

## Archivos

| Archivo | Rol |
|---|---|
| `src/config/intent.ts` | Fuente única: opciones, hints, rutas, copy, `MASCOT.lines`, y la nota de por qué no hay paso de email. |
| `src/hooks/use-intent-wizard.ts` | Estado vía `useSyncExternalStore` (SSR-safe, sin `setState` en effect). |
| `src/components/wizard/mascot.tsx` | Chispa: orbe de ascua con ojos (CSS, sin dependencias). Tres tamaños (`md`/`lg`/`hero`) y halo gobernable con `--mascot-halo`. |
| `src/components/wizard/intent-wizard.tsx` | Overlay + vuelo de entrada + 4 pasos. Cliente. |
| `src/app/layout.tsx` | Monta `<IntentWizard/>` bajo `MotionProvider`. |
| `src/app/globals.css` | Keyframes de la mascota (`ember-*`) + estáticos ya existentes. |

## Cumplimiento de la casa

- Cero hex en JSX (todo por tokens).
- Copy honesto y sin promesas (`QUE_PUEDO_DECIR.md`): los hints reusan
  posicionamiento ya público. Chispa es ficción de la propia web ("tu último
  fichaje"), no un asistente real prometido.
- Sin dependencias nuevas (Motion ya está; mascota y email reusan lo existente).
- Lint + `tsc --noEmit` verdes. Sin errores de consola en verificación.

## El vuelo de entrada (2026-08-06)

Chispa entra orbitando, converge al hueco que ocupará en el panel, **se acerca
nítida hasta llenar el cuadro** (≈560 px medidos), sostiene un beat mirándote y
solo entonces se desenfoca al atravesar la cámara. Un único `motion.div` que
nunca se desmonta.

**El problema que resolvió.** Antes se veía «un doble difuminado feo», y no era
una sensación:

1. El wrapper se alejaba con `blur(30px)` sobre `scale: 9` *mientras* dentro de
   él el `.glow-layer` del propio `Mascot` llevaba su `filter: blur(80px)`. Un
   `filter` en un ancestro se aplica al subárbol **ya rasterizado**, y va en
   coordenadas locales *antes* del transform: en pantalla eran ≈270 px de
   desenfoque encima de ≈720 px.
2. El aterrizaje **rehacía el mismo desenfoque al revés** (`blur(30)` → nítido).
   Ese era, literalmente, el segundo difuminado.
3. Chispa nunca llegaba a acercarse: se quedaba en `scale 1.18` y saltaba a `9`
   ya borrosa. El primer plano no existía.

**Cómo queda.** `--mascot-halo` llega a 0 **antes** de que el wrapper difumine,
así que nunca hay dos filtros vivos a la vez; el aterrizaje usa keyframes en
**todas** las propiedades, de modo que Motion salta al primer valor de inmediato
y el estado borroso se descarta con ella a `opacity: 0` en vez de destejerse; y
el panel y el bocadillo pierden sus propios `blur`, que sumaban tres desenfoques
concurrentes con curvas distintas. El resplandor ambiental florece justo cuando
ella pasa, así que se disuelve en su propia luz.

Las escalas están calibradas contra `size="hero"` (360 px nativos): el primer
plano llega a ×1,56 y no a ×4,4. Mismo tamaño en pantalla, sin depender de que el
navegador decida re-rasterizar una capa que tiene todo el derecho a estirar.

## Verificación hecha

DOM headless para el flujo; navegador real (`webkit` 1440×900) para el vuelo,
muestreando `getComputedStyle` cada 80 ms durante los 4,6 s — **el `style` inline
no vale como prueba**: por la vía acelerada de Motion se queda en lo que pintó
React mientras el valor real vive en la animación.

- **Exactamente una ventana con `blur > 0`** (4,25 → 4,59 s, pico 12 px).
- El pico nítido llena el cuadro (**563 px**) y ocurre **antes** de esa ventana.
- `--mascot-halo` = 0,098 cuando empieza el desenfoque.
- Fresh session → vuelo + 4 pasos navegables; el ruteo cierra el wizard.
- Con `prefers-reduced-motion` el wizard no se monta.
- `eslint`, `tsc --noEmit` y `npm run build` limpios.

## Decisiones abiertas

Personalidad y copy de Chispa, y si sobra una de las dos intros encadenadas
(wizard → escena 1 del scrollytelling): hoy un visitante nuevo ve las dos.
