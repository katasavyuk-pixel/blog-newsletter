# ESTADO — blog-newsletter

> Última actualización: **2026-08-21**, tras la auditoría posterior a publicar el episodio 1.
> Arriba lo que toca ahora, en orden. Abajo, contexto que no conviene volver a averiguar.

## Lo primero, y solo lo puedes hacer tú

**1. Lee la newsletter y envíala.** `content/newsletters/2026-08-geo-ep1.md`. Todo lo demás de
esa edición está comprobado y anotado en su propio frontmatter; lo único que falta es que la
leas, porque sale con tu firma a gente real y es el primer envío de la lista. Los tres pasos
del envío están escritos ahí. Es lo único con prisa: el vídeo es de esta semana.

**2. Reconstruye el ZIP del recurso.** El vídeo menciona las comprobaciones y la tabla, y el
ZIP no las lleva: solo el prompt y un README. Ya está escrito lo que falta
(`lead-magnets/maitreai-geo/comprobaciones-geo.md`, 9 comprobaciones + la tabla, sacadas del
informe real de la auditoría). Dos pasos, en `lead-magnets/maitreai-geo/README.md`: trae el
prompt al repo y vuelve a comprimir. **Cuando esté subido, dilo y devuelvo al artículo la frase
que promete las comprobaciones** — se quitó el 2026-08-21 justo porque no era verdad.

**3. Define precio y alcance de NBI.** Sigue siendo el bloqueador nº1 de negocio y no lo
arregla ningún commit. La salida 2 del cierre apunta a `/trabaja-con-nbi` y **no dice
"diagnóstico" a propósito**: `EMBUDO.md` dice que hoy no se ofrece.

## Lo que se arregló el 2026-08-21 (auditoría post-episodio)

Segunda tanda, ya con el vídeo publicado:

- **`/recursos` deja de abrir con la calculadora.** Quien llegaba por el enlace del vídeo
  aterrizaba en un widget de precios de tokens, encima de lo que venía a buscar. La
  calculadora vive en su artículo con la captura encendida, así que no se pierde nada.
- **Una sola petición de correo por página.** El artículo pedía en tres sitios y `/recursos`
  en tres también (dos tarjetas más un «Avísame»), siendo **la misma lista**. Ahora el
  formulario del artículo *es* la entrega, y el consentimiento lo dice: *"Es una sola lista"*.
- **El correo de entrega ya no abre con la calculadora** de una visita de otro día.
- **El buzón de contacto apunta a `info@ianexora.com`**, que alguien lee. `privacidad@` no lo
  leía nadie y la política de privacidad lo nombraba como canal de derechos RGPD.
- **La política de privacidad habla en singular.** Decía "tratamos", "guardamos", "usamos" —
  el plural de cortesía que `QUE_PUEDO_DECIR.md` prohíbe, justo en la página que declara quién
  es el responsable del tratamiento.
