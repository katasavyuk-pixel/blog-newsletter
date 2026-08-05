import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getFunnel, type CountRow } from "@/lib/funnel";
import {
  PANEL_COOKIE,
  isPanelConfigured,
  verifySession,
} from "@/lib/panel-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Not in sitemap.ts either. Both matter: noindex keeps it out of results, and a
// route absent from the sitemap is not advertised in the first place.
export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

function Tabla({
  titulo,
  nota,
  rows,
  cabecera,
}: {
  titulo: string;
  nota?: string;
  rows: (string | number)[][];
  cabecera: string[];
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-lg font-semibold text-fg">{titulo}</h2>
      {nota ? <p className="mt-1 text-sm text-muted">{nota}</p> : null}
      {rows.length === 0 ? (
        <p className="mt-3 font-mono text-sm text-faint">Sin datos todavía.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {cabecera.map((h) => (
                  <th
                    key={h}
                    className="py-2 pr-4 font-mono text-xs font-normal uppercase tracking-wider text-faint"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/60">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-2 pr-4 ${j === 0 ? "text-fg" : "font-mono tabular-nums text-muted"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Login({ error }: { error: boolean }) {
  return (
    <Container className="py-24">
      <form
        action="/api/panel/login"
        method="POST"
        className="mx-auto max-w-sm"
      >
        <h1 className="headline text-3xl text-fg">Panel</h1>
        <label htmlFor="password" className="mt-6 block text-sm text-muted">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm text-fg"
        />
        {error ? (
          <p className="mt-3 text-sm text-danger" role="alert">
            No es correcta.
          </p>
        ) : null}
        <div className="mt-4">
          <Button type="submit">Entrar</Button>
        </div>
      </form>
    </Container>
  );
}

const pct = (v: number | null) => (v === null ? "—" : `${Math.round(v * 100)}%`);
const rowsOf = (rows: CountRow[]) => rows.map((r) => [r.label, r.count]);

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  if (!isPanelConfigured()) {
    return (
      <Container className="py-24">
        <p className="text-muted">
          El panel está desactivado: falta <code>ADMIN_PANEL_SECRET</code>.
        </p>
      </Container>
    );
  }

  const session = (await cookies()).get(PANEL_COOKIE)?.value;
  if (!verifySession(session)) return <Login error={Boolean(sp.error)} />;

  if (!isSupabaseConfigured()) {
    return (
      <Container className="py-24">
        <p className="text-muted">Supabase no está configurado.</p>
      </Container>
    );
  }

  const f = await getFunnel(createAdminClient());

  return (
    <Container className="py-16">
      <h1 className="headline text-3xl text-fg">Embudo</h1>
      <p className="mt-2 text-sm text-muted">
        Números, sin gráficas. {f.total} suscriptores en la lista.
        {f.truncated
          ? " Aviso: se ha alcanzado el tope de filas; toca mover la agregación a SQL."
          : ""}
      </p>

      <Tabla
        titulo="Estado de la lista"
        nota={`Tasa de confirmación: ${pct(f.tasaConfirmacion)} — quien se da de baja confirmó antes, así que cuenta como confirmado.`}
        cabecera={["estado", "personas"]}
        rows={[
          ["pending", f.porEstado.pending],
          ["confirmed", f.porEstado.confirmed],
          ["unsubscribed", f.porEstado.unsubscribed],
          ["bajas últimos 30 días", f.bajas30d],
        ]}
      />

      <Tabla
        titulo="Altas por semana"
        nota="Últimas 12 semanas. Las semanas vacías se muestran a propósito: un hueco en la cadencia es información."
        cabecera={["semana (lunes)", "altas", "confirmadas"]}
        rows={f.semanas.map((w) => [w.week, w.altas, w.confirmadas])}
      />

      <Tabla
        titulo="Por página de alta"
        nota="signup_path: la ruta literal donde ocurrió el alta. Responde qué artículo capta."
        cabecera={["ruta", "altas"]}
        rows={rowsOf(f.porSignupPath)}
      />

      <Tabla
        titulo="Por origen"
        nota="source: el cubo semántico (footer, post-inline, lead_magnet:…, con sufijo :utm_source cuando lo hay)."
        cabecera={["origen", "altas"]}
        rows={rowsOf(f.porSource)}
      />

      <Tabla
        titulo="Calculadora de costes"
        nota="«Desgloses pedidos» son envíos solicitados, NO usos. Usar la calculadora no toca el servidor — el uso está en Vercel Web Analytics, evento calculadora_usada."
        cabecera={["métrica", "valor"]}
        rows={[
          ["desgloses pedidos", f.calculadora.desglosesPedidos],
          ["direcciones distintas", f.calculadora.direcciones],
          ["de esas, confirmadas", f.calculadora.confirmadas],
        ]}
      />

      <Tabla
        titulo="Secuencia de bienvenida"
        nota="Aperturas no aparecen: requieren un webhook de Resend que no existe, y el open rate no sirve para decidir (Apple Mail precarga los píxeles)."
        cabecera={["paso", "enviados", "pendientes"]}
        rows={f.secuencia.map((s) => [s.key, s.enviados, s.pendientes])}
      />
    </Container>
  );
}
