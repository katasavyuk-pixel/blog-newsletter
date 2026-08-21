import { allPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";

/**
 * /llms.txt — the curated site map for LLMs (llmstxt.org v2 spec).
 *
 * The decision this file closes was open since episode 1 stopped needing the
 * 404 as its "before" shot: `docs/geo-checklist.md` said "don't invest in
 * llms.txt", citing Ahrefs, and that reason was about *investing*. The settled
 * position (2026-08-21): Google ignores the file, but OpenAI and Microsoft
 * crawlers fetch it and the cost is one static route — a low-cost,
 * asymmetric-upside experiment. The site teaches exactly this in
 * /blog/maitreai-geo, so not shipping it here was an absence without a reason.
 *
 * Rules for editing:
 * - Every URL absolute, from `siteConfig.url` — agents follow links from here
 *   without knowing the domain's origin.
 * - No claims the evidence system could not back: this file describes what
 *   exists, never what is planned (the "en el taller" items stay out).
 * - Keep it small enough to fit in a context window; the site's depth lives
 *   behind the links, not in this file.
 */
export const dynamic = "force-static";

export function GET() {
  const url = siteConfig.url;
  // allPosts is already draft/premium-filtered and newest-first.
  const newestPost = allPosts[0];

  const body = `# ${siteConfig.name}

> ${siteConfig.tagline} — blog y newsletter en español sobre IA aplicada a negocio: cada sistema documentado con su coste real, un curso interactivo de IA y el Radar IA semanal. Autor: ${siteConfig.author.name}.

Este sitio publica en español. Su audiencia son emprendedores con un negocio en marcha que quieren aplicar IA sin humo: cada sistema documentado incluye qué hace, cuánto costó y qué se rompió. Las afirmaciones son verificables por diseño.

## Empezar

- [Curso interactivo de IA](${url}/empieza-aqui): seis lecciones gratuitas en orden, con widgets interactivos (tokenizador, sandbox de temperatura, calculadora de costes). Sin registro.
- [Biblioteca de Sistemas](${url}/sistemas): todo lo que el sitio regala, agrupado por tema, con el estado de evidencia de cada pieza.
- [Sobre el autor](${url}/sobre-mi): quién escribe, y por qué lo publica gratis.

## Contenido

- [Artículos](${url}/blog): el archivo completo — sistemas, lecciones interactivas, casos reales y notas.
${newestPost ? `- [Último artículo: ${newestPost.title}](${url}${newestPost.permalink}): ${newestPost.description}\n` : ""}- [Radar IA](${url}/radar): noticias de IA de la semana, filtradas y verificadas contra su fuente por un pipeline anti-alucinación con revisión humana.
- [Glosario de IA](${url}/glosario): términos de IA explicados sin rodeos, con el artículo donde se desarrollan.
- [Archivo de la newsletter](${url}/newsletter): las ediciones enviadas, en versión web.

## Recursos descargables

- [Recursos](${url}/recursos): herramientas listas para usar — prompt de auditoría GEO y checklist de datos logísticos. Entrega por email con doble opt-in.

## Identidad

- Autor: ${siteConfig.author.name}
- Contacto: ${siteConfig.contactEmail}
- RSS: ${url}/feed.xml
- Política de privacidad: ${url}/privacidad
`;

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
