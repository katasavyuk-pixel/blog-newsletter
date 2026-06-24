import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { emailColors as c } from "@/lib/email-colors";

// React Email renders to inline-styled HTML (no access to CSS tokens).
// Palette lives in src/lib/email-colors.ts — keep in sync with globals.css.
const main = { backgroundColor: c.bg, fontFamily: "Helvetica, Arial, sans-serif", color: c.textMain };
const container = { maxWidth: "480px", margin: "0 auto", padding: "32px", backgroundColor: c.card, borderRadius: "16px" };
const button = { backgroundColor: c.buttonBg, color: c.onAccent, padding: "12px 22px", borderRadius: "999px", fontWeight: 600, textDecoration: "none", display: "inline-block" };
const muted = { color: c.textMuted, fontSize: "13px", lineHeight: "1.6" };

export function ConfirmOptInEmail({
  confirmUrl,
  brand,
}: {
  confirmUrl: string;
  brand: string;
}) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Confirma tu suscripción a {brand}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={{ fontSize: "22px", margin: "0 0 12px" }}>
            Confirma tu suscripción
          </Heading>
          <Text style={{ lineHeight: "1.6" }}>
            Pulsa el botón para confirmar que quieres recibir la newsletter de{" "}
            <strong>{brand}</strong>. Solo tardarás un segundo.
          </Text>
          <Section style={{ margin: "24px 0" }}>
            <Button href={confirmUrl} style={button}>
              Confirmar suscripción
            </Button>
          </Section>
          <Text style={muted}>
            Si no te suscribiste tú, ignora este email. El enlace caduca en 24 horas.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ConfirmOptInEmail;
