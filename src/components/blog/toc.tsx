"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = { title: string; url: string; items?: TocItem[] };

function collectIds(items: TocItem[], acc: string[] = []): string[] {
  for (const item of items) {
    if (item.url?.startsWith("#")) acc.push(item.url.slice(1));
    if (item.items?.length) collectIds(item.items, acc);
  }
  return acc;
}

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = collectIds(items);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Tabla de contenidos" className="sticky top-24">
      <p className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-muted">
        En esta página
      </p>
      <TocTree items={items} active={active} />
    </nav>
  );
}

function TocTree({ items, active }: { items: TocItem[]; active: string }) {
  return (
    <ul className="space-y-2 border-l border-border text-sm">
      {items.map((item) => {
        const isActive = item.url === `#${active}`;
        return (
          <li key={item.url}>
            <a
              href={item.url}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 pl-3 transition-colors",
                isActive
                  ? "border-accent font-medium text-accent-ink"
                  : "border-transparent text-muted hover:text-fg",
              )}
            >
              {item.title}
            </a>
            {item.items && item.items.length > 0 ? (
              <div className="mt-2 pl-3">
                <TocTree items={item.items} active={active} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
