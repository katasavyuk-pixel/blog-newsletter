import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

/** Thin espresso ribbon above the header promoting the library. */
export function AnnouncementBar() {
  const text = siteConfig.announcement;
  if (!text) return null;
  const href = "/biblioteca";

  return (
    <div className="bg-dark text-on-dark-muted">
      <Container
        size="wide"
        className="flex items-center justify-center py-2 text-center font-display text-xs tracking-wide"
      >
        <Link href={href} className="transition-colors hover:text-on-dark">
          {text} <span className="text-salmon">→</span>
        </Link>
      </Container>
    </div>
  );
}
