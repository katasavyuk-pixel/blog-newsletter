/**
 * Brand colors for transactional/newsletter emails — "Atardecer Coral".
 *
 * React Email renders inline styles and has no access to the CSS theme tokens in
 * globals.css, so the email palette lives here as the single source of truth.
 * Keep these in sync with the @theme block in src/app/globals.css.
 */
export const emailColors = {
  bg: "#fff7f4", // warm cream — page background
  card: "#ffffff", // card surface
  textMain: "#3a1019", // wine-charcoal — body text
  textMuted: "#7a4e55", // secondary text
  accent: "#be123c", // coral-ink — links / accent text (AA on light)
  buttonBg: "#be123c", // button surface (coral-wine, cream text reads AA)
  onAccent: "#fff7f4", // cream text over the button
  border: "#f3d9dc",
} as const;
