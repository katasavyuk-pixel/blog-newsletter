# Prompt de auditoría GEO — el artefacto NO está aquí

`supabase/seeds/resources.sql` declara este directorio como origen de
`maitreai-geo/recurso-maitreai-geo.zip`, el fichero que sirve `/api/download`.

**Ese ZIP vive solo en el bucket privado `lead-magnets` de Supabase Storage. No está
versionado.** Se subió a mano el 2026-08-20, antes de publicar el episodio.

Esto es una deuda, no una decisión. Consecuencias mientras siga así:

- No se puede revisar en un diff qué se está entregando a quien deja su email.
- No se puede regenerar si el objeto se borra: habría que reescribirlo de memoria.
- El seed apunta a una ruta cuyo contenido nadie puede comprobar desde el repo.

**Qué hacer:** dejar aquí el prompt generalizado y el README que van dentro del ZIP,
y reconstruirlo desde estas fuentes. No se ha hecho de forma automática a propósito:
inventar un contenido plausible crearía una fuente que contradice el fichero que la
gente ya se está descargando, que es peor que este aviso.

Comprobación de que el objeto sigue vivo, sin descargarlo:
Supabase → Storage → bucket `lead-magnets` → carpeta `maitreai-geo/`.
