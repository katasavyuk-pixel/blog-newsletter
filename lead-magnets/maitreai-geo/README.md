# Recurso `maitreai-geo` — fuente del ZIP

Lo que sirve `/api/download` para el slug `maitreai-geo` es
`maitreai-geo/recurso-maitreai-geo.zip`, en el bucket privado `lead-magnets` de Supabase
Storage. Este directorio es su **fuente**.

## Estado (2026-08-21)

| Archivo | En el repo | En el ZIP subido |
| --- | --- | --- |
| `comprobaciones-geo.md` — las 9 comprobaciones y la tabla | ✅ | ❌ **falta** |
| El prompt de auditoría GEO generalizado | ❌ **falta** | ✅ |
| README del propio ZIP | ❌ **falta** | ✅ |

El ZIP se subió a mano el 2026-08-20 y su contenido nunca se versionó, así que hoy nadie puede
revisar en un diff qué se está entregando a quien deja su dirección, ni regenerarlo si se borra.

Y hay un desajuste con el vídeo: **en cámara se mencionan las comprobaciones y la tabla, y el ZIP
no las lleva.** Por eso existe `comprobaciones-geo.md`: está construido a partir de
`~/Developer/Ma-tre/reports/geo/ready-check.md`, que es el informe real de esa auditoría, no de
memoria.

## Cerrar el desajuste, en dos pasos

**1. Trae el prompt y el README al repo.** Descomprime el ZIP actual desde el dashboard de
Supabase y copia los dos archivos aquí. A partir de ahí la fuente vive en git y el ZIP se
reconstruye solo.

**2. Reconstruye y vuelve a subir:**

```bash
cd lead-magnets/maitreai-geo
zip -r recurso-maitreai-geo.zip . -x README.md -x '*.zip'
```

Súbelo al bucket `lead-magnets` **sobrescribiendo** `maitreai-geo/recurso-maitreai-geo.zip`. No
hace falta tocar la base de datos: la fila apunta a esa ruta y el enlace se firma en cada
descarga, así que el siguiente que pulse se lleva el ZIP nuevo.

> El `-x README.md` es a propósito: este archivo es documentación interna del repo y no tiene por
> qué ir dentro de lo que se descarga el lector. El README que sí va dentro es el otro, el que
> explica cómo usar el prompt.

**3. Hasta que el paso 2 esté hecho**, `content/posts/maitreai-geo.mdx` **no promete** las
comprobaciones. Se quitó esa frase el 2026-08-21 justo por esto. Cuando el ZIP nuevo esté
arriba, se vuelve a poner — y no antes: prometer en un artículo algo que el lector cobra
*después* de dar su dirección es la peor forma de descubrir que no estaba.
