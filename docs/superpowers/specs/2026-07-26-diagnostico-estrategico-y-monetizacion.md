# Diagnóstico estratégico y hoja de ruta de negocio — kata.ianexora.com

## Contexto

Kata pidió un rediseño estratégico completo "desde cero": posicionamiento, arquitectura,
monetización, newsletter, YouTube, UX, SEO, premium y stack. El repo **no era un punto de partida
en blanco**: investigación (código + `git diff` entre las 4 ramas `claude/*` sin mergear + sitio en
vivo + GitHub Actions, 2026-07-26) confirmó:

- **3 rediseños en 5 semanas**: "Kata Pro" (24-jun, paleta/tipografía), "Biblioteca de Sistemas"
  (22-jul, posicionamiento + arquitectura editorial), "El Universo" (23-jul, mapa 3D + copiloto
  NOVA) — **retirado el mismo 26-jul** porque, feedback textual de Kata, "no parecía blog
  profesional". La home volvió al layout editorial de Biblioteca de Sistemas.
- La rama `claude/kata-blog-redesign-strategy-8c1629` (post-mortem de esa retirada: home editorial,
  glosario indexable, `/trabaja-con-nbi`, redes sociales reales) **ya estaba en producción** en el
  momento del diagnóstico — verificado en vivo en `kata.ianexora.com` y con `git fetch` (el aviso
  de "trabajo sin mergear" del arranque de sesión estaba desactualizado). Las otras 3 ramas
  (`blog-design-changes-90fd54`, `blog-redesign-from-scratch-e77d7c`,
  `universo-mapa-intencion-04c032`) contienen solo El Universo ya descartado, o son duplicados
  exactos del HEAD — verificado byte a byte, sin contenido de negocio pendiente de rescatar.
- **Posicionamiento, pilares de contenido, newsletter y stack están maduros y validados** dos
  rediseños seguidos. Lo que falló dos veces fue la capa visual de la home, no la estrategia.
- **Los huecos reales son de oferta y volumen, no de diseño**: 9 posts publicados, 1 sola edición
  del Radar (escrita a mano — el cron semanal automático, secret `CLAUDE_CODE_OAUTH_TOKEN`
  configurado desde 21-jul, aún no había disparado su primera ejecución programada; el primer lunes
  tras el diagnóstico era el 27-jul), 0 vídeos de YouTube reales (workflow `youtube-nuevo.yml`
  corre cada 6h, siempre en estado `skipped` por falta de `YOUTUBE_CHANNEL_ID`), <100 suscriptores
  (el contador se oculta por diseño hasta ese umbral, `newsletter.showCountFrom`), y **0€ de precio
  definido para NBI** en ningún sitio — decisión ya tomada deliberadamente en el código (comentario
  explícito en `work-with-nbi-cta.tsx`: *"no price or scope is claimed here on purpose"*).

Conclusión operativa: no rehacer la arquitectura. Confirmar lo ya decidido y concentrar el esfuerzo
en los huecos reales de oferta/contenido/lanzamiento. Detalle completo por tema debajo.

## Qué se confirma, sin tocar

- **Posicionamiento**: tagline *"Sistemas probados en un negocio real. Llévatelos."*, filtro de
  identidad *"esto te encantará si ejecutas; no encajarás si buscas atajos"*, audiencia
  "emprendedores en marcha". Sobrevivió intacto a la retirada de El Universo.
- **Pilares de contenido** (`src/config/library.ts`: `ia-aplicada`, `captación y embudo`,
  `contenido`) — estructura correcta, cubre las categorías editoriales estándar (noticias→Radar,
  guías→curso interactivo, agentes/automatización→biblioteca, recursos→`/recursos`). El hueco es
  volumen (9 posts, 1 Radar), no taxonomía.
- **Estructura del sitio**: `/` `/blog` `/blog/tag/[tag]` `/blog/[slug]` `/empieza-aqui` `/sistemas`
  `/glosario` `/glosario/[id]` `/sobre-mi` `/trabaja-con-nbi` `/recursos` `/gracias` `/baja`
  `/privacidad` + RSS/sitemap/OG/JSON-LD ya cubren home/blog/categorías/artículo/newsletter/
  recursos/proyectos/servicios/sobre-mí. No falta una página "Servicios" — falta el precio que la
  llenaría (ver Monetización).
- **Home page**: responde en segundos quién/qué/a quién/por qué/próxima acción (hero + panel de
  estado + biblioteca destacada + manifiesto + CTA de cierre). No se relanza un 4º rediseño visual.
