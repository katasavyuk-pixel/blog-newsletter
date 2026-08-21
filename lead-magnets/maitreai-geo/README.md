# Recurso `maitreai-geo` — fuente del ZIP

Lo que sirve `/api/download` para el slug `maitreai-geo` es
`maitreai-geo/recurso-maitreai-geo.zip`, en el bucket privado `lead-magnets` de Supabase
Storage.

**`zip/` es exactamente lo que va dentro.** Ni más ni menos: se comprime el directorio entero,
así que no hay lista de exclusiones que se pueda quedar desfasada.

```
zip/README.md               qué es esto y cómo se usa
zip/prompt.md               el prompt de auditoría, para pegar en un agente de código
zip/comprobaciones-geo.md   las 9 comprobaciones y la tabla
```

Este README no va dentro: es documentación del repo.

## Reconstruirlo

```bash
cd lead-magnets/maitreai-geo/zip
rm -f ../recurso-maitreai-geo.zip
zip -q -r ../recurso-maitreai-geo.zip . -x '.*'
```

El `.zip` resultante está en `.gitignore`: es un artefacto derivado y la fuente ya está
versionada. El `-x '.*'` evita colar `.DS_Store`.

Súbelo al bucket `lead-magnets` **sobrescribiendo** `maitreai-geo/recurso-maitreai-geo.zip`. No
hay que tocar la base de datos: la fila apunta a esa ruta y el enlace se firma en cada descarga,
así que el siguiente que pulse se lleva el ZIP nuevo.

## Historia, por si vuelve a pasar

El ZIP se subió a mano el 2026-08-20 con solo `README.md` y `prompt.md`, y su contenido **no se
versionó**. Eso dejó dos agujeros a la vez: nadie podía revisar en un diff qué se entregaba a
quien deja su dirección, y **el vídeo mencionaba unas comprobaciones y una tabla que el ZIP no
llevaba**.

`comprobaciones-geo.md` cierra el segundo. Está construido desde
`~/Developer/Ma-tre/reports/geo/ready-check.md` — el informe real de esa auditoría — y no de
memoria: cada cifra que aparece en él (33 URLs, nueve canonicals, 13 preguntas declaradas, 242
tildes repuestas) sale de ahí.

Y el primero lo cierra este directorio. La regla que queda: **si cambia lo que se entrega,
cambia `zip/` y se reconstruye.** No se edita el ZIP a mano nunca más.
