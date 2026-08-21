# Monetización — secuencia y condiciones

Fecha: 2026-08-21 · Estado: **plan aprobado, sin construir**

> Este documento es un plan, no una autorización. `QUE_PUEDO_DECIR.md` es
> taxativo: **cero cobros por cualquier vía hasta que la capitalización esté
> resuelta**. Nada de lo que hay aquí se ejecuta antes de esa fecha, y el día
> que llegue, ese fichero se revisa entero antes de tocar Stripe.

## Por qué existe esto

La auditoría del 2026-08-21 preguntó cómo monetizar el blog. La respuesta corta
es que **la secuencia ya estaba bien elegida** (EMBUDO.md: 0 € activo es lo
correcto por debajo de 100 suscriptores) y lo que faltaba era escribirla en un
sitio que respueste tres preguntas: qué se construye, en qué orden, y qué señal
dispara cada paso.

La regla de secuencia viene de fuera: cada capa de monetización que se añade
antes de que la anterior funcione divide la atención, los envíos y los datos
(Matt McGarry; Alejandro Rioja — "model sprawl kills conversion on every model
simultaneously"). Con un tope de 1,5 h/semana, escoger **una** cosa es la
estrategia; las demás son distracciones.

## Lo que NO se hace (y por qué)

- **Nada de Stripe, afiliados, patrocinios, donaciones ni tarifas visibles
  antes del alta.** No es una priorización: es la ley del expediente
  (QUE_PUEDO_DECIR.md, "No, taxativamente").
- **Sin precio ni alcance de NBI definidos, no se construye superficie de
  venta.** Es el bloqueador nº1 de negocio ya anotado en ESTADO.md; ninguna
  capa de abajo lo sustituye.
- **Premium (Fase 3) no se construye.** La decisión de arquitectura sigue
  vigente: el suscriptor está desacoplado del usuario auth para que añadir
  cuentas de pago no refactorice la lista. Ese es todo el trabajo que la Fase 3
  exige *hoy*.

## La secuencia

### Paso 0 — ya hecho: capturar y nutrir (hoy)

El embudo actual: recurso gratuito → doble opt-in → secuencia 0h/48h/96h →
newsletter quincenal. La métrica de la fase es **conversaciones entrantes
cualificadas por cada 100 suscriptores** (respuesta describiendo su problema),
no el tamaño de la lista. Nada de lo que viene después acelera esto; esto es
lo que hace valioso lo que viene después.

### Paso 1 — servicio: la única capa activa desde el día 1 tras el alta

**Qué:** el "service upsell" — la newsletter posiciona, la conversación vende.
El formulario de `/trabaja-con-nbi` ya existe; lo único que cambia tras el alta
es que la respuesta puede acabar en oferta.

**Por qué primero:** es el único modelo que funciona con lista pequeña. Un
cliente de consultoría desde una lista de 200 personas supera en economía a
50.000 suscriptores monetizados con centavos (distinctful, Newsletter
Operator). Y encaja con la métrica de la fase: las conversaciones que ya se
miden son literalmente el pipeline de este paso.

**Señal para escalar:** conversaciones entrantes reales que describen un
problema repetible (≥2 con el mismo patrón). Ese patrón repetido es también el
input del paso 2 — las preguntas de los replies describen el producto antes de
construirlo.

**Condición dura:** precio y alcance de NBI definidos y escritritos. Sin eso,
la salida 2 del cierre sigue sin decir "diagnóstico", a propósito.

### Paso 2 — producto de pago único: la guía/plantilla vendible

**Qué:** un digital product de precio bajo-medio (guía, pack de plantillas,
playbook) nacido de lo que los suscriptores ya preguntan. El tipo exacto lo
decide el patrón del paso 1, no esta spec.

**Cuándo:** lista ≥500 y el patrón de preguntas identificado. El archivo web
de la newsletter (`/newsletter`, 2026-08-21) ya existe para dar prueba social
y contenido indexable que alimente este paso.

**Precio contra el resultado, no contra el formato:** una guía de 20 páginas
que ahorra 10 horas de prueba y error compite con la tarifa de esas horas, no
con el precio de un ebook. (Regla de precios de distinctful.)

### Paso 3 — patrocinios: solo cuando hay una segunda capa que los ancle

**Qué:** placements pequeños y estratificados (una mención premium + varias
classifieds por edición), vendidos directos a creadores/tools que sirven a la
misma audiencia — no a marcas con presupuesto de agencia.

**Cuándo:** ~5.000 suscriptores como suelo de credibilidad, o antes si el
engagement lo justifica (CTOR, no opens). La regla del market: un comprador de
lista pequeña es otro creador comparando el slot contra su alternativa real
(cold outreach), no una marca comparando CPMs.

**Por qué no antes:** los patrocinios pagan una fracción de lo que vale la
lista, una vez por envío, y a cambio del único activo que no se puede
recuperar: la atención del lector (distinctful). Se activan cuando ya hay
ingreso propio — así el precio del sponsor se calcula contra lo que vale un
envío para el negocio, no contra el rate card de un anunciante.

### Paso 4 — premium (Fase 3): la última, como estaba decidido

Cadencia semanal sostenida + ~500-1.000 suscriptores, tal como dice EMBUDO.md.
La arquitectura ya está preparada (`profiles` + `subscriptions` en el modelo de
datos, gating server-side en el diseño); no se construye nada hasta entonces.

## Qué se mide en cada paso

| Paso | Métrica de decisión | Umbral de avance |
|---|---|---|
| 0 → 1 | Conversaciones cualificadas / 100 subs | ≥2 con el mismo patrón |
| 1 → 2 | Patrón de preguntas repetido en replies | El patrón define el producto |
| 2 → 3 | Tamaño + engagement de la lista | ~5.000 subs o CTOR fuerte |
| 3 → 4 | Cadencia sostenible + lista | Semanal estable, 500-1.000 subs |

El open rate no decide nada (Apple Mail precarga píxeles). Reply rate, CTOR y
retención de cohorte, como siempre.

## Referencias

- `~/Developer/Marca-Personal/EMBUDO.md` — la mecánica vigente y las reglas
  legales (RGPD, consentimiento, por qué no se cobra aún).
- `~/Developer/Marca-Personal/QUE_PUEDO_DECIR.md` — el registro de compliance
  que gobierna todas las fechas de este documento.
- Investigación 2026-08-21 (web): Alejandro Rioja "How to Monetize a
  Newsletter: 5 Revenue Models"; distinctful "Monetize Without Sponsorships";
  Matt McGarry "Monetization 101"; Dr. Destini Copp "Sell Newsletter
  Sponsorships With a Small List"; beehiiv "Book Your First Sponsor". Las
  cifras concretas de esas piezas son ordenes de magnitud de blogs de
  herramientas, no benchmarks medidos — misma regla que EMBUDO.md aplica a los
  benchmarks de beehiiv.
