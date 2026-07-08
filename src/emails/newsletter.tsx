import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { emailColors as c } from "@/lib/email-colors";

const main = { backgroundColor: c.bg, fontFamily: "Helvetica, Arial, sans-serif", color: c.textMain };
const container = { maxWidth: "560px", margin: "0 auto", padding: "32px", backgroundColor: c.card, borderRadius: "16px" };

/**
 * Base layout for a newsletter issue. `unsubscribeUrl` is required so every
 * broadcast carries a working one-click unsubscribe (RFC 8058 + visible link).
 */
export function NewsletterEmail({
  brand,
  preview,
  title,
  unsubscribeUrl,
  children,
}: {
  brand: string;
  preview: string;
  title: string;
  unsubscribeUrl: string;
  children: ReactNode;
}) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={{ color: c.accent, fontSize: "13px", fontWeight: 600, margin: 0 }}>
            {brand}
          </Text>
          <Heading style={{ fontSize: "24px", margin: "8px 0 16px" }}>{title}</Heading>
          {children}
          <Hr style={{ borderColor: c.border, margin: "28px 0 16px" }} />
          <Text style={{ color: c.textMuted, fontSize: "12px", lineHeight: "1.6" }}>
            Recibes este email porque te suscribiste a {brand}.{" "}
            <Link href={unsubscribeUrl} style={{ color: c.accent }}>
              Cancelar suscripción
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default NewsletterEmail;
