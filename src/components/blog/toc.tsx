type TocItem = { title: string; url: string; items?: TocItem[] };

export function Toc({ items }: { items: TocItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Tabla de contenidos" className="sticky top-24">
      <p className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-muted">
        En esta página
      </p>
      <TocTree items={items} />
    </nav>
  );
}

function TocTree({ items }: { items: TocItem[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            className="block text-muted transition-colors hover:text-accent-ink"
          >
            {item.title}
          </a>
          {item.items && item.items.length > 0 ? (
            <div className="mt-2 border-l border-border pl-3">
              <TocTree items={item.items} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
