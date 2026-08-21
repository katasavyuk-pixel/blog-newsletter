import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DownloadButton } from "@/components/resources/download-button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Gracias", robots: { index: false } };

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ descarga?: string; error?: string; preview?: string }>;
}) {
  const sp = await searchParams;

  // Two failures that look the same to the reader and are not the same at all.
  // "Caducado" tells someone to sign up again, which is the right advice when
  // the link is old and terrible advice when our database refused the write:
  // they would keep signing up and keep landing here.
  if (sp.error) {
    const falloNuestro = sp.error === "guardado";
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="headline text-3xl text-fg">
            {falloNuestro ? "No he podido guardar tu confirmación" : "Enlace no válido"}
          </h1>
          <p className="mt-3 text-muted">
            {falloNuestro ? (
              <>
                El enlace era correcto: el fallo es mío, al guardarlo. Vuelve a pulsarlo
                dentro de un rato y, si sigue igual, escríbeme a{" "}
                <a href={`mailto:${siteConfig.replyEmail}`} className="text-accent-ink underline">
                  {siteConfig.replyEmail}
                </a>{" "}
                y lo confirmo a mano.
              </>
            ) : (
              <>
                El enlace de confirmación ha caducado o ya se usó. Vuelve a suscribirte y
                te enviamos uno nuevo.
              </>
            )}
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
        <h1 className="mt-5 headline text-3xl text-fg">
          ¡Suscripción confirmada!
        </h1>
        <p className="mt-3 text-muted">
          Gracias por confirmar. Ya estás dentro: te escribiré cuando tenga algo
          sobre IA que merezca la pena.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {sp.descarga ? (
            <DownloadButton
              href={`/api/download?slug=${encodeURIComponent(sp.descarga)}`}
              slug={sp.descarga}
            />
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
