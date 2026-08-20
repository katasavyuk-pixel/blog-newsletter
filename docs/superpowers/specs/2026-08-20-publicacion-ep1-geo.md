# Especificación — Publicación EP1 GEO

## Objetivo

Conectar el vídeo de YouTube sobre la auditoría GEO de MaitreAI con el artículo del blog, el
recurso descargable generalizado y la newsletter, sin prometer que una IA recomendará ningún
producto.

## Alcance

- Publicar el post `maitreai-geo` cuando el contenido esté listo.
- Hacer visible `stack-geo` como sistema publicado y enlazarlo al post.
- Registrar el ZIP `maitreai-geo` en el bucket privado y en `public.resources`.
- Mantener el email gate y el doble opt-in existentes.
- Dejar el ID de YouTube pendiente si todavía no existe.

## Fuera de alcance

- Cambios de schema, auth, RLS o permisos.
- Acceso a datos de clientes o secretos.
- Deploy manual si el push automático del repositorio ya está activo.
- Publicar una afirmación de recomendación garantizada.

## Archivos previstos

- `content/posts/maitreai-geo.mdx`
- `src/config/library.ts`
- `supabase/seeds/resources.sql`
- `docs/superpowers/specs/2026-08-20-publicacion-ep1-geo.md`
- Paquete de publicación en el repositorio de vídeo.

## Criterios de aceptación

1. El post no contiene estado de borrador ni enlaces rotos.
2. La tarjeta `stack-geo` resuelve contra el post publicado.
3. El recurso usa el mismo slug `maitreai-geo` en contenido, Storage y base de datos.
4. El ZIP solo contiene el README y el prompt generalizado.
5. Typecheck, lint y build pasan.
6. `/blog/maitreai-geo` y `/recursos` responden correctamente después del despliegue.
7. El ID real de YouTube se añade en una actualización separada cuando exista.
