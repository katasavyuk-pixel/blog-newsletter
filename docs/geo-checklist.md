# GEO — checklist al escribir

> Qué hace que un motor de IA **cite** una página, no solo la indexe. Es una
> checklist editorial: lo técnico ya está montado (ver el final).
>
> Escrito 2026-08-05.

## Antes de publicar

- [ ] **TL;DR extraíble en las primeras 3 frases.** Un modelo que cita necesita un
      fragmento que se sostenga solo, sin el contexto de arriba. Si la respuesta a
      "¿de qué va esto?" está en el párrafo 6, no se puede citar.
- [ ] **Afirmaciones declarativas, no insinuadas.** *"Un token en español cuesta
      más que en inglés"* se cita. *"Podría ser que el idioma influya en el coste"*
      no. Esto no es lo mismo que exagerar: es afirmar lo que de verdad sabes.
- [ ] **Cada cifra con su fuente en la misma frase.** Regla de marca (`VOZ.md`) y
      además lo que hace citable un dato. Sin fuente: prueba cualitativa
      (`0 €`, `24/7`, "sigue sin aparecer"), o se dice que es una estimación en la
      misma frase.
- [ ] **Tablas para lo comparable.** Precios, límites, antes/después. Una tabla se
      extrae entera; el mismo contenido en prosa, no.
- [ ] **Cifras concretas en lugar de adjetivos.** "Tres pasos", "diez fuentes",
      "siete días" — no "múltiples", "numerosos", "rápido".
- [ ] **Un encabezado que sea la pregunta que alguien escribiría.** `## Cuándo usarlo`
      es peor que `## Cuándo conviene usar RAG (y cuándo no)`.
- [ ] **El límite honesto, explícito.** Lo que el sistema no hace, dónde falló.
      Es lo que distingue una página escrita por alguien de una ensamblada por
      nadie, y es lo que `VOZ.md` pide de todas formas.
- [ ] **`updated:` en el frontmatter al revisar de verdad.** Se muestra en el
      artículo, va al JSON-LD `dateModified` y al `lastmod` del sitemap. Hoy
      **ningún post lo usa**, así que la señal existe y está vacía. Ponerlo cuando
      se revisa; no tocarlo por un typo.
- [ ] **Si el artículo lleva un bloque real de preguntas**, marcarlo: existe
      `faqJsonLd()` en `src/lib/jsonld.ts` sin usar, esperando el primer
      `## Preguntas frecuentes` de verdad.

## Lo que NO se hace

- **No marcar los `<Quiz>` como `FAQPage`.** Son ejercicios, no preguntas
  frecuentes. Sería spam estructurado en un sitio cuyo argumento es que sus
  afirmaciones se pueden comprobar.
- **No declarar `SearchAction`.** No hay buscador. Es una mentira que una máquina
  puede verificar.
- **No meter texto explicativo dentro de un widget cliente.** El widget puede
  hidratar; el párrafo que lo explica tiene que venir del servidor. Comprobable
  con el script de abajo.
- **No invertir en `llms.txt`.** Ahrefs analizó 137.210 dominios y el 97% de esos
  ficheros no recibió ni una petición en mayo de 2026. (Dato de terceros, sin
  verificar por nosotros — vale como orden de magnitud para decidir no gastar
  tiempo, no como afirmación publicable.)

## Comprobación técnica

```bash
# El texto sustantivo está en el HTML servido, sin ejecutar JS.
# Descuenta los <script>, donde Next incrusta el payload de React —
# sin eso, una página que solo funciona con JS parecería correcta.
node scripts/geo/audit-ssr.mjs                        # local, puerto 3100
node scripts/geo/audit-ssr.mjs https://kata.ianexora.com

# JSON-LD de un tipo de página, para pegar en validator.schema.org
curl -s https://kata.ianexora.com/blog/que-es-un-token \
  | grep -o '<script type="application/ld+json">[^<]*' | sed 's/.*json">//'
```

## Lo que ya está montado (no hay que volver a hacerlo)

| Pieza | Dónde |
|---|---|
| `TechArticle` (lección/sistema) o `Article` | `src/lib/jsonld.ts` → `articleJsonLd()` |
| `BreadcrumbList` | artículo y glosario |
| `DefinedTerm` + `DefinedTermSet` | `/glosario/[id]` |
| Escapado `<` → `<` centralizado | `<JsonLd>`, `src/components/ui/json-ld.tsx` |
| Fecha de publicación y de actualización visibles | `PostMeta` |
| Bio de autoría al pie de cada artículo | `AuthorBio` |
| `lastmod` real en el sitemap | `src/app/sitemap.ts` |
| Auditoría de renderizado | `scripts/geo/audit-ssr.mjs` |

## Deliberadamente sin construir

`robots.ts`, `llms.txt` y el nodo `Person` con `sameAs` en `/sobre-mi`.

Son el contenido **en cámara** del episodio 1 (memoria `guion-episodio-1-geo`): el
404 de `/llms.txt` es la toma del "antes". No adelantarlo.

Consecuencia útil de eso: **al no existir `robots.txt`, no hay ningún crawler
bloqueado** — ni GPTBot, ni OAI-SearchBot, ni PerplexityBot, ni ClaudeBot, ni
Google-Extended. El requisito "verificar que no se bloquea a los crawlers de IA"
se cumple hoy sin escribir nada; el script lo comprueba y lo dice.
