---
name: post-desde-video
description: Convierte un vídeo del canal en su entrada de blog y su recurso descargable — post MDX, lead magnet en /recursos, y la tarjeta de la Biblioteca de Sistemas. Úsala cuando un vídeo ya grabado tenga un artefacto técnico que publicar, o cuando haya que preparar el material del blog antes de publicar un vídeo.
---

# Del vídeo al blog

El post **no es una transcripción**. Es el apéndice técnico de verdad: lo que no cabía en el
montaje, con el detalle que alguien puede copiar y aplicar. Si el post repite lo que ya se dice en
cámara, no aporta nada y encima canibaliza el vídeo.

Carga la skill **`marca-kata`** (`VOZ.md`, `QUE_PUEDO_DECIR.md`, `EMBUDO.md`) antes de escribir.

## Antes de escribir: ¿toca post?

**Solo si el vídeo construye o cambia algo concreto** — código, un sistema, una plantilla. Muchos
vídeos son proceso o reflexión y no dejan artefacto. Publicar un post vacío por cumplir la cadencia
desgasta el blog y no capta a nadie.

Si el vídeo no deja nada, dilo y para. Es una respuesta válida.

## Las tres piezas

### 1. El post — `content/posts/<slug>.mdx`

- Sale del **apéndice técnico** del episodio, que ya está escrito en su carpeta de
  `Youtube:RedesSociales/episodios/`. Empieza por ahí, no por la transcripción.
- Aquí **sí** se puede ser técnico de verdad: nombres reales, código, rutas. La regla de "explicar
  sin tecnicismos" es para lo que se dice en voz alta, no para lo que se escribe.
- `draft: false` y `youtubeId` real cuando se publique. Publicar = añadir el `.mdx`; el listado,
  el sitemap y el RSS se actualizan solos.
- Si hay un borrador anterior sobre el mismo tema, **decide**: lo sustituye o lo reescribe. No
  dejes dos posts vivos compitiendo por la misma consulta.

### 2. El recurso — tabla `resources`

- Es el lead magnet del CTA del vídeo, así que **tiene que existir y coincidir con lo que se
  promete en cámara**, incluido el número si se dice uno.
- Específico del vídeo, no genérico: un recurso atado al episodio convierte mucho mejor.
- Bucket privado `lead-magnets`, `published: true`, gated por email.
- Se da entero y sin letra pequeña.

### 3. La tarjeta — `src/config/library.ts` (`LIBRARY_ITEMS`)

- Puede existir ya como `status: "en-construccion"`, **pre-reservada a propósito** para generar
  expectativa antes del vídeo. No la crees sin mirar: probablemente ya está.
- Al publicar: pasa a `disponible` **y revisa el blurb**. Casi siempre describe una versión
  anterior del episodio, porque se escribió antes de que el guion terminara de moverse. Cambiar
  solo el `status` deja una tarjeta que miente.

## Orden y bloqueo

**El post y el recurso van publicados ANTES que el vídeo.** El CTA nombra el dominio en cámara y
no admite un enlace roto ni un "próximamente".

Si el vídeo incluye una toma de pantalla navegando por el blog, esa toma se graba **después** de
publicar el recurso y se inserta en montaje sobre el audio del CTA ya grabado — no hace falta
regrabar la voz.

## Verificación

- `npm run build` y `npm run lint` en verde.
- El post sale en el listado, en el sitemap y en el RSS.
- La descarga funciona de punta a punta: alta → correo → enlace firmado → archivo.
- El enlace del CTA del vídeo (`/yt` → `/recursos?utm_source=youtube`) resuelve.