- **UX/UI**: Montserrat + Anton, rojo/negro cromado, editorial — ya es lo que se pedía ("premium,
  sin plantilla genérica de IA"), y es precisamente lo que quedó tras corregir El Universo.
  **Recomendación: congelar el diseño 60-90 días** y medir con datos reales antes de tocarlo de
  nuevo. El patrón de 3 rediseños en 5 semanas es hoy el mayor riesgo del proyecto — más que
  cualquier carencia visual.
- **Newsletter**: doble opt-in verificado, secuencia de bienvenida día 2 (curso) / día 5 (historia
  personal) / día 8 (pitch NBI suave, sin precio, pide respuesta por email). Ya es el patrón
  "vender sin parecer agresivo".
- **Conversión**: 2 forms en home (hero + cierre) + inline en posts + footer + `/recursos` +
  `/glosario`. Densidad correcta para <100 suscriptores; más CTAs ahora sería ruido.
- **SEO**: sitemap, RSS, JSON-LD `BlogPosting`, OG dinámico, glosario con interlinking (4/8
  términos con `relatedSlug`) — infraestructura completa. La palanca de crecimiento es cadencia
  editorial, no más tooling.
- **Stack técnico**: Next 16 + Velite + Supabase EU + Resend EU + Vercel, modelo de datos
  diseñado día 1 para Fase 3 (premium). Cero cambios de stack.

## Huecos reales y recomendación

### Monetización (el hueco de mayor impacto)

Hoy: 0 mecanismos de monetización activos — correcto con <100 suscriptores. Fases:

1. **Ahora**: nada de pago. El blog monetiza indirectamente generando leads hacia NBI vía
   `/trabaja-con-nbi`. Cero fricción, sin checkout, sin "próximamente premium".
2. **Bloqueador de negocio (no de código), idealmente esta semana**: definir precio/alcance de
   NBI. Sin esto, `/trabaja-con-nbi` y el email día 8 no pueden convertir en algo concreto. No es
   una decisión que el blog pueda tomar por Kata.
3. **3-6 meses**, tras publicar los 2 sistemas "en el taller" (Stack GEO, La máquina de
   bienvenida): primer producto de pago único y barato (plantilla/checklist descargable), bajo
   mantenimiento, cero recurrencia que gestionar. Todavía no membresía.
4. **6-12 meses, condicionado**: premium/newsletter de pago — ver regla cuantitativa abajo.

### Propuesta de premium (concepto, NO construir aún)

- **Nombre**: "NBI Inside".
- **Promesa**: la versión completa de cada build (código/prompts/SOPs reales de NBI, no el
  resumen público) + sesión mensual de preguntas.
- **Diferencia frente al gratis**: lo gratuito ya es completo en sí mismo (el qué y el por qué);
  premium da el cómo paso a paso con los artefactos reales — evita ser "contenido oculto".
- **Precio inicial recomendado**: 12€/mes o 120€/año, deliberadamente bajo y desacoplado del
  precio de consultoría B2B de NBI (productos distintos, audiencias distintas).
- **Cuándo**: no antes de cadencia semanal sostenida **y** varios cientos de suscriptores
  confirmados (mismo umbral ~500-1k ya anotado en `CLAUDE.md` para evaluar Discord/Telegram). La
  arquitectura (`profiles`/`subscriptions`, gating server-side) ya está diseñada para el swap.

### YouTube + blog

Infraestructura lista (frontmatter `youtubeId`, `YouTubeStrip`, workflow de detección), pero 0
vídeos reales: el único post con `youtubeId` (`geo-chatgpt.mdx`) sigue en `draft: true` con el
valor literal `"PENDIENTE"`, y no hay ningún enlace a YouTube en `siteConfig.social`. El flujo
vídeo→artículo→newsletter→recurso→oferta ya está soportado técnicamente — `geo-chatgpt.mdx` es
literalmente ese caso de prueba, esperando. Falta lanzar, no diseñar:

1. Grabar y publicar el vídeo 1.
2. `youtubeId` real, quitar `draft: true`.
3. Añadir el canal a `siteConfig.social`.
4. Configurar `YOUTUBE_CHANNEL_ID` para activar la detección automática ya construida.
5. Una vez publicado: enlazar el canal en el email del día 2 (o un 4º email post-secuencia) para
   cerrar el bucle bidireccional blog↔YouTube. No antes.

### Cadencia editorial

1 post "sistema" cada 2 semanas + Radar semanal (ya automatizado, solo falta confirmar/mergear el
PR cada lunes) antes de abrir ninguna categoría editorial nueva. Con 9 posts en 5 semanas, el
problema de crecimiento orgánico es volumen, no arquitectura ni taxonomía.

### Promesas abiertas

La home anuncia 2 sistemas "en el taller" (Stack GEO, La máquina de bienvenida) desde hace
semanas sin fecha. Cerrarlos pesa más para la credibilidad que cualquier retoque de mensaje o de
diseño — o se les pone ETA aproximada, o se retiran hasta estar más cerca de publicarse.

## Housekeeping ejecutado el mismo día (2026-07-26)

- `CLAUDE.md`: corregidas las secciones "El Universo" (pasó de "VIGENTE, en producción" a
  "SUPERSEDIDO, retirado 2026-07-26") y "Biblioteca de Sistemas" (vuelve a vigente, ya que la home
  volvió a ese layout), con enlace a este documento.
- `src/app/globals.css`: eliminados los tokens de color y el bloque de animaciones "Cosmic layer" /
  cinemática de entrada / NOVA que quedaron huérfanos tras retirar `src/components/universe/` y
  `src/components/nova/` (0 referencias fuera de `globals.css`, verificado con `grep`).
- Señaladas (sin borrar — acción destructiva, requiere confirmación explícita de Kata) las 3 ramas
  huérfanas: `claude/blog-design-changes-90fd54`, `claude/blog-redesign-from-scratch-e77d7c`,
  `claude/universo-mapa-intencion-04c032` (esta última, commit idéntico a `main`).

## Lista de decisiones prioritarias

1. No rediseñar visualmente una 4ª vez — congelar la home 60-90 días.
2. Definir precio/alcance de NBI — bloqueador nº1 de conversión real.
3. Grabar y publicar el vídeo 1 de YouTube, activar `YOUTUBE_CHANNEL_ID`.
4. Cadencia fija de contenido (1 sistema/2 semanas + Radar semanal).
5. Cerrar las 2 promesas "en el taller" antes de anunciar nada más en la biblioteca.
6. Premium: aparcado hasta cadencia semanal sostenida + ~500-1000 suscriptores.
