# Lead magnet — 25 datos que tu equipo no debería copiar manualmente desde emails logísticos

Recurso descargable para **responsables de tráfico y operaciones** de empresas de transporte.
Nicho: NBI aplicado a logística (extracción de datos desde el correo).

**Publicado desde el 2026-08-05.** `supabase/seeds/resources.sql` lo inserta con
`published: true`, así que aparece en `/recursos` y se sirve con descarga firmada tras
confirmar el email.

> Esto decía *"no está publicado ni enlazado desde ninguna parte del sitio"* y llevaba
> semanas siendo falso. Corregido el 2026-08-21.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Fuente HTML, A4, lista para imprimir o para "Guardar como PDF" desde el navegador. |
| `25-datos-emails-logisticos.pdf` | PDF descargable, 7 páginas, A4. |

## Contenido (7 páginas)

1. Portada + para quién es + cómo usarlo.
2. Checklist, bloques **A** (identificación y partes, 1-6) y **B** (fechas, horas y ventanas, 7-11).
3. Checklist, bloques **C** (carga, unidades y medidas, 12-17) y **D** (dinero y condiciones, 18-21).
4. Checklist, bloque **E** (documentación y trazabilidad, 22-25) + recuento + señales de prioridad.
5. **Filtro de prioridad de 3 preguntas** (volumen · coste del error · variabilidad) + tabla de los 4 cuadrantes.
6. **El flujo**: inbox → extracción → revisión humana → dato validado.
7. **CTA único**: traer 10 emails anonimizados a cambio de una revisión.

## Los dos archivos son fuentes independientes

Aquí no hay build. El HTML y el PDF se escribieron por separado y **dicen lo mismo a mano**:
si editas uno, edita el otro. Es deuda técnica consciente, y el motivo está abajo.

### Por qué el PDF no se generó desde el HTML

La sesión en la que se creó esto no tenía permiso para ejecutar procesos (ni `node`, ni
`python3`, ni un navegador headless), así que no se pudo correr ningún conversor HTML→PDF.
El PDF está **escrito a mano como PDF 1.4 en ASCII puro**:

- Fuentes base-14 (`Helvetica`, `-Bold`, `-Oblique`) con `/Encoding /WinAnsiEncoding`.
- Los acentos van como **escapes octales** (`\341` = á, `\363` = ó, `\361` = ñ, `\277` = ¿…),
  no como UTF-8. Por eso el fichero es ASCII y las tablas `xref` cuadran al byte.
- Streams sin comprimir y `/Length` con relleno de ceros a 10 dígitos, para que corregir un
  valor no desplace los offsets del resto del fichero.

**Si tocas el PDF a mano, cuidado:** cualquier cambio que altere el número de bytes de un
stream invalida `/Length` y la tabla `xref`. Los cambios de posición son seguros solo si
mantienen el mismo número de dígitos (p. ej. `716` → `692`).

### Cómo regenerar el PDF como es debido

Cuando haya un entorno con permisos de ejecución, lo sensato es tirar el PDF hecho a mano y
generarlo desde `index.html`, que pasa a ser la única fuente:

```bash
# Opción A — Chrome/Chromium headless
chrome --headless --disable-gpu \
  --print-to-pdf=25-datos-emails-logisticos.pdf \
  --no-pdf-header-footer \
  index.html

# Opción B — Playwright
npx playwright pdf index.html 25-datos-emails-logisticos.pdf --format=A4

# Opción C — WeasyPrint
weasyprint index.html 25-datos-emails-logisticos.pdf
```

El HTML ya trae `@page { size: A4; margin: 0 }`, saltos de página por sección y
`print-color-adjust: exact` para que la portada oscura y el panel rojo del CTA no salgan en
blanco.

## Marca

Tokens derivados de `src/app/globals.css` (paleta cine negro/rojo):
`#0b0608` fondo, `#f6efec` texto, `#e11423` acento **de superficie**, `#ff3b4e` para texto rojo
sobre oscuro. La portada y el CTA van en oscuro/rojo; el cuerpo va sobre blanco a propósito,
porque una checklist se imprime.

Tipografía: Helvetica/Arial en lugar de Inter + Anton. Motivo: en el PDF, meter Inter y Anton
obligaría a incrustar y subsetear las fuentes, que no se podía hacer sin ejecutar código. El
HTML usa la misma familia para que los dos documentos se vean iguales.

## Pendiente antes de publicar

- [ ] Pasar la checklist de `~/Developer/Marca-Personal/QUE_PUEDO_DECIR.md` (no se pudo leer en
      la sesión que creó esto: fuera del directorio de trabajo). Es obligatorio antes de publicar.
- [ ] Decidir el destino: `/recursos` como lead magnet con descarga firmada (tabla `resources` +
      bucket privado, ver `CLAUDE.md`), o descarga suelta.
- [ ] Si va a `/recursos`: dar de alta la fila en `resources` y subir el PDF al bucket. Nada de
      esto se ha tocado.
- [ ] Confirmar que `k.savyuk@ianexora.com` es el buzón que quieres para el CTA, y que hay alguien
      detrás para responder.
- [ ] Regenerar el PDF desde el HTML (arriba) y borrar esta sección de deuda técnica.

## Comprobado

- Las 7 páginas del PDF renderizan: acentos correctos, sin texto solapado, sin desbordes.
- `xref` y `startxref` verificados contra los offsets reales del fichero (`grep -b`).
- Sin cifras inventadas: no hay porcentajes de acierto, ni número de clientes, ni testimonios.
  Los únicos números son estructurales (25 campos, 3 preguntas, 10 emails).
