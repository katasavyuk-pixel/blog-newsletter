@AGENTS.md

# CLAUDE.md — Blog + Newsletter de marca personal (IA)

> Cómo se trabaja en este repo. El histórico de los cinco rediseños, el embudo y el
> diagnóstico están en `docs/historia/rediseños-y-embudo.md`; los pitfalls, en
> `docs/pitfalls.md`; el estado vivo, en `ESTADO.md`.
> Última revisión: **2026-08-21** (auditoría posterior al episodio 1).

## Antes de escribir contenido

Voz, qué se puede decir (restricciones legales con caducidad) y la mecánica del embudo viven
en `~/Developer/Marca-Personal` — **carga la skill `marca-kata`**. No las copies aquí: este
fichero y el del canal describían cada uno su versión de la misma marca y divergieron durante
semanas. Aquí solo va la implementación.

## Qué es esto

Blog + newsletter de marca personal sobre IA. Objetivo near-term: **captar suscriptores**.
Embudo: **recurso gratuito → email (doble opt-in) → newsletter → (Fase 3) premium.**
La arquitectura está diseñada para premium desde el día 1, pero **la parte de pago no se
construye** hasta la Fase 3.

- **Fase 0** ✅ fundamentos y design system. **Fase 1** ✅ blog (Velite, TOC, SEO, RSS).
- **Fase 2** ✅ newsletter, en producción y verificada end-to-end.
- **Fase 3** ⬜ auth + Stripe + gating premium. **No construir aún.**
- **Fase 4** 💡 búsqueda semántica sobre el contenido (pgvector). No implementar.

## Stack (pins)

| Capa | Elección |
|---|---|
| Framework | `next@16.2.x` (App Router, Turbopack, Node ≥20) |
| Runtime | `react@19` |
| Estilos | `tailwindcss@4` + `@tailwindcss/typography` |
| Tipografía | Inter (cuerpo/UI) + Anton (`--font-punch`, display) + mono del sistema |
| Contenido | `velite@0.3.x` + rehype-pretty-code + shiki |
| DB | `@supabase/ssr` + `supabase-js`, región `eu-central-1` |
| Email | `resend@6` + `react-email@6`, envío `eu-west-1` |
| Analítica | Vercel Web Analytics (cookieless, sin PII) |

**Next 16 ≠ el Next que conoces** (ver `@AGENTS.md`): consulta `node_modules/next/dist/docs/`
antes de escribir código de framework.

## Convenciones

- **Código y comentarios en inglés; contenido de cara al usuario en español.** El historial de
  commits está en inglés.
- **Identidad textual centralizada** en `src/config/site.ts`. Sin texto hardcodeado en componentes.
- **Sin hex en JSX.** Todo por design tokens (`@theme` en `globals.css`): `bg-bg`, `text-fg`,
  `text-muted`, `text-accent-ink`, `bg-accent`, `border-border`.
- **Taxonomía cerrada**: todo post lleva `tema` y `formato` de `src/config/taxonomy.ts`,
  validados con Zod. Los `tags` libres son keywords y no generan navegación.
- **Las afirmaciones de credibilidad son `Evidencia`, no strings** (`src/lib/evidence.ts`).
  Los invariantes rompen la build a propósito: ETA obligatoria y no vencida, cifra sin fuente,
  `en-produccion` sin url, item cuyo `slug` sea draft.
- **`service_role` solo servidor**, runtime Node. Jamás `NEXT_PUBLIC`.
- **Gating server-side** (`draft`, `premium`): route + `generateStaticParams` + RSS/sitemap.
- **Verificar verde antes de commitear**: `npm run build:content && npm run verify && npm run build`.
  Y **ejercitar el flujo real** — lint y tipos verdes no son "funciona".
- **`git add` fichero a fichero.** Añadir un directorio arrastra el trabajo sin commitear de Kata.
- **Secretos** en Doppler (dev) / `vercel env` (prod). Nunca en código, chat ni logs.

## Estructura