- **Radar: mergeada la edición del 17-ago** (PR #2). Las 7 URLs comprobadas una a una contra
  las páginas reales y los 7 titulares coinciden verbatim. Ojo con el gate en local: compara
  contra `scratch/radar-candidates.json`, que caduca a los 7 días — en local da falsos
  positivos de alucinación. El gate bueno es el de CI, que recolecta fresco.
- **Web Analytics activado** con `vercel project web-analytics`. Llevaba desde julio apagado.

- **El vídeo afirmaba dos despliegues que no existían.** `maitreai.es/llms.txt` daba 404 y su
  `robots.txt` tenía un solo grupo `*`, sin nombrar a ningún rastreador de IA — mientras el
  artículo publicado describía ambas piezas como hechas. Construidas y desplegadas en
  `~/Developer/Ma-tre` (commit `f2f721e`): 15 grupos, cada uno con las 8 mismas exclusiones,
  verificado contra producción grupo a grupo.
- **La secuencia de bienvenida enviaba enlaces muertos desde el 29-jul.** Velite
  percent-codifica `{{url_sitio}}` cuando va dentro de un enlace; ni la sustitución ni el
  guard de sobrantes casaban con esa forma, así que el email salía impecable y sin un solo
  botón que funcionara. `tests/email-template.test.ts` lo fija leyendo la salida del
  compilador, que es donde vive el fallo.
- **CI llevaba rojo desde que existe** (2026-08-11 y 2026-08-20): corría `tsc` antes que
  Velite, así que `#site/content` no existía y cascadeaban 19 errores. En local pasaba porque
  `.velite/` ya estaba en disco. Verde por primera vez hoy.
- **Un suscriptor ya confirmado que pedía un recurso no recibía nada.** El formulario le
  decía "te llega" y el código devolvía `ok()` y silencio.
- **`/api/confirm` no comprobaba su `UPDATE`**, así que un fallo de escritura mandaba la
  secuencia con un token de baja que no estaba en la base de datos.
- **El email de confirmación era el único sin texto plano**, y el default de `RESEND_FROM`
  apuntaba a un dominio que no está verificado ni es nuestro.
- **`YOUTUBE_CHANNEL_ID`** estaba sin poner, así que el workflow de vídeos llevaba un mes
  saltándose cada 6 h. Puesta.
- **Tres artículos GEO casi idénticos.** Los dos que no se publicaron están en
  `docs/archivo/`, fuera del alcance de Velite.

## Ya verificado end-to-end

- ✅ **Alta real → confirmación → descarga.** Recorrido en producción el 2026-08-05 con un
  alias `+e2e` del buzón personal. **Conviene repetirlo con el recurso GEO**, que es nuevo.
- ✅ **Las respuestas llegan a `info@ianexora.com`** (2026-08-05). Es lo que sostiene la
  métrica de la fase.
- ✅ **Turnstile activo**, widget Managed sobre `kata.ianexora.com`. `/api/subscribe` sin
  token devuelve `400 captcha`. Corolario: **los flujos de alta no se pueden probar con
  Playwright**, ni en modo headed. A mano.
- ✅ **Panel** con datos reales, tras contraseña.
- ✅ **`maitreai.es/llms.txt` y su `robots.txt`** (2026-08-21), comprobados contra producción.

## Decisión cerrada: la calculadora deja de ser el imán (2026-08-21)

Estaba abierta desde el 2026-08-05 con dos problemas de **oferta**, no de código: el email no
añadía nada (el lector ya vio las cifras gratis, así que pagar con su dirección por verlas
otra vez es un peaje, no un intercambio) y la pregunta estaba mal (*"¿cuánto cuestan los
tokens?"* es la pregunta de quien ya escribe código contra una API, no la del emprendedor en
marcha).

**Se cerró por la alternativa barata que ya proponía este documento**: la calculadora deja de
presidir `/recursos` y el imán protagonista pasa a ser el prompt de auditoría GEO, que
resuelve un problema concreto de una persona concreta.

Lo desencadenó Kata siguiendo su propio enlace desde la descripción del vídeo: quien llega
buscando el prompt aterrizaba en una calculadora de costes de tokens. No se pierde nada — la
calculadora vive en su artículo (`content/posts/cuanto-cuesta-la-ia.mdx`) **con la captura
encendida**, así que `lead_magnet_submissions` y el `{{apertura_personalizada}}` del email 1
siguen funcionando igual. `/recursos` queda con una sola petición de correo y lo descargable
lo primero.

La dirección más ambiciosa sigue anotada por si alguna vez interesa: misma calculadora, dos
entradas más (horas/semana y coste de esa hora) y salida distinta — coste manual vs
automatizado al mes y en cuántas semanas se paga. **Sigue bloqueada por el mismo dato que no
se puede inventar**: el coste por hora por defecto.

## Pendientes menores que arrastramos

- **DPAs sin firmar.** Es el único frente que depende de un tercero.
- **`siteConfig.contactEmail` (`privacidad@ianexora.com`) sigue sin confirmarse** como buzón
  monitorizado. Pesa más de lo que parece: la política de privacidad lo nombra como canal de
  derechos RGPD, así que un alias que nadie lee es un compromiso publicado y no cumplido.
- **`content/posts/antes-del-tms-tu-inbox.mdx` sigue en `draft: true`**, y por eso la edición
  `2026-08-antes-del-tms` no se puede enviar: su enlace daría 404.
- **Las ediciones de `content/newsletters/` llevan el dominio a fuego** y no pasan por
  `renderTemplate` — `sendIssue` inyecta el HTML crudo. Es coherente, pero significa que un
  cambio de dominio hay que buscarlo a mano.
- **Ningún post usa `updated`.** La señal se muestra, va al JSON-LD y al sitemap, y está vacía.
- CNAME `autodiscover`/`autoconfig`/`mail` y SRV `_autodiscover._tcp` en Namecheap (solo
  afecta al autoconfig de clientes de correo, no a recibir).
- La `publishable key` de Supabase en Vercel es inválida (inocuo: todo va server-side).
- **Filas de prueba en `subscribers`**: `source = prueba-reply-to` y dos alias `+e2e` /
  `+turnstile`. Este repo es **público**, así que aquí van descritas, nunca literales.

## Deuda conocida que NO se ha tocado, y por qué

- **`/api/confirm` y `/api/unsubscribe` mutan estado por `GET`.** Los escáneres corporativos
  de enlaces (Safe Links, Proofpoint) siguen los enlaces de un correo automáticamente:
  pueden autoconfirmar un alta y autodar de baja al escanear el pie. Arreglarlo bien pide una
  página intersticial con POST y toca el opt-in entero. Es una sesión propia.
- **`sendIssue` no pagina ni ordena.** PostgREST corta en `max_rows` (1000 por defecto) **sin
  devolver error**: pasado ese umbral la edición llegaría a los primeros 1000, se registraría
  como enviada y el resto la perdería. Latente con la lista actual; el día que se acerque a
  mil, esto primero.
- **Un fallo total de envío quema el `issue_id`.** El claim se inserta antes de enviar y no se
  revierte, así que reintentar choca con la clave primaria y hay que borrar la fila a mano.
- **CLAUDE.md dice que el boletín tiene "breaker por cuota".** No existe: ante un 429 el
  bucle recorre la lista entera acumulando fallos.

## No tocar

- **El redeploy se hace con push a `main`.** `vercel redeploy` cogió un despliegue antiguo y
  dejó producción atrasada el 5-ago; `vercel ls --prod` **no viene ordenado por fecha**. Y
  `vercel deploy --prod` subiría los ficheros sin trackear.
- **Las migraciones** viven en Supabase EU `kata-ivanovych-blog`, cuenta **separada** de la de
  NBI y **no accesible desde el MCP**: desde una sesión no se puede verificar el esquema ni
  contar filas. Se crea una nueva, nunca se edita.
- **`service_role` solo en servidor**, runtime Node. Jamás `NEXT_PUBLIC` ni en cliente.
- **Gating server-side** de `draft`/`premium`: route + `generateStaticParams` + RSS/sitemap.
- **Sin hex en JSX.** Todo por design tokens de `@theme`.
- **`draft: true` por defecto en las newsletters**: una edición se apunta a salir, nunca al revés.
- **`build:content` lleva `--strict`.** Sin él, un typo borra un post del sitio en silencio.
- **CI corre `build:content` antes que `verify`.** No es cosmético: sin Velite no hay
  `#site/content` y el typecheck falla entero.
- **`PRIVATE_PATHS` en `src/app/robots.ts` es una constante única y cada grupo nombrado la
  repite.** Un bot que encuentra un grupo con su nombre ignora el `*` completo; dar
  `Allow: /` a secas abriría todo lo que la lista protege.
- **`/panel` no se nombra en `robots.txt`.** Es público: listarlo anuncia la ruta, y el único
  motivo de que el panel no esté en `/admin` es que `/admin` es lo que se escanea.
- **El borrado RGPD necesita dos `delete`**: `lead_magnet_submissions` no tiene FK a
  `subscribers`, así que no cascadea.
- **Fase 3 (auth, Stripe, premium) no se construye aún.**
- La voz y qué se puede decir viven en `~/Developer/Marca-Personal` (skill `marca-kata`), y
  **sí son legibles** desde este repo.

## Decisión que conviene tomar pronto

**`llms.txt` y el nodo `Person` con `sameAs` en este sitio.** Se dejaron sin construir a
propósito porque eran el contenido en cámara del episodio 1 y el 404 era la toma del "antes".
**Ese episodio ya se grabó, y pivotó a MaitreAI**, así que la premisa está muerta: hoy es una
ausencia sin motivo. `robots.ts` ya entró (commit `e182014`). Contra: `docs/geo-checklist.md`
dice "no invertir en `llms.txt`" citando a Ahrefs, y esa razón sigue siendo buena. Decidir y
escribirlo, en vez de dejarlo como está por inercia.

## Historial

Está en `git log`, que es donde no puede quedarse desfasado. Los mensajes de commit de este
repo llevan el porqué, no solo el qué. Las sesiones grandes tienen su sección en `CLAUDE.md`.
