import Link from "next/link";
import { navLinks } from "@/config/site";

/** Primary navigation links (hidden on small screens; see Header for mobile). */
export function Nav() {
  return (
    <nav aria-label="Navegación principal" className="hidden items-center gap-1 sm:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-fg"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
