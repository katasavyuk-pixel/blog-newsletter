# ESTADO — blog-newsletter

> Última actualización: 2026-08-06, al cerrar la capa cinemática (F1 + F2).
> Lo de arriba es lo que toca ahora, en orden. Lo de abajo es contexto.

## Lo primero, y solo lo puedes hacer tú (2 min)

**Las tres variables de Chispa no están en Vercel.** El dock de chat sale en
producción diciendo «Todavía no estoy conectada». La clave ya la tienes en
`.env.local`; desde una sesión de agente no se puede leer ese fichero, así que:

```
vercel env add LLM_BASE_URL production --scope nexoraprocesos-boops-projects   # https://api.groq.com/openai/v1
vercel env add LLM_API_KEY  production --scope nexoraprocesos-boops-projects   # la de console.groq.com/keys
vercel env add LLM_MODEL    production --scope nexoraprocesos-boops-projects   # llama-3.3-70b-versatile
```

Después, un push cualquiera (o redeploy desde el dashboard) para que las coja.

## Ya verificado end-to-end (2026-08-05)

- ✅ **Alta real → confirmación → PDF descargado.** El camino completo del embudo, recorrido en
  producción con `nexoraprocesos+e2e@gmail.com`.
- ✅ **La respuesta llega a `info@ianexora.com`.** Era el último eslabón sin comprobar y el que
  sostiene la métrica de la fase (*reply rate*). Llevaba dos sesiones abierto.
- ✅ **Los 3 emails de la secuencia llegan**, con desglose, fórmula y enlace de baja visible. Caen
  en Promociones, que es el destino normal de cualquier correo con `List-Unsubscribe`; se les añadió
  parte de texto plano, que era la única señal en nuestra mano. Arrastrar uno a Principal y
  responder es lo que de verdad lo mueve, y lo entrena por cuenta.
- ✅ **Panel funcionando** con datos reales.
- ✅ **Frase del masthead**: elegida la opción A y desplegada.
- ✅ **Turnstile activo y probado por un humano.** Widget `0x4AAAAAAEHSqgI-UocUPzyT` (Managed,
  hostname `kata.ianexora.com`). `/api/subscribe` sin token devuelve `400 captcha` (antes: 200). Un
  alta real desde el navegador pasa el reto y llega el email. **Un navegador automatizado no
  consigue token ni en modo headed** — es lo buscado, y el corolario es que los flujos de alta ya no
  se pueden probar con Playwright: a mano.

**El embudo está cerrado de punta a punta.** Nada de lo que queda abajo bloquea a un lector.

## Ahora, en este orden

**1. Limpiar las filas de prueba** en `subscribers` cuando quieras: `source = prueba-reply-to`
(pending, caduca sola), `nexoraprocesos+e2e@gmail.com` y `nexoraprocesos+turnstile@gmail.com` (confirmadas — a esa le llegan aún el email
de 48h y el de 96h, que no está mal como prueba de la temporización).

**2. Ensayo en seco de la newsletter.** (1 min) Dice a cuánta gente llegaría, sin enviar nada:
```
read -rs S && echo && curl -s -X POST https://kata.ianexora.com/api/newsletter/send \
  -H "Authorization: Bearer $S" -H 'Content-Type: application/json' \
  -d '{"issue":"2026-08-antes-del-tms","dryRun":true}'
```

**3. Desbloquear la edición ya escrita.** `content/newsletters/2026-08-antes-del-tms.md`, `draft:
true`. De los dos motivos originales **ya solo queda uno**:
- ~~`/recursos` no sirve nada descargable~~ ✅ resuelto: sirve el PDF "25 datos" con descarga firmada.
- ❌ `content/posts/antes-del-tms-tu-inbox.mdx` sigue en `draft: true` → el enlace daría 404.
- Cuando lo publiques: pasar la checklist de `QUE_PUEDO_DECIR.md` **el mismo día**, quitar
  `draft: true` de la edición, y enviar sin `dryRun`.

**4. Definir precio y alcance de NBI.** Sigue siendo el bloqueador nº1 de negocio. Y ahora tiene un
sitio concreto esperándolo: la salida 2 del cierre apunta a `/trabaja-con-nbi` y **no dice
"diagnóstico" a propósito**, porque `EMBUDO.md` dice que hoy no se ofrece. El destino vive en
`siteConfig` para cambiarlo en una línea cuando lo definas. No es trabajo de código.

## Decisión abierta: la calculadora como imán no convence (Kata, 2026-08-05)

Planteado al cerrar la sesión, y tiene razón. Dos problemas de **oferta**, no de código:

