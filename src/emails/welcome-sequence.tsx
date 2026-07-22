import { Button, Link, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { emailColors as c } from "@/lib/email-colors";

/**
 * Welcome sequence — the 3 onboarding emails scheduled after double opt-in
 * (day 2 course, day 5 story, day 8 soft NBI pitch). Content only: each step
 * renders inside the shared <NewsletterEmail> shell, which carries the visible
 * unsubscribe footer. Scheduling/cancelling lives in src/lib/welcome-sequence.ts.
 */

const body = { lineHeight: "1.6", margin: "0 0 16px" } as const;
const button = {
  backgroundColor: c.buttonBg,
  color: c.onAccent,
  padding: "12px 22px",
  borderRadius: "999px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
} as const;
const link = { color: c.accent } as const;

export type SequenceStep = {
  /** Stable id stored in scheduled_emails.email_key. */
  key: string;
  /** Days after confirmation. */
  delayDays: number;
  subject: string;
  preview: string;
  title: string;
  content: (props: { siteUrl: string }) => ReactNode;
};

export const WELCOME_SEQUENCE: SequenceStep[] = [
  {
    key: "d2-curso",
    delayDays: 2,
    subject: "Tu ruta para entender la IA (interactiva y gratis)",
    preview: "6 lecciones donde tocas la IA, no solo lees sobre ella.",
    title: "Empieza por aquí",
    content: ({ siteUrl }) => (
      <>
        <Text style={body}>
          Antes de que llegue la próxima edición: lo mejor que tengo ya está
          publicado. Un curso gratuito de 6 lecciones interactivas donde no lees
          sobre IA — la tocas: escribes, ajustas parámetros y ves qué pasa.
        </Text>
        <Section style={{ margin: "24px 0" }}>
          <Button href={`${siteUrl}/empieza-aqui`} style={button}>
            Empezar el curso (gratis)
          </Button>
        </Section>
        <Text style={body}>
          Si prefieres picar algo suelto, dos favoritos:{" "}
          <Link href={`${siteUrl}/blog/que-es-un-token`} style={link}>
            ¿Qué es un token?
          </Link>{" "}
          (escribe y mira cómo te lee la IA) y{" "}
          <Link href={`${siteUrl}/blog/vida-de-un-prompt`} style={link}>
            La vida de un prompt
          </Link>{" "}
          (el viaje completo, paso a paso).
        </Text>
        <Text style={{ ...body, color: c.textMuted, fontSize: "13px" }}>
          Tu progreso se guarda solo en tu navegador — sin cuentas ni rastreo.
        </Text>
      </>
    ),
  },
  {
    key: "d5-historia",
    delayDays: 5,
    subject: "Por qué construyo esto en público",
    preview: "Ni gurú ni humo: un laboratorio a la vista.",
    title: "Por qué construyo esto en público",
    content: ({ siteUrl }) => (
      <>
        <Text style={body}>
          No soy un gurú de la IA. Construyo sistemas de IA reales para
          empresas, y este blog es mi laboratorio: todo lo que publico sale de
          esa trinchera — lo que funciona, lo que no, y lo que se rompió por el
          camino.
        </Text>
        <Text style={body}>
          Por eso el sitio entero es una caja de cristal: los artículos son
          interactivos, el código es público y las noticias del Radar IA pasan
          por un pipeline que no puede inventarse titulares.
        </Text>
        <Text style={body}>
          Me ayudaría mucho saber quién hay al otro lado: responde a este email
          y cuéntame qué te trae por aquí. Leo todas las respuestas.
        </Text>
        <Text style={{ ...body, margin: 0 }}>
          Más sobre mí:{" "}
          <Link href={`${siteUrl}/sobre-mi`} style={link}>
            {siteUrl.replace("https://", "")}/sobre-mi
          </Link>
        </Text>
      </>
    ),
  },
  {
    key: "d8-nbi",
    delayDays: 8,
    subject: "¿Aplicamos esto a tu empresa?",
    preview: "Si un proceso te devora horas, cuéntamelo — te respondo con honestidad.",
    title: "¿Y si esto lo aplicamos a tu empresa?",
    content: () => (
      <>
        <Text style={body}>
          Mi día a día es{" "}
          <Link href="https://ianexora.com" style={link}>
            Nexora Business Intelligence
          </Link>
          : montamos sistemas de IA que procesan documentos, emails y procesos
          repetitivos en empresas — con revisión humana donde toca y sin
          prometer magia.
        </Text>
        <Text style={body}>
          Si en tu empresa hay un proceso que devora horas (albaranes, facturas,
          emails de clientes…), responde a este email contándomelo y te digo con
          honestidad si la IA ayuda o no. Sin compromiso. También doy charlas y
          formación para equipos.
        </Text>
        <Text style={{ ...body, color: c.textMuted, fontSize: "13px", margin: 0 }}>
          Y si solo estás aquí por aprender: perfecto. La newsletter sigue igual,
          gratis y sin venta constante — este es el único email de este tipo.
        </Text>
      </>
    ),
  },
];