```
content/posts/*.mdx            artículos (Velite)
content/newsletters/*.md       ediciones del boletín (draft: true por defecto; sent: true
                               las publica en el archivo web /newsletter, tras el envío real)
content/emails/*.md            copy de la secuencia de bienvenida
content/_templates/radar.mdx   plantilla del Radar (fuera del pattern de Velite)
src/app/                       rutas + route handlers; robots.ts, sitemap.ts, feed.xml,
                               llms.txt, /newsletter (archivo web del boletín)
src/components/                ui · layout · home · blog · content · mdx/widgets · assistant · wizard
src/config/                    site · taxonomy · library · course · cierre · cta-inline · intent · scrolly
src/lib/                       evidence · posts · radar · cost-model · lead-magnets · signed-links
                                email · email-template · email-blocks · newsletter · newsletter-archive
                                welcome-sequence · jsonld · funnel · panel-auth · glossary · supabase/*
scripts/radar/                 collect · verify-edition · youtube
scripts/geo/audit-ssr.mjs      ¿el texto sustantivo está en el HTML servido?
supabase/migrations/           0001-0005, aplicadas a mano en el SQL editor
supabase/seeds/resources.sql   altas de recursos (contenido, no migración)
tests/                         node:test + tests/alias-hook.ts para el alias @/
docs/                          specs · historia · pitfalls · geo-checklist · archivo
```

## Decisiones de arquitectura

- **Tema: página oscura entera.** `--color-bg #0b0608` (negro cálido). No es modo-oscuro con
  toggle: es la única identidad.
- **Paleta CINE**, la misma que el vídeo: `--color-accent #e11423` **solo como superficie**
  (nunca texto pequeño), `--color-accent-ink #ff3b4e` para texto rojo (AA). Reparto por
  superficie en `~/Developer/Marca-Personal/IDENTIDAD.md`.
- **Content layer = Velite.** Compila MDX en su propio proceso esbuild, así el pipeline
  Shiki/rehype corre intacto bajo Turbopack (que no puede pasar plugins con funciones a través
  de la frontera Rust). Nunca `VeliteWebpackPlugin`.
- **Newsletter = lista en Supabase; Resend solo entrega.** El estado de consentimiento vive en
  nuestro Postgres, lo que hace triviales los derechos RGPD y mantiene la PII fuera de la infra
  US de Resend. Transaccional vía `emails.send`; boletín vía loop propio con
  `resend.batch.send` (lotes de 100, idempotente por `issue_id`).
  **Matiz RGPD:** `eu-west-1` controla desde dónde se *envía*, no la residencia de los datos.
  **Nunca prometer "100% UE".**
- **Analítica cookieless**: sin cookies ni PII → sin banner. Evitar GA4.

## Radar IA — noticias automatizadas

Serie semanal generada por CI con **checkpoint humano**: nada se publica sin merge de un PR.

1. `scripts/radar/collect.mjs` — recolector RSS **determinista, sin LLM** → `scratch/` (gitignored).
2. Claude Code Action redacta la edición usando SOLO ese JSON.
3. `scripts/radar/verify-edition.mjs` — **gate**: cada `<RadarItem>` debe coincidir con un
   candidato o no hay PR. La **url se compara verbatim**; título/fuente/eje se comparan
   normalizando tipografía (`canonical()`), porque con `!==` estricto el modelo reescribía `’`
   como `'` y el gate lo marcaba como alucinación — se perdieron dos ediciones así.
   Al tocarlo, verificar los tres negativos: título reescrito, url inventada y fuente cambiada
   deben seguir saliendo con exit 1.
4. Frontmatter obligatorio: `tema: contenido`, `formato: radar`. Sin ellos falla `velite --strict`.

**Cadencia auto-degradante** (`getRadarCadence()`): si la última edición pasa de 10 días, la home
sustituye sola "Cada lunes · en automático" por "Última edición: <fecha>". El sitio no puede
mentir sobre su cadencia aunque el CI falle.

**Workflows**: `radar-semanal.yml` (lunes 05:00 UTC) y `youtube-nuevo.yml` (cada 6 h; lee el RSS
del canal y compara contra los `youtubeId:` de `content/posts/**`, idempotente sin estado).
El segundo está gateado por la **variable de repo** `YOUTUBE_CHANNEL_ID` (puesta el 2026-08-21;
estuvo un mes sin poner y el job se saltaba en silencio). El canal también está por defecto
dentro de `scripts/radar/youtube.mjs`, pero ese default nunca llega a usarse en CI.

