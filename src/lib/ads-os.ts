import { identify, track } from '@nexorabi/ads-os-tracking'

export function recordNewsletterLead({ email, source }: { email: string; source: string }) {
  identify(`subscriber:${crypto.randomUUID()}`, {
    email,
    origenDeclarado: source,
  })
  track('Lead', { source }, { user: { email } })
}