1. **El email no añade nada.** El lector ya vio las tres cifras gratis en pantalla; lo que compra con
   su email son esas mismas cifras por escrito más una fórmula de tres líneas. No es un intercambio,
   es un peaje.
2. **La pregunta está mal.** *"¿Cuánto cuestan los tokens?"* es la pregunta de quien ya escribe
   código contra una API. El lector nº1 es un emprendedor en marcha: la suya es **"¿merece la pena
   automatizar esto?"**, y esa no se responde sin el otro lado de la balanza — lo que cuesta hacerlo
   a mano hoy.

**Dirección propuesta (sin empezar):** misma calculadora, dos entradas más (horas/semana en el
proceso y coste de esa hora) y salida distinta: **coste manual vs automatizado al mes, y en cuántas
semanas se paga**. Un periodo de retorno por escrito sí es algo que se reenvía a un socio — eso
justifica el email. Reutiliza toda la maquinaria de hoy: captura, payload recalculado en servidor,
email 1, panel. Solo cambia el modelo de cálculo y el copy.

**Bloqueado por un dato que no se puede inventar:** el coste por hora por defecto. Es el único número
que no sale de la aritmética, y publicar una estimación sin fuente va contra `VOZ.md`. Iría como
campo editable con valor de partida y etiqueta explícita de estimación.

**Alternativa más barata:** dejar la calculadora como herramienta de la página y hacer del **PDF "25
datos" el imán protagonista** — ese sí resuelve un problema concreto de una persona concreta.

## Bloqueado por

**Nada externo.** Todo lo de arriba depende de ti. El único frente ajeno es firmar los DPAs.

## Pendientes menores que arrastramos

- **DPAs sin firmar.**
- CNAME `autodiscover`/`autoconfig`/`mail` y SRV `_autodiscover._tcp` en Namecheap (solo afecta al
  autoconfig de clientes de correo, no a recibir).
- La `publishable key` de Supabase en Vercel es inválida (inocuo: todo va server-side, y
  `src/lib/resources.ts` ya lee con el cliente admin justo por esto).
- **Ningún post usa `updated`.** La señal se muestra en el artículo, va al JSON-LD y al sitemap, y
  está vacía hasta que edites algo y lo feches. Está en `docs/geo-checklist.md`.
- **Las ediciones de `content/newsletters/` llevan el dominio a fuego.** Las de `content/emails/` no
  (usan `{{url_sitio}}`). Conviene igualarlo.
- ⚠️ `RESEND_FROM` y `RESEND_API_KEY` se modificaron el 4-ago sobre las 23:30, no por el agente.
  Resultó inocuo, pero recuerda qué cambiaste por si rotaste a una cuenta distinta.

## Hecho el 6 de agosto — capa cinemática (F1 + F2), en producción

Cuatro commits pusheados. **Sí es un rediseño visual**, al contrario que la sesión
del embudo: la home ahora abre con una intro de tres actos.

- **Wizard de entrada, 4 pasos** (antes 5). Se le quitó el paso de email: pedía
  una dirección antes de haber dado nada, que es el mismo reflejo de landing por
  el que se quitó el formulario del masthead. El porqué está escrito en
  `src/config/intent.ts` para que no vuelva a crecer.
- **Chispa asistente** — dock de chat en todas las páginas, anclado al contenido
  del sitio. Funciona en local; en producción está muda hasta que subas las envs.
- **Intro scrollytelling en la home**: ruido → señal → sistema. Añade **6,3
  pantallas de scroll** antes del `h1` en escritorio (3,9 en móvil). Hay botón de
  saltar pegado abajo durante todo el recorrido. Con `prefers-reduced-motion` la
  intro **no existe** (documento de 10959px → 5321px).
- Las 4 secciones de la home que no revelaban nada ya lo hacen (`ScrollReveal`
  gana variante `blur`).

**Tres cosas que estaban mal y no se veían mirando:**

1. **Motion compilaba las animaciones de scroll a un `ViewTimeline` anclado al
   elemento animado**, y todo vive dentro de un `sticky`: la escena animaba con
   los valores equivocados (al 50% de la escena la animación iba por el 20,6% y
   luego retrocedía). Detalle y regla en `docs/specs/home-scrollytelling.md`.
2. `animate-pulse` en el mismo elemento que una opacidad de motion la pisa: una
   animación CSS gana a un estilo inline.
3. **Chispa decía «nuestro sitio»** — el plural que `QUE_PUEDO_DECIR.md` prohíbe,
   generado de nuevo en cada respuesta. Regla añadida al prompt.

**Decisiones abiertas de esta sesión:**

- ¿6,3 pantallas de intro son demasiadas? Se recorta cambiando tres alturas en
  `src/components/home/scrolly/*-scene.tsx`.
