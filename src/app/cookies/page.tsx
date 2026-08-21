import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Cookies necesarias y medición opcional de kata.ianexora.com.",
};

export default function CookiesPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="headline text-4xl text-fg">Política de cookies</h1>
        <Prose className="mt-6">
          <h2>Qué utilizamos</h2>
          <p>
            Esta web usa una cookie necesaria, <code>_ao_consent</code>, para recordar si has
            aceptado o rechazado la medición. Si aceptas la medición opcional, también guardamos
            <code>_ao_attr</code> durante 90 días para conservar los parámetros de la primera visita
            (por ejemplo, UTM) y atribuir una suscripción al canal que la originó.
          </p>
          <h2>Para qué sirve la medición</h2>
          <p>
            El colector propio registra visitas, lectura de artículos y conversiones de newsletter.
            Cuando un formulario se envía, el email se transforma en el colector en un hash no
            reversible. No activamos Meta ni publicidad comportamental.
          </p>
          <h2>Cómo rechazarla</h2>
          <p>
            Puedes pulsar «Rechazar» en el aviso o borrar las cookies desde tu navegador. Rechazar
            la medición no afecta al contenido, las herramientas ni la suscripción.
          </p>
          <p>
            Para cualquier consulta, escribe a <a href="mailto:nexoraprocesos@gmail.com">nexoraprocesos@gmail.com</a>.
          </p>
        </Prose>
      </div>
    </Container>
  );
}
