/** Top reading-progress bar driven purely by CSS scroll-timeline (zero JS). */
export function ReadingProgress() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
    >
      <div className="reading-progress h-full w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-strong)]" />
    </div>
  );
}
