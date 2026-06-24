/** Central glossary for the <Term> hover/focus popover. Grows over time. */
export type GlossaryEntry = { title: string; def: string };

export const glossary: Record<string, GlossaryEntry> = {
  token: {
    title: "Token",
    def: "La unidad mínima que procesa un modelo de lenguaje: trozos de palabra, no letras ni palabras enteras. El precio y el límite de contexto se miden en tokens.",
  },
  embedding: {
    title: "Embedding",
    def: "Representación de un texto como un vector de números. Textos con significado parecido quedan cerca en ese espacio: la base de la búsqueda semántica y de RAG.",
  },
  rag: {
    title: "RAG",
    def: "Retrieval-Augmented Generation: recuperar fragmentos relevantes de tus datos y dárselos al modelo como contexto antes de que responda, para reducir alucinaciones.",
  },
  prompt: {
    title: "Prompt",
    def: "Las instrucciones y el contexto que le das al modelo. Pequeños cambios en el prompt pueden cambiar mucho la respuesta.",
  },
  hallucination: {
    title: "Alucinación",
    def: "Cuando el modelo responde con algo plausible pero falso (datos, citas o fechas inventadas) con total seguridad. Fluido no es lo mismo que correcto.",
  },
  temperature: {
    title: "Temperatura",
    def: "Parámetro que controla la aleatoriedad de la generación: cerca de 0 es determinista y conservador; alto, más diverso y caótico.",
  },
  attention: {
    title: "Atención",
    def: "El mecanismo por el que cada token decide a qué otros tokens 'mirar' para construir su significado en contexto. El corazón del transformer.",
  },
  "context-window": {
    title: "Ventana de contexto",
    def: "La cantidad máxima de tokens (entrada + salida) que el modelo puede tener en cuenta a la vez. Si te pasas, se trunca.",
  },
};
