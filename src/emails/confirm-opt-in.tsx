import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { emailColors as c } from "@/lib/email-colors";
import { siteConfig } from "@/config/site";

// React Email renders to inline-styled HTML (no access to CSS tokens).
// Palette lives in src/lib/email-colors.ts — keep in sync with globals.css.
// Text-only masthead on purpose: no external logos or images, so the email
// renders identically with images blocked (most clients block them by default).
const main = { backgroundColor: c.bg, fontFamily: "Helvetica, Arial, sans-serif", color: c.textMain };
const container = { maxWidth: "480px", margin: "0 auto", padding: "32px", backgroundColor: c.card, borderRadius: "16px" };
const masthead = { color: c.accent, fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" as const, margin: 0 };
const mastheadDomain = { color: c.textMuted, fontSize: "12px", letterSpacing: "1px", margin: "4px 0 0" };
const button = { backgroundColor: c.buttonBg, color: c.onAccent, padding: "12px 22px", borderRadius: "999px", fontWeight: 600, textDecoration: "none", display: "inline-block" };
const muted = { color: c.textMuted, fontSize: "13px", lineHeight: "1.6" };
const footer = { color: c.textMuted, fontSize: "12px", lineHeight: "1.6", margin: 0 };

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
          <Text style={masthead}>{brand}</Text>
          <Text style={mastheadDomain}>{siteConfig.domain}</Text>
          <Hr style={{ borderColor: c.border, margin: "16px 0 20px" }} />

          <Heading style={{ fontSize: "22px", margin: "0 0 12px" }}>
            Confirma tu suscripción
          </Heading>
          <Text style={{ lineHeight: "1.6", margin: "0 0 12px" }}>
            Has solicitado suscribirte a la newsletter de <strong>{brand}</strong> desde{" "}
            {siteConfig.domain}. Antes de enviarte nada, necesito comprobar que esta
            dirección de correo es tuya.
          </Text>
          <Text style={{ lineHeight: "1.6", margin: "0 0 4px" }}>
            Pulsa el botón para confirmar tu email y completar el alta. Es el único
            paso que te pido.
          </Text>

          <Section style={{ margin: "24px 0" }}>
            <Button href={confirmUrl} style={button}>
              Confirmar suscripción
            </Button>
          </Section>

          <Text style={muted}>
            El enlace caduca en 24 horas. Si no funciona, copia y pega esta dirección
            en tu navegador:{" "}
            <Link href={confirmUrl} style={{ color: c.accent, wordBreak: "break-all" }}>
              {confirmUrl}
            </Link>
          </Text>
          <Text style={muted}>
            <strong>¿No has sido tú?</strong> Ignora este email: sin esa confirmación
            no quedarás suscrito y tu dirección no recibirá ningún envío.
          </Text>

          <Hr style={{ borderColor: c.border, margin: "28px 0 16px" }} />
          <Text style={footer}>
            {brand} ·{" "}
            <Link href={siteConfig.url} style={{ color: c.accent }}>
              {siteConfig.domain}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ConfirmOptInEmail;
