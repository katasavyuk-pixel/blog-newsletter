import Link from "next/link";
import { navLinks } from "@/config/site";

const linkBase =
  "relative rounded-lg px-3 py-2 text-sm font-medium text-on-dark-muted transition-colors hover:text-on-dark after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100";

/** Primary navigation: inline links on desktop, a no-JS <details> menu on mobile. */
export function Nav() {
  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="hidden items-center gap-1 sm:flex"
      >
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className={linkBase}>
            {link.label}
          </Link>
        ))}
      </nav>

      <details className="relative sm:hidden">
        <summary
          aria-label="Abrir menú"
          className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-dark-border-3 text-on-dark [&::-webkit-details-marker]:hidden"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </summary>
        <div className="absolute right-0 top-11 z-50 flex w-52 flex-col gap-1 rounded-xl border border-dark-border-2 bg-dark p-2 shadow-card-hover">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkBase}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/#newsletter"
            className="mt-1 rounded-lg bg-accent px-3 py-2 text-center text-sm font-semibold text-on-accent"
          >
            Suscríbete
          </Link>
        </div>
      </details>
    </>
  );
}
