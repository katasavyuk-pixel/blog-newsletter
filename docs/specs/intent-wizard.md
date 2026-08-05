# Spec — IntentWizard (Fase 1 del rediseño)

> 2026-08-05. Primera pieza del rediseño visual. No se despliega hasta revisión
> en localhost.

## Qué es

Overlay de bienvenida **de una sola visita por sesión** que pregunta a quién
entra qué viene a buscar y le rutea a la sección correspondiente. Aparece solo
la primera vez (guardado en `sessionStorage`, clave `kata-intent-v2`); después
nunca, hasta cerrar la pestaña. Lo dirige **Chispa**, la mascota de la casa: un
núcleo de ascua con ojos que respira (CSS puro, paleta roja) y suelta una línea
por paso.

## Cómo se comporta

- **Visibilidad**: solo cliente. En SSR renderiza `null` (cero hydration
  mismatch). Con `prefers-reduced-motion` no aparece nunca: la home con scroll
  es el fallback tranquilo.
- **Flujo (5 pasos)**:
  0. **Intro** — Chispa se presenta y propone guiarte (`Empezar`).
  1. **Intención** — 4 tarjetas que rutean: aprender (`/empieza-aqui`),
     resultados (`/sistemas`), actualidad (`/radar`), montar algo
     (`/trabaja-con-nbi`).
  2. **Formato** — leer / ver / mixto. Preferencia guardada, no rutea; solo
     personaliza el cierre.
  3. **Email — captura real** — `SubscribeForm` (Turnstile + consent + doble
     opt-in, el mismo del resto del sitio). Copy "recursos gratis". Botón de
     salida "No, gracias → entrar ya".
  4. **Rumbo** — confirma el destino; "Ir a X" (rutea) o "Seguir en la
     portada".
- **Salidas**: botón "Saltar" (arriba derecha), tecla Escape, ruteo, "Seguir
  en la portada", "No, gracias". Todas marcan `seen` y cierran.
- **Estética**: negro cálido + halo rojo (`glow-layer`/`glow-pulse`), Anton
  para titulares, barra de progreso roja, Chispa como guía (CSS puro),
  transiciones con `Motion`.

## Archivos

| Archivo | Rol |
|---|---|
| `src/config/intent.ts` | Fuente única: opciones, hints, rutas, copy, `MASCOT.lines`, `EMAIL_STEP`. |
| `src/hooks/use-intent-wizard.ts` | Estado vía `useSyncExternalStore` (SSR-safe, sin `setState` en effect). |
| `src/components/wizard/mascot.tsx` | Chispa: orbe de ascua con ojos (CSS, sin dependencias). |
| `src/components/wizard/intent-wizard.tsx` | Overlay + 5 pasos + guiado por Chispa. Cliente. |
| `src/app/layout.tsx` | Monta `<IntentWizard/>` bajo `MotionProvider`. |
| `src/app/globals.css` | Keyframes de la mascota (`ember-*`) + estáticos ya existentes. |

## Cumplimiento de la casa

- Cero hex en JSX (todo por tokens).
- Copy honesto y sin promesas (`QUE_PUEDO_DECIR.md`): los hints reusan
  posicionamiento ya público. Chispa es ficción de la propia web ("tu último
  fichaje"), no un asistente real prometido.
- Sin dependencias nuevas (Motion ya está; mascota y email reusan lo existente).
- Lint + `tsc --noEmit` verdes. Sin errores de consola en verificación.

## Verificación hecha (DOM, headless)

- Fresh session → intro con Chispa; flujo 5 pasos completo navegable.
- Email step renderiza el `SubscribeForm` real (email input + consent + Turnstile).
- Ruteo funciona y cierra el wizard. (Este modelo no lee imágenes; las capturas
  quedan en `.playwright-cli/*.png` para revisión visual humana.)

## Revisión pendiente en localhost

```bash
npm run dev   # http://localhost:3000 — ventana privada para sesión limpia
```

Decidir tras verlo: personalidad/copy de Chispa, nº de pasos, si el email
molesta o encaja, redacción de los hints.