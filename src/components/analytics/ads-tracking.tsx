'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ConsentBanner, ConsentProvider, useConsent } from '@nexorabi/ads-os-tracking/react'
import { track } from '@nexorabi/ads-os-tracking'

const collectorUrl = process.env.NEXT_PUBLIC_ADS_OS_COLLECTOR_URL
const apiKey = process.env.NEXT_PUBLIC_ADS_OS_API_KEY

function PageViewTracker() {
  const pathname = usePathname()
  const { state } = useConsent()

  useEffect(() => {
    if (!state?.marketing) return
    track('PageView')
    if (pathname.startsWith('/blog/')) track('ViewContent', { content_type: 'article' })
  }, [pathname, state?.marketing])

  return null
}

export function AdsTracking({ children }: { children: React.ReactNode }) {
  if (!collectorUrl || !apiKey) return <>{children}</>

  return (
    <ConsentProvider
      config={{
        collectorUrl,
        apiKey,
        cookieDomain: '.ianexora.com',
        consentVersion: 2,
      }}
    >
      <PageViewTracker />
      {children}
      <ConsentBanner
        unstyled
        policyHref="/cookies"
        classNames={{
          root: 'fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center gap-3 border-t border-dark-border-2 bg-dark px-4 py-3 text-sm text-on-dark sm:px-6',
          text: 'm-0 min-w-0 flex-1 leading-snug text-on-dark-muted',
          actions: 'flex flex-none flex-wrap gap-2',
          button: 'rounded-full bg-accent px-4 py-2 text-xs font-semibold text-on-accent',
          buttonGhost: 'rounded-full border border-dark-border-2 px-4 py-2 text-xs font-semibold text-on-dark',
          panel: 'mt-2 flex basis-full flex-col gap-2 border-t border-dark-border-2 pt-3 text-xs text-on-dark-muted',
        }}
        texts={{
          message:
            'Usamos cookies necesarias para recordar tu decisión y, si nos das permiso, medición propia para saber qué contenidos y campañas generan oportunidades.',
          policyLabel: 'Política de cookies',
          accept: 'Aceptar medición',
          reject: 'Rechazar',
          configure: 'Configurar',
          savePreferences: 'Guardar preferencias',
          marketingTitle: 'Medición y atribución',
          marketingDescription:
            'Registra visitas, campañas y conversiones de forma seudonimizada. No activamos Meta ni publicidad comportamental en este momento.',
        }}
      />
    </ConsentProvider>
  )
}
