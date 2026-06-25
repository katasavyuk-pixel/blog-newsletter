import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Baja", robots: { index: false } };

export default function BajaPage() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-3xl font-medium text-fg">
          Te has dado de baja
        </h1>
        <p className="mt-3 text-muted">
          No recibirás más emails. Si fue un error, puedes volver a suscribirte
          cuando quieras.
        </p>
        <div className="mt-6">
          <Button href="/">Volver al inicio</Button>
        </div>
      </div>
    </Container>
  );
}
