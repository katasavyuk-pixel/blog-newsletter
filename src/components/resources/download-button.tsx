'use client'

import { track } from '@nexorabi/ads-os-tracking'

export function DownloadButton({ href, slug }: { href: string; slug: string }) {
  return (
    <a
      href={href}
      onClick={() => track('Download', { resource: slug })}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong"
    >
      Descargar tu recurso
    </a>
  )
}
