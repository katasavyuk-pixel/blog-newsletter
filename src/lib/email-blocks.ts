/**
 * Pre-rendered HTML blocks injected into the markdown sequence emails.
 *
 * Plain strings rather than React Email components: the surrounding body is
 * already an HTML string (compiled from markdown by Velite) that goes into the
 * shell via `dangerouslySetInnerHTML`. Rendering these as components would mean
 * serialising them back to HTML anyway, so the string is the honest form.
 *
 * Table-based and inline-styled because that is what mail clients support.
 */

import { emailColors as c } from "@/lib/email-colors";
import { escapeHtml } from "@/lib/email-template";
import { readCostPayload } from "@/lib/lead-magnets";
import { COST_MAGNET_SLUG } from "@/lib/cost-model";
import type { MagnetSubmission } from "@/lib/lead-magnets";

const P = `margin:0 0 16px;line-height:1.6;color:${c.textMain};font-size:15px`;
const CELL = `padding:10px 12px;border-bottom:1px solid ${c.border};font-size:14px`;

export function button(href: string, label: string): string {
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px"><tr><td` +
    ` style="background-color:${c.buttonBg};border-radius:999px">` +
    `<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;color:${c.onAccent};` +
    `font-weight:600;text-decoration:none;font-size:15px">${escapeHtml(label)}</a>` +
    `</td></tr></table>`
  );
}

/**
 * The reader's own cost breakdown, recomputed from the stored inputs.
 *
 * Includes the formula spelled out, because the capture form promises they can
 * redo the calculation on their own project — and a promise of "a template"
 * that arrives as three numbers and nothing else is not kept. The formula is the
 * deliverable; it fits in a spreadsheet.
 */
export function costBreakdown(submission: MagnetSubmission): string | null {
  const cost = readCostPayload(submission.payload);
  if (!cost) return null;

  const row = (label: string, value: string, strong = false) =>
    `<tr><td style="${CELL};color:${c.textMuted}">${escapeHtml(label)}</td>` +
    `<td style="${CELL};text-align:right;font-weight:${strong ? 700 : 400};` +
    `color:${strong ? c.accent : c.textMain}">${escapeHtml(value)}</td></tr>`;

  return (
    `<p style="${P}">Esto es lo que calculaste, para que lo tengas por escrito:</p>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" ` +
    `style="border:1px solid ${c.border};border-radius:12px;margin:0 0 16px">` +
    row("Modelo", cost.modelLabel) +
    row("Tokens de entrada por petición", String(cost.inTok)) +
    row("Tokens de salida por petición", String(cost.outTok)) +
    row("Peticiones al día", String(cost.reqs)) +
    row("Coste por petición", cost.perReq) +
    row("Coste al día", cost.perDay) +
    row("Coste al mes", cost.perMonth, true) +
    `</table>` +
    `<p style="${P}">Y la fórmula, para rehacerlo con los precios y el volumen de tu ` +
    `proyecto en una hoja de cálculo:</p>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" ` +
    `style="background-color:${c.bg};border-radius:12px;margin:0 0 16px">` +
    `<tr><td style="padding:14px 16px;font-family:monospace;font-size:13px;line-height:1.7;` +
    `color:${c.textMain}">` +
    `coste_peticion = (tokens_entrada × precio_entrada<br>` +
    `&nbsp;&nbsp;+ tokens_salida × precio_salida) ÷ 1.000.000<br>` +
    `coste_mes = coste_peticion × peticiones_dia × 30` +
    `</td></tr></table>` +
    `<p style="${P};color:${c.textMuted};font-size:13px">Los precios van por millón de tokens y ` +
    `son los públicos de cada modelo, así que es una estimación: cámbialos por los tuyos si has ` +
    `negociado tarifa. Y ojo con los bucles — una IA que llama a otra multiplica las peticiones, ` +
    `no las suma.</p>`
  );
}

/**
 * Opening block of the first email: what this reader actually asked for.
 *
 * Two variants and no third: whoever came through a magnet gets the thing they
 * came for, and whoever signed up from the footer gets the strongest piece on
 * the site. There is no version of this email that opens with nothing.
 */
export function openingBlock(
  siteUrl: string,
  submission: MagnetSubmission | null,
): string {
  if (submission?.magnetSlug === COST_MAGNET_SLUG) {
    const breakdown = costBreakdown(submission);
    if (breakdown) return breakdown;
  }

  return (
    `<p style="${P}">Si tienes diez minutos, empieza por aquí: un recorrido paso a paso ` +
    `por lo que le pasa a tu frase desde que la escribes hasta que sale la respuesta. ` +
    `Se baja con el ratón y va montándose delante.</p>` +
    button(`${siteUrl}/blog/vida-de-un-prompt`, "La vida de un prompt")
  );
}

/** Download button for a gated resource, or nothing. */
export function downloadBlock(url: string | null, label: string): string {
  if (!url) return "";
  return (
    `<p style="${P}">Y aquí tienes la descarga que pediste:</p>` + button(url, label)
  );
}

/**
 * Body of the standalone "here is what you asked for" email.
 *
 * Separate from `openingBlock` on purpose, and the difference is the whole
 * point. The first onboarding email opens with *something* by design — whoever
 * arrives with no history still gets the strongest lesson on the site. A
 * delivery is the opposite: the reader asked one question a minute ago, and
 * the answer is the only thing that belongs in it.
 *
 * Composing them the other way round is exactly what shipped on 2026-08-21:
 * someone asked for the GEO prompt and the email led with a cost breakdown
 * from a calculator visit weeks earlier, because `getLatestSubmission` returns
 * the latest row for that address regardless of what was just requested. The
 * download was underneath, and correct, and nobody would have scrolled to it.
 *
 * Returns null when there is nothing concrete to hand over. Callers must not
 * send in that case: an email titled "aquí tienes lo que pediste" that carries
 * a blog link is worse than the silence it replaces.
 */
export function resourceDeliveryBody(args: {
  downloadUrl: string | null;
  downloadLabel: string;
  submission: MagnetSubmission | null;
}): string | null {
  if (args.downloadUrl) {
    return (
      `<p style="${P}">Tu dirección ya estaba confirmada, así que va directo, sin pasos de más:</p>` +
      button(args.downloadUrl, args.downloadLabel) +
      `<p style="${P};color:${c.textMuted};font-size:13px">El enlace vale 30 días. Si se te pasa, ` +
      `vuelve a pedirlo y te llega otro.</p>`
    );
  }

  // No file: the only other thing worth calling a delivery is the reader's own
  // numbers, which is what the calculator promises in exchange for an address.
  if (args.submission?.magnetSlug === COST_MAGNET_SLUG) {
    return costBreakdown(args.submission);
  }

  return null;
}
