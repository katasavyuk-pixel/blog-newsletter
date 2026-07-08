import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Gracias", robots: { index: false } };

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ descarga?: string; error?: string; preview?: string }>;
}) {
  const sp = await searchParams;

  if (sp.error) {
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-display text-3xl font-medium text-fg">
            Enlace no válido
          </h1>
          <p className="mt-3 text-muted">
            El enlace de confirmación ha caducado o ya se usó. Vuelve a suscribirte y
            te enviamos uno nuevo.
          </p>
          <div className="mt-6">
            <Button href="/">Volver al inicio</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-24">
      <div className="mx-auto max-w-xl text-center">
        <span
          aria-hidden
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-on-accent"
        >
          ✓
        </span>
        <h1 className="mt-5 font-display text-3xl font-medium text-fg">
          ¡Suscripción confirmada!
        </h1>
        <p className="mt-3 text-muted">
          Gracias por confirmar. Ya estás dentro: te escribiré cuando tenga algo
          sobre IA que merezca la pena.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {sp.descarga ? (
            <Button href={`/api/download?slug=${encodeURIComponent(sp.descarga)}`}>
              Descargar tu recurso
            </Button>
          ) : null}
          <Button href="/blog" variant={sp.descarga ? "secondary" : "primary"}>
            Leer el blog
          </Button>
        </div>
        {sp.preview ? (
          <p className="mt-6 text-sm text-muted">
            (Modo previsualización: Supabase/Resend aún no configurados.)
          </p>
        ) : null}
      </div>
    </Container>
  );
}