**CI** (`ci.yml`): `build:content` → `verify` → `build`. El orden es obligatorio: `#site/content`
es código generado y sin él el typecheck falla entero.

## Superficies vivas

- **Curso** `/empieza-aqui`: itinerario de los 6 posts interactivos, progreso en localStorage.
  `src/config/course.ts` es el SSOT de slugs.
- **Widgets MDX**: islas `"use client"` registradas en `src/components/mdx/widgets/index.ts` y
  pasadas por `components` en `src/app/blog/[slug]/page.tsx`. Datos precalculados, 0 coste API.
- **`<SuscripcionInline/>` NO está en `widgets/index.ts`**: el cuerpo MDX no ve su propio
  frontmatter, así que `blog/[slug]/page.tsx` liga el componente al post al construir el mapa.
  Lo llevan 9 de los 11 artículos; `cuanto-cuesta-la-ia` no, a propósito (enciende la captura de
  la calculadora), y `antes-del-tms-tu-inbox` sigue en draft.
  En el Radar va **entre dos `</RadarItem>` y `<RadarItem`, nunca dentro**: los dos parsers leen
  esas etiquetas y rompería la verificación.
- **`CierreEstandar`**: tres salidas fijas siempre (curso · trabajar conmigo · responder), y
  `formato` solo decide cuál se destaca. **La salida 2 no dice "diagnóstico"**: `EMBUDO.md` dice
  que hoy no se ofrece.
- **`/panel`** (no `/admin`, que es lo que escanean los bots): 6 tablas tras contraseña con
  cookie firmada por HMAC. El gate va **en la página, no en `middleware.ts`**, porque el
  middleware corre en Edge y ahí no existe `node:crypto`. Y **no se nombra en `robots.txt`**:
  ese fichero es público y listarlo anuncia la ruta.
- **Chispa** (`src/components/assistant/`): dock de chat anclado a `src/lib/assistant-index.ts`
  para que no invente. Proveedor por env (`LLM_BASE_URL`/`LLM_API_KEY`/`LLM_MODEL`, Groq por
  defecto); sin clave responde un mensaje honesto, nunca un 500.
- **`IntentWizard`**: **opt-in**. Sus dos únicas puertas son `?wizard=1` y el chip del dock de
  Chispa. **No pide email a propósito**; el porqué está en `src/config/intent.ts`.
- **Intro scrollytelling** (`src/components/home/scrolly/`): tres escenas pinned, **después
  del masthead** (desde 2026-08-21 — el H1 abre la página; el cine demuestra el argumento,
  no lo retrasa). Con reduced-motion **no se atenúa: no se monta**. Los titulares de hype se
  pintan solo tras hidratar, para no dar a un crawler de IA dos docenas de frases que atribuir
  mal.
- **Archivo web de la newsletter** (`/newsletter`): las ediciones con `sent: true` en el
  frontmatter (volteado a mano tras el envío real), SSG con la misma HTML que recibieron los
  suscriptores. El gate vive en `src/lib/newsletter-archive.ts`, lib separada de
  `newsletter.tsx` para no arrastrar Resend/Supabase a la página. Un issue aprobado sin
  enviar da 404 — la promesa "antes que nadie" se cumple por construcción.

## GEO

**Hay**: `robots.ts` con un grupo por rastreador de IA, `TechArticle`/`Article` por `formato`,
`BreadcrumbList`, `DefinedTerm` en el glosario, `WebSite` + nodo `Person` con `sameAs` en la
home, `llms.txt` estático (`src/app/llms.txt/route.ts`, spec v2), `lastmod` real,
`AuthorBio`, `scripts/geo/audit-ssr.mjs` y `docs/geo-checklist.md`.

**No hay**: `SearchAction` (no hay buscador). `faqJsonLd()` ya tiene su primer llamador
real: el FAQ visible de `/newsletter` (preguntas reales — cadencia, precio, baja — con el
mismo texto en página y schema). Los `<Quiz>` siguen sin ser FAQ.

