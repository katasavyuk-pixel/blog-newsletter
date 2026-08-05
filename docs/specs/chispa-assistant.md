# Chispa — asistente persistente del sitio

Fecha: 2026-08-05 · Estado: implementado y verificado en localhost

## Qué es

Chispa (la mascota del wizard) pasa a ser un **asistente de IA persistente**:
botón flotante abajo-derecha en todas las páginas que abre un panel de chat.
Responde preguntas anclándose **solo** al contenido del sitio (posts, glosario,
curso, radar, secciones) para evitar alucinaciones; si no lo tiene, lo dice y
remite a contacto. Copy honesto, alineado con `QUE_PUEDO_DECIR.md`.

## Arquitectura

- `src/config/assistant.ts` — fuente única: `COMPANION` (nombre, saludo,
  placeholder, mensajes offline/error) y `QUICK_ACTIONS` (chips mixtos
  pregunta/navegación).
- `src/lib/assistant-index.ts` — `getAssistantIndex()`: índice `SiteEntry[]`
  construido desde posts (Velite), glosario y secciones estáticas. Se inyecta
  en el system prompt como único conocimiento.
- `src/app/api/assistant/route.ts` — POST `runtime: nodejs`, rate-limit en
  memoria (`assistant:${ip}`, 5/min), validación zod (query 2-600 chars,
  historial máx 10). Protocolo OpenAI-compatible, proveedor neutro por env:
  - `LLM_BASE_URL` (default `https://api.groq.com/openai/v1`)
  - `LLM_API_KEY`
  - `LLM_MODEL` (default `llama-3.3-70b-versatile`)
  Sin clave → `{ ok, reply: null, unconfigured }`. `402/429` del proveedor →
  misma respuesta honesta de "no conectada". Otros fallos → 502 `upstream`.
- `src/components/assistant/assistant-dock.tsx` — dock global montado en
  `layout.tsx` (junto a `IntentWizard`). Panel `motion.section`, header con
  mascota, thread con auto-scroll, chips, composer. `renderReply` convierte
  markdown `[texto](/ruta)` y rutas sueltas en `<Link>` limpios.

## Proveedor

Groq free tier (sin tarjeta, ~30 req/min, cuota diaria generosa, latencia
muy baja). Funciona con el Mac apagado (hosteado). Cambiar de proveedor =
cambiar 3 vars en `.env.local` / Vercel. Fallbacks documentados en
`.env.example` (Gemini AI Studio, Cloudflare Workers AI).

**Pendiente para despliegue:** subir `LLM_API_KEY` (+ vars) a Vercel.

## Verificado

- Respuestas reales ancladas (radar, RAG, curso) con enlaces navegables.
- Quick-actions navegan y cierran el panel.
- `npx eslint src` y `npx tsc --noEmit` limpios.
- Bugs corregidos en verificación: header HTTP con `—` (bytestring inválido),
  modelo inexistente en OpenRouter, 402→mensaje honesto, markdown suelto.
