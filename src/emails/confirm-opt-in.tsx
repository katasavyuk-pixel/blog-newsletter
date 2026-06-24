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

// React Email renders to inline-styled HTML, so brand colors are literal here
// (no access to our CSS tokens).
const main = { backgroundColor: "#f4f6fb", fontFamily: "Helvetica, Arial, sans-serif", color: "#16203a" };
const container = { maxWidth: "480px", margin: "0 auto", padding: "32px", backgroundColor: "#ffffff", borderRadius: "16px" };
const button = { backgroundColor: "#00d4ff", color: "#0b1220", padding: "12px 22px", borderRadius: "999px", fontWeight: 600, textDecoration: "none", display: "inline-block" };
const muted = { color: "#515b70", fontSize: "13px", lineHeight: "1.6" };

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