**Regla dura de `robots.ts`**: `PRIVATE_PATHS` es una constante única y **cada grupo nombrado la
repite**. Un bot que encuentra un grupo con su nombre ignora el `*` completo (RFC 9309 §2.2.1),
así que darle `Allow: /` a secas abriría todo lo que la lista protege.

## Correo — lo que hay que saber antes de tocarlo

- **Secuencia 0h / 48h / 96h** (`w1-bienvenida` / `w2-historia` / `w3-sistema`). El copy vive en
  `content/emails/*.md` y se edita sin tocar TS. Se programa en `/api/confirm` con `scheduledAt`
  de Resend (sin cron, máx. 30 días). **Best-effort**: si la tabla no existe o Resend falla, el
  opt-in nunca se rompe.
- **El paso 0 entrega algo**: `{{apertura_personalizada}}` renderiza el desglose de la
  calculadora **recalculado en servidor**, o la lección más fuerte si no hay fila.
- **Los placeholders van dentro de un enlace y Velite los percent-codifica**
  (`%7B%7Burl_sitio%7D%7D`). `renderTemplate` los normaliza antes de sustituir; sin eso el email
  sale perfecto con todos los botones muertos, que es lo que pasó durante tres semanas.
  `tests/email-template.test.ts` lo fija leyendo la salida del compilador, no el markdown.
- **Un placeholder sin resolver LANZA** y el paso se salta: un `{{typo}}` enviado no se deshace.
- **El guard anti-duplicado mira si hay CUALQUIER fila** en `scheduled_emails`, no clave por
  clave: comparar por clave rompía al renombrar una clave.
- **Modo prueba**: `POST /api/welcome-sequence/test` (Bearer `NEWSLETTER_SEND_SECRET`). Manda los
  3 con asunto `[PRUEBA]`, no escribe nada, y con `dryRun` devuelve el HTML. Es la única forma de
  revisar un cambio de copy sin esperar 4 días.
- **Todo email lleva `text/plain`.** Un email solo-HTML es señal de correo masivo y un mensaje en
  blanco para quien bloquea HTML.
- **`RESEND_REPLY_TO`**: el subdominio de envío no recibe correo. Sin esta env, las respuestas a
  "responde a este email" rebotan. Verificado end-to-end el 2026-08-05.
- **El boletín NO tiene breaker por cuota** (esto decía que sí): ante un 429 el bucle recorre la
  lista entera acumulando fallos. Y `sendIssue` no pagina — ver la deuda conocida en `ESTADO.md`.

## Modelo de datos

`RLS ON` en todas, default-deny. Escrituras vía servidor (`service_role`) o RPC
`SECURITY DEFINER` (`SET search_path=''`, `REVOKE EXECUTE FROM PUBLIC` + `GRANT` explícito).

- **`subscribers`** — `email citext unique`, `status enum(pending|confirmed|unsubscribed)`,
  `confirm_token_hash` (solo sha256; el token claro solo viaja en el email), `confirm_expires_at`,
  `unsubscribe_token unique`, `consent_ip`, `source` (cubo semántico: `footer`, `post-inline`,
  `lead_magnet:<slug>`, con sufijo `:<utm_source>`), `signup_path` (la ruta literal del alta),
  `locale`. Sin policies anon. Token CSPRNG, single-use, compare en tiempo constante. Respuesta
  200 genérica (anti-enumeración). **El `consent` se valida en servidor**, que es la prueba de
  base legal.
- **`scheduled_emails`** — `subscriber_id fk on delete cascade`, `email_key`, `resend_email_id`
  (para cancelar), `scheduled_at`, `unique(subscriber_id, email_key)`. Se borran al darse de baja.
- **`lead_magnet_submissions`** — `email citext` (**sin FK**: la fila se escribe ANTES de que
  exista el suscriptor), `magnet_slug`, `payload jsonb`, `source_path`. **El payload se recalcula
  en servidor**, nunca se guarda como lo mandó el cliente. **RGPD:** al no haber FK el borrado no
  cascadea; la baja llama a `deleteSubmissions()` y una supresión a mano necesita los dos `delete`.
  La política de privacidad ya afirma que se borran con la dirección.
