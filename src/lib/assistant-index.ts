import { allPosts } from "@/lib/posts";
import { glossary } from "@/lib/glossary";

export type SiteEntry = {
  title: string;
  route: string;
  dek: string;
  tipo: string;
};

/**
 * Inventory of every public thing Chispa can route you to — posts, glossary
 * terms, and the main sections. The LLM sees this as the only content it may
 * truthfully reference: answers keep pointing at real routes or say they don't
 * have the content (the anti-hallucination contract stops "he inventado algo").
 */
export function getAssistantIndex(): SiteEntry[] {
  const posts = allPosts.map((p) => ({
    title: p.title,
    route: p.permalink,
    dek: p.dek ?? p.description ?? "",
    tipo: p.formato === "radar" ? "noticia" : p.formato,
  }));

  const terms = Object.values(glossary).map((g) => ({
    title: g.title,
    route: g.relatedSlug ? `/blog/${g.relatedSlug}` : "/glosario",
    dek: g.def,
    tipo: "glosario",
  }));

  const sections: SiteEntry[] = [
    {
      title: "Curso de IA (desde cero)",
      route: "/empieza-aqui",
      dek: "Curso interactivo de IA, gratuito y sin cuenta, en orden.",
      tipo: "seccion",
    },
    {
      title: "Sistemas",
      route: "/sistemas",
      dek: "Sistemas montados en el negocio de Kata, cada uno con su factura.",
      tipo: "seccion",
    },
    {
      title: "Radar",
      route: "/radar",
      dek: "Semanal de IA, tecnología, empresas y geopolítica, verificado.",
      tipo: "seccion",
    },
    {
      title: "Recursos descargables",
      route: "/recursos",
      dek: "PDF, plantillas y herramientas de IA aplicada.",
      tipo: "seccion",
    },
    {
      title: "Glosario",
      route: "/glosario",
      dek: "Definiciones de términos de IA sin tecnicismos.",
      tipo: "seccion",
    },
    {
      title: "Trabajar con Kata",
      route: "/trabaja-con-nbi",
      dek: "Automatización de IA para tu negocio.",
      tipo: "seccion",
    },
    {
      title: "Sobre Kata",
      route: "/sobre-mi",
      dek: "Quién es, qué está construyendo en público.",
      tipo: "seccion",
    },
  ];

  return [...posts, ...terms, ...sections];
}