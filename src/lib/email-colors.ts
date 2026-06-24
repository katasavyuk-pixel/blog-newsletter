/**
 * Brand colors for transactional/newsletter emails — "Kata Pro" (red/black).
 *
 * React Email renders inline styles and has no access to the CSS theme tokens in
 * globals.css, so the email palette lives here as the single source of truth.
 * Keep these in sync with the @theme block in src/app/globals.css.
 * AA-verified on the dark email background (#0A0205).
 */
export const emailColors = {
  bg: "#0a0205", // near-black base — page background
  card: "#1a0509", // card surface (raised dark panel)
  textMain: "#ffffff", // white — body text (~20:1 on card)
  textMuted: "#c9b6b9", // secondary text — tenue rose-grey (~10:1)
  accent: "#ff3a44", // bright red — links / accent text (AA on dark)
  buttonBg: "#d7212a", // red button surface (white text reads AA)
  onAccent: "#ffffff", // white text over the red button
  border: "#4a1620", // dark red-tinted hairline
} as const;
