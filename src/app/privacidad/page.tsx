import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Cómo trata ${siteConfig.name} tus datos personales.`,
  alternates: { canonical: "/privacidad" },
};

// TODO(katamv): revisar con tu asesor y ajustar responsable, dirección y email de contacto.
const CONTACT_EMAIL = `privacidad@${siteConfig.domain}`;

export default function PrivacyPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-fg">
          Política de privacidad
        </h1>
        <Prose className="mt-6">
          <h2>Responsable del tratamiento</h2>
          <p>
            {siteConfig.author.name} ({siteConfig.domain}). Para cualquier asunto
            relacionado con tus datos, escribe a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <h2>Qué datos tratamos y con qué fin</h2>
          <p>
            Si te suscribes a la newsletter, tratamos tu <strong>correo electrónico</strong>{" "}
            con la única finalidad de enviarte contenidos y recursos sobre
            inteligencia artificial. Para acreditar tu consentimiento guardamos
            también la <strong>fecha</strong>, la <strong>dirección IP</strong> y el{" "}
            <strong>origen</strong> de la suscripción. No pedimos más datos de los
            necesarios.
          </p>

          <h2>Base legal</h2>
          <p>
            El tratamiento se basa en tu <strong>consentimiento</strong> (art. 6.1.a
            RGPD), que prestas marcando la casilla del formulario. Usamos{" "}
            <strong>doble opt-in</strong>: solo te enviamos la newsletter después de
            que confirmes tu suscripción desde un email.
          </p>

          <h2>Encargados y transferencias internacionales</h2>
          <p>
            Nos apoyamos en proveedores que actúan como encargados del tratamiento:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> (base de datos, región UE — Frankfurt): almacena
              la lista de suscriptores.
            </li>
            <li>
              <strong>Resend</strong> (envío de email): el envío se realiza desde
              infraestructura de la UE, pero parte de los metadatos y registros se
              procesan en <strong>EE. UU.</strong> al amparo de las{" "}
              <strong>Cláusulas Contractuales Tipo</strong> de la Comisión Europea y de
              un acuerdo de tratamiento de datos (DPA).
            </li>
            <li>
              <strong>Vercel</strong> (hosting del sitio).
            </li>
          </ul>
          <p>
            Por tanto, existe una <strong>transferencia internacional</strong> de datos
            a EE. UU. cubierta por garantías adecuadas. No afirmamos un tratamiento
            «100% en la UE».
          </p>

          <h2>Conservación</h2>
          <p>
            Conservamos tus datos mientras sigas suscrito. Si te das de baja, dejamos de
            enviarte correos de inmediato y eliminamos tus datos cuando ya no son
            necesarios.
          </p>

          <h2>Tus derechos</h2>
          <p>
            Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición,
            limitación y portabilidad escribiendo a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Darte de baja es tan
            fácil como suscribirte: cada email incluye un enlace de{" "}
            <strong>cancelación en un clic</strong>. También tienes derecho a reclamar
            ante la Agencia Española de Protección de Datos (AEPD).
          </p>

          <h2>Analítica</h2>
          <p>
            Usamos analítica web respetuosa con la privacidad, sin cookies ni
            seguimiento individual, por lo que no requiere banner de consentimiento.
          </p>
        </Prose>
      </div>
    </Container>
  );
}
