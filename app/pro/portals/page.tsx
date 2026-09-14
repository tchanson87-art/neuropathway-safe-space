import Link from 'next/link'
import { HeartPulse, Home, Brain, Users, ArrowRight } from 'lucide-react'
import { LENS_ORDER, LENSES, type LensId } from '@/lib/np/portals'
import { PortalTabs } from './portal-tabs'

const LENS_ICON: Record<LensId, typeof HeartPulse> = {
  health: HeartPulse,
  social_care: Home,
  camhs: Brain,
  parent: Users,
}

const TOKEN_BG: Record<string, string> = {
  teal: 'bg-teal/15 text-teal',
  peach: 'bg-peach/25 text-foreground',
  lavender: 'bg-lavender/20 text-foreground',
  sky: 'bg-sky/20 text-foreground',
  mint: 'bg-mint/25 text-foreground',
}

export default function PortalsPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-balance">Professional portals</h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed text-pretty">
          Each portal is a lens onto the same child. Complete the EHCP-aligned questionnaire and
          record everyday observations — the platform interprets the answers into functional
          behaviour patterns framed for that professional’s own purpose. Needs first, never a
          diagnosis.
        </p>
      </div>

      <PortalTabs />

      <div className="grid gap-4 sm:grid-cols-2">
        {LENS_ORDER.map((id) => {
          const lens = LENSES[id]
          const Icon = LENS_ICON[id]
          return (
            <Link
              key={id}
              href={`/pro/portals/${id}`}
              className="group flex flex-col rounded-3xl border border-border bg-card p-5 transition-colors hover:bg-muted"
            >
              <span className={`mb-3 flex size-11 items-center justify-center rounded-2xl ${TOKEN_BG[lens.token]}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="font-display text-lg font-bold">{lens.label}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground leading-relaxed text-pretty">
                {lens.purpose}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Open portal
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