- **`resources`** — `slug unique`, `file_path` (Storage), `requires_email`, `download_count`,
  `published`. `SELECT USING (published = true)`. Descarga: bucket **privado** +
  `createSignedUrl(path, 300, {download})` tras verificar email confirmado.
- **`newsletter_issues`** — claim de idempotencia por `issue_id`, insertado antes de enviar.
- **Fase 3**: `profiles` (= `auth.users.id`, `role enum(free|premium)`) y `subscriptions`
  (sin escritura cliente, solo webhook Stripe). **El suscriptor está desacoplado del usuario
  auth**: añadir cuentas de pago no refactoriza la lista.

## RGPD / AEPD

- Base legal = consentimiento (art. 6.1.a). **Doble opt-in** como prueba: `confirmed_at` +
  `consent_ip` + `source`.
- Checkbox separado, no pre-marcado. Turnstile + rate-limit en el endpoint público.
- Baja 1-clic (RFC 8058 `List-Unsubscribe` + `List-Unsubscribe-Post`).
- La política nombra subencargados (Supabase, Resend, Vercel) y la transferencia US bajo SCC+DPA.
  **No** afirmar "100% UE".
- Minimización: solo email. Borrado = hard-delete; re-suscripción = upsert, no duplicado.

## Infra (no volver a averiguarla)

- **Supabase**: proyecto EU dedicado `kata-ivanovych-blog`, ref `udluclqhfzdgvqpoezoo`,
  cuenta **separada** de la de NBI. **No está en el MCP** (que solo ve `Maître-prod` y `NbiOps`),
  y aunque lo estuviera su grupo Storage no sube ficheros: solo `list_storage_buckets` y la
  config. **Pero el CLI sí funciona**, autenticado y con el proyecto enlazado — corregido el
  2026-08-21, esto decía que desde aquí no se podía verificar el esquema y era falso:
  - `supabase db query "select …" --linked` — leer y escribir. **Sin `--linked` va a la base
    local** y falla con «relation does not exist».
  - `supabase storage ls|cp|mv ss:///<bucket>/<ruta> --experimental`. `cp` **no sobrescribe**
    (409) y `rm` **no borra** por ruta de objeto (devuelve `"deleted": []` sin tocar nada):
    para sustituir un fichero, `mv` el viejo a un lado y luego `cp`. Comprobar siempre bajándolo
    de vuelta y comparando el sha256.
- **Vercel**: team `nexoraprocesos-boops-projects`, proyecto `kata-ivanovych-blog`
  (`prj_1Cx7OZXAthH1N64qhhmpDOiVjTM7`). Dominio por A-record a `76.76.21.21`.
  **Cada push a `main` despliega.** Si falta `.vercel/project.json`, `vercel deploy` CREA un
  proyecto duplicado con el nombre del directorio: verificar el link antes de desplegar.
- **Resend**: `news.ianexora.com` verificado (DKIM+SPF+MX).
  `RESEND_FROM` = `Kata Ivanovych <news@news.ianexora.com>`.
- **Turnstile ACTIVO** (Managed, hostname `kata.ianexora.com`). `/api/subscribe` sin token
  devuelve `400 captcha`. Corolario: **los flujos de alta no se pueden probar con Playwright**,
  ni en modo headed. A mano.
- **Envs de producción**: `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_REPLY_TO`,
  `DOWNLOAD_LINK_SECRET`, `NEWSLETTER_SEND_SECRET`, `ADMIN_PANEL_SECRET`,
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `LLM_API_KEY`. Todas puestas.
  Las dos con `SECRET` en el nombre **las crea Kata a mano**, porque las usa desde un terminal y
  Vercel guarda como *Sensitive* lo que crea el agente. **`vercel env pull` devuelve la cadena
  literal `[SENSITIVE]`** para todas ellas, así que desde una sesión no hay forma de enviar el
  boletín ni de leer el `service_role`: eso es de Kata y punto.