- **Dos intros encadenadas**: cierras el wizard y caes en la escena 1. Nadie ha
  decidido aún si sobra una.

## Sin commitear

`editorial/` · `lead-magnets/` · **`content/posts/geo-blog.mdx`**

Ese último apareció a mitad de la sesión del embudo y no lo escribió el agente. La build pasa con él
dentro, pero **ojo**: `velite --strict` compila todos los posts, así que un error de schema ahí
rompería el deploy. Revísalo antes de commitear otra cosa.

*(Los dos ficheros que quedaron sin commitear anoche — `confirm-opt-in.tsx` y `resources.ts` — ya
están dentro: eran prerrequisitos del embudo.)*

## Hecho en la sesión del 5 de agosto, tarde (25 commits, todos pusheados)

Máquina de captación, 5 fases, en producción. **No fue un rediseño**: no se tocó ni un token visual.

- **`/recursos` dejó de ser una promesa.** Calculadora con captura (uso libre sin registro) + el PDF
  "25 datos" + "En el taller" derivado de `LIBRARY_ITEMS`. El artículo que aloja la calculadora
  renderiza **idéntico byte a byte** — verificado diffeando el HTML servido.
- **Secuencia de bienvenida 0h / 48h / 96h**, copy en `content/emails/*.md` editable sin tocar
  código. El email 1 entrega el desglose **recalculado en servidor**.
- **CTA inline en los 9 artículos** + `CierreEstandar` con 3 salidas fijas. Antes 6 de 9 artículos
  no tenían ningún campo de email en la página.
- **GEO parcial**: `TechArticle`/`Article`, `BreadcrumbList`, `DefinedTerm`, `WebSite`, `lastmod`
  real, `scripts/geo/audit-ssr.mjs`, `docs/geo-checklist.md`. `robots.ts`/`llms.txt`/`Person` NO.
- **`/panel`** con 6 tablas tras contraseña.

**Cuatro cosas que estaban rotas y nadie sabía:**

1. **El botón de descarga de los emails nunca funcionó.** Dependía de una cookie `httpOnly` que no
   viaja desde un cliente de correo. Ahora va firmado con HMAC.
2. **El email de bienvenida incumplía RFC 8058** — sin `List-Unsubscribe` ni enlace de baja. Era el
   único de los cuatro, y el primero que recibe cualquiera.
3. **El email del día 8 decía "montamos sistemas de IA"** — plural de cortesía que
   `QUE_PUEDO_DECIR.md` prohíbe, programado para llegarle a todo el mundo.
4. **El `lastmod` del sitemap decía "modificado ahora"** en 9 rutas, en cada build.

Detalle completo en `CLAUDE.md`, sección "Máquina de captación (2026-08-05, segunda sesión)".

## No tocar

- **El redeploy de este proyecto se hace con push a `main`.** `vercel redeploy` cogió un despliegue
  antiguo y dejó producción atrasada unos minutos el 5-ago; `vercel ls --prod` **no viene ordenado
  por fecha**. Y `vercel deploy --prod` subiría los ficheros sin trackear, incluido un `.mdx` que
  Velite recogería.
- **Las migraciones aplicadas** en Supabase EU `kata-ivanovych-blog` (cuenta **separada** de la de
  NBI, y **no accesible desde el MCP** — desde una sesión no se puede verificar el esquema). Se crea
  una nueva, nunca se edita.
- **`service_role` solo en servidor**, runtime Node. Jamás `NEXT_PUBLIC` ni en cliente.
- **Gating server-side** de `draft`/`premium`: route + `generateStaticParams` + RSS/sitemap.
- **Sin hex en JSX.** Todo por design tokens de `@theme`.
- **`draft: true` por defecto en las newsletters**: una edición se apunta a salir, nunca al revés.
- **`build:content` lleva `--strict`.** No quitarlo: sin él un typo borra un post del sitio en
  silencio.
- **Fase 3 (auth, Stripe, premium) no se construye aún.**
- **`robots.ts`, `llms.txt` y el `Person` con `sameAs` NO se construyen**: contenido en cámara del
  EP1, y el 404 de `/llms.txt` es la toma del "antes". El resto del GEO ya está hecho.
- **El borrado RGPD necesita dos `delete`**: `lead_magnet_submissions` no tiene FK a `subscribers`,
  así que no cascadea. La baja ya lo hace; una petición de supresión a mano, también.
- La voz y qué se puede decir viven en `~/Developer/Marca-Personal` (skill `marca-kata`). **Sí son
  legibles** desde este repo, al contrario de lo que decía una nota vieja.
