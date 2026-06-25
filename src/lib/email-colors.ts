/**
 * Brand colors for transactional/newsletter emails — "Kata Pro" (espresso · coral · cream).
 *
 * React Email renders inline styles and has no access to the CSS theme tokens in
 * globals.css, so the email palette lives here as the single source of truth.
 * Keep these in sync with the @theme block in src/app/globals.css. Emails stay on
 * the brand's LIGHT surfaces (espresso darks render unreliably across mail clients).
 */
export const emailColors = {
  bg: "#f4eee3", // warm cream — page background
  card: "#ffffff", // card surface
  textMain: "#241c16", // warm near-black — body text (AAA on cream)
  textMuted: "#6e6253", // secondary text (AA)
  accent: "#be3621", // coral-ink — links / accent text (AA on light)
  buttonBg: "#be3621", // button surface (white label reads AA, ~5.6:1)
  onAccent: "#ffffff", // text over the button
  border: "#e4daca",
} as const;
