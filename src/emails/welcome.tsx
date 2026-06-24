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

const main = { backgroundColor: c.bg, fontFamily: "Helvetica, Arial, sans-serif", color: c.textMain };
const container = { maxWidth: "480px", margin: "0 auto", padding: "32px", backgroundColor: c.card, borderRadius: "16px" };
const button = { backgroundColor: c.buttonBg, color: c.onAccent, padding: "12px 22px", borderRadius: "999px", fontWeight: 600, textDecoration: "none", display: "inline-block" };

export function WelcomeEmail({
  brand,
  downloadUrl,
}: {
  brand: string;
  downloadUrl?: string;
}) {
  return (
    <Html lang="es">
      <Head />
      <Preview>¡Bienvenido a {brand}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={{ fontSize: "22px", margin: "0 0 12px" }}>
            ¡Ya estás dentro!
          </Heading>
          <Text style={{ lineHeight: "1.6" }}>
            Gracias por confirmar. Te escribiré cuando tenga algo sobre IA que
            merezca la pena: nada de spam.
          </Text>
          {downloadUrl ? (
            <Section style={{ margin: "24px 0" }}>
              <Button href={downloadUrl} style={button}>
                Descargar tu recurso
              </Button>
            </Section>
          ) : null}
          <Text style={{ color: c.textMuted, fontSize: "13px", lineHeight: "1.6" }}>
            — {brand}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
