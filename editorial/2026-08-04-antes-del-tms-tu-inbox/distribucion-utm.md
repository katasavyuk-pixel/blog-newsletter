# Distribución y enlaces UTM — "Antes del TMS hay otro sistema: tu inbox"

> Sugerencias. Nada de esto está publicado ni programado.
> Campaña: `antes-del-tms` · Fecha objetivo: por decidir (el post está en `draft: true`).

## Por qué el `utm_source` importa aquí más de lo normal

No es solo analítica. El formulario de alta lee `utm_source` de la URL y lo manda al endpoint,
que lo concatena al origen guardado en la base de datos:

- `src/components/newsletter/subscribe-form.tsx` → `new URLSearchParams(window.location.search).get("utm_source")`
- `src/app/api/subscribe/route.ts` → `source = ` `` `${baseSource}:${utmSource}` ``

Es decir, un alta desde Instagram queda como `recursos:instagram` en `subscribers.source`. Por
eso el valor tiene que ser **corto, en minúsculas, sin espacios ni acentos, y siempre el
mismo** — si un día escribes `Instagram` y otro `ig`, la atribución se parte en dos y no hay
forma de juntarla luego. Máximo 80 caracteres (validación Zod), pero con 10 sobra.

Los parámetros `utm_medium` y `utm_campaign` **no** se guardan en la base de datos: solo los ve
Vercel Web Analytics. Aun así conviene ponerlos, para poder separar el tráfico del post del
tráfico del recurso dentro del mismo canal.

## URLs canónicas

| Destino | URL |
|---|---|
| Post | `https://kata.ianexora.com/blog/antes-del-tms-tu-inbox` |
| Recurso (CTA primario) | `https://kata.ianexora.com/recursos` |
| Diagnóstico / NBI (CTA secundario) | `https://kata.ianexora.com/trabaja-con-nbi` |
| Atajo ya existente | `https://kata.ianexora.com/yt` → redirige 307 a `/recursos?utm_source=youtube` |

## YouTube

`/yt` ya lleva el `utm_source=youtube` incorporado (redirect en `next.config.ts`), así que para
el enlace del recurso **no hace falta construir nada**: usa el atajo, que además cabe en un
comentario y se lee bien en voz alta.

| Sitio | Enlace |
|---|---|
| Descripción, primera línea (recurso) | `https://kata.ianexora.com/yt` |
| Descripción, enlace al artículo | `https://kata.ianexora.com/blog/antes-del-tms-tu-inbox?utm_source=youtube&utm_medium=video&utm_campaign=antes-del-tms` |
| Comentario fijado (recurso) | `https://kata.ianexora.com/yt` |
| Tarjeta final / "más info" (NBI) | `https://kata.ianexora.com/trabaja-con-nbi?utm_source=youtube&utm_medium=video&utm_campaign=antes-del-tms-nbi` |

Sugerencia de comentario fijado: *"El inventario de campos y el filtro de 3 preguntas, en
checklist: kata.ianexora.com/yt — te lo mando por email, con confirmación y sin spam."*

Si algún día quieres separar el tráfico por vídeo sin ensuciar `subscribers.source`, hazlo con
`utm_campaign` (`antes-del-tms`), nunca metiendo el título del vídeo en `utm_source`.

## LinkedIn

Es donde más probable es que esté el lector nº 1 de esta pieza (alguien con una operación en
marcha), así que aquí el post nativo debe aguantarse solo y el enlace ir en el primer
comentario — el alcance cae cuando el enlace va en el cuerpo.

| Sitio | Enlace |
|---|---|
| Primer comentario (artículo) | `https://kata.ianexora.com/blog/antes-del-tms-tu-inbox?utm_source=linkedin&utm_medium=social&utm_campaign=antes-del-tms` |
| Primer comentario (recurso, si el post es de captación) | `https://kata.ianexora.com/recursos?utm_source=linkedin&utm_medium=social&utm_campaign=antes-del-tms` |
| Sección "Destacado" del perfil | `https://kata.ianexora.com/recursos?utm_source=linkedin&utm_medium=perfil&utm_campaign=evergreen` |
| Mensaje directo / respuesta a comentario (NBI) | `https://kata.ianexora.com/trabaja-con-nbi?utm_source=linkedin&utm_medium=social&utm_campaign=antes-del-tms-nbi` |

Gancho sugerido para el post nativo (sin cifras): *"Compras un TMS para ordenar la operación y
el lunes el dato sigue entrando igual: alguien lee un correo y lo teclea. El software que
compras empieza donde el trabajo repetitivo ya ha terminado."*

## Instagram

Instagram no deja enlaces clicables en el pie, así que todo pasa por el enlace de la bio y por
stickers en stories. Dos `utm_medium` distintos para poder separarlos:

| Sitio | Enlace |
|---|---|
| Enlace de la bio (permanente) | `https://kata.ianexora.com/recursos?utm_source=instagram&utm_medium=bio&utm_campaign=evergreen` |
| Bio durante la semana de campaña | `https://kata.ianexora.com/blog/antes-del-tms-tu-inbox?utm_source=instagram&utm_medium=bio&utm_campaign=antes-del-tms` |
| Sticker de enlace en stories | `https://kata.ianexora.com/recursos?utm_source=instagram&utm_medium=stories&utm_campaign=antes-del-tms` |
| Reel / carrusel: enlace en el pie (no clicable, para copiar) | `kata.ianexora.com/recursos` |

En el pie del reel, el enlace sin UTM a propósito: nadie va a teclear a mano una URL con cuatro
parámetros, y si la copia mal la atribución se pierde igual. El sticker de stories es el que
lleva la atribución.

## Newsletter (para cerrar el círculo)

Los enlaces del email ya van con `utm_source=newsletter` en `newsletter.md`. Sirve para
distinguir en Vercel Web Analytics las visitas al post que vienen del correo de las que vienen
de redes.

## Convención, para no partir la atribución

- `utm_source`: **el canal**, siempre el mismo valor — `youtube` · `linkedin` · `instagram` ·
  `newsletter`. Minúsculas, sin acentos, sin espacios.
- `utm_medium`: **la superficie dentro del canal** — `video` · `social` · `bio` · `stories` ·
  `perfil` · `email`.
- `utm_campaign`: **la pieza** — `antes-del-tms` para el contenido, `antes-del-tms-nbi` para el
  CTA secundario (así se puede medir el interés en NBI por separado), `evergreen` para los
  enlaces permanentes de perfil/bio.
- Los enlaces **internos** del sitio (post → recursos, home → post) **no llevan UTM**: solo
  ensucian el `source` de un suscriptor que ya estaba dentro.
