/**
 * Brand colors for transactional/newsletter emails — "Kata Pro" red/black premium.
 *
 * React Email renders inline styles and has no access to the CSS theme tokens in
 * globals.css. Emails use a LIGHT interpretation of the red/black identity
 * (cold off-white surface, near-black text, crimson accent) for deliverability —
 * a black background renders unreliably across mail clients. Keep the accent in
 * sync with the @theme crimson in src/app/globals.css.
 */
export const emailColors = {
  bg: "#f2f4f6", // cold off-white — page background
  card: "#ffffff", // card surface
  textMain: "#0a0b0d", // cold near-black — body text
  textMuted: "#6b6f76", // gunmetal — secondary text
  accent: "#b51d25", // crimson (darkened for AA on white, ~5:1) — links / accent
  buttonBg: "#b51d25", // button surface (cold-white label reads AA)
  onAccent: "#f2f4f6", // text over the button
  border: "#d8dce0",
} as const;
