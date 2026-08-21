import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAssistantIndex } from "@/lib/assistant-index";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  query: z.string().trim().min(2).max(600),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(1200) }))
    .max(10)
    .default([]),
});

const BASE_URL =
  process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1";
const MODEL = process.env.LLM_MODEL ?? "llama-3.3-70b-versatile";
const KEY = process.env.LLM_API_KEY;

function buildSystem(): string {
  const index = getAssistantIndex()
    .map((e) => `- "${e.title}" (${e.tipo}) · ${e.dek} → ${e.route}`)
    .join("\n");

  return [
    "Eres Chispa, la asistente de IA del sitio personal de Kata Ivanovych (kata.ianexora.com).",
    "Es un blog y newsletter de IA aplicada a negocio: construcción pública, sistemas, curso, glosario y un radar semanal.",
    "",
    "REGLA DE ORO (anti-alucinación): responde SIEMPRE y SOLO basándote en el CONTENIDO de abajo.",
    "- Si la pregunta coincide con una entrada, responde breve (2-4 frases) y apunta al enlace con el texto del título, p. ej. «Te interesa _Que es RAG_ → /blog/que-es-rag».",
    "- Si es una petición práctica, ofrece la ruta: curso → /empieza-aqui, sistemas → /sistemas, radar → /radar, newsletter (suscribirse o ver ediciones enviadas) → /newsletter, recursos → /recursos, glosario → /glosario.",
    "- Si la pregunta NO es de este sitio o no está en el contenido, dila con gracia: 'no lo tengo, pero pregunta por X o escribe a info@ianexora.com'. NUNCA improvises datos, cifras, fechas ni opiniones.",
    "- Lenguaje natural, cálido, cercano a un colega: un tocón de entusiasmo sin humo. Menos es más: respuestas cortas, español.",
    // QUE_PUEDO_DECIR.md: Kata trabaja solo y no puede atribuirse personalidad
    // jurídica hasta que se resuelva la capitalización. El plural de cortesía ya
    // se coló una vez en un email programado; aquí lo generaría un modelo en cada
    // respuesta, así que la regla va en el prompt.
    "- Kata trabaja solo: habla de él en singular y en tercera persona ('el sitio de Kata', 'lo que monta Kata'). NUNCA uses el plural de cortesía ('nuestro sitio', 'montamos', 'nuestro equipo'), y no digas ni insinúes que hay una empresa o un equipo detrás.",
    "- Las rutas internas son caminos relativos (empezando por /) que el frontend enlaza.",
    "",
    "CONTENT (todo lo que sé — y solo esto):",
    index,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`assistant:${ip}`)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // No key → the client flags "no estoy conectada", not a 500.
  if (!KEY) {
    return NextResponse.json({ ok: true, reply: null, unconfigured: true });
  }

  const messages: { role: string; content: string }[] = [
    { role: "system", content: buildSystem() },
    ...body.history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: body.query },
  ];

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
        "HTTP-Referer": "https://kata.ianexora.com",
        "X-Title": "Kata Ivanovych · Chispa",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 520,
        temperature: 0.3,
        messages,
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      if (res.status === 402 || res.status === 429) {
        return NextResponse.json({ ok: true, reply: null, unconfigured: true });
      }
      return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ ok: false, error: "empty" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, reply });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}