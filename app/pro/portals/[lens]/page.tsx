import { notFound } from 'next/navigation'
import { HeartPulse, Home, Brain, Users } from 'lucide-react'
import { listChildren } from '@/lib/np/data'
import { LENSES, isLensId, type LensId } from '@/lib/np/portals'
import { PortalTabs } from '../portal-tabs'
import { PortalWorkspace } from './portal-workspace'

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

export default async function LensPage({ params }: { params: Promise<{ lens: string }> }) {
  const { lens: lensParam } = await params
  if (!isLensId(lensParam)) notFound()
  const lens = LENSES[lensParam]
  const Icon = LENS_ICON[lens.id]

  const children = await listChildren()
  const childOptions = children.map((c) => ({ id: c.id, name: c.preferred_name }))

  return (
    <div className="space-y-6">
      <PortalTabs />

      <header className="flex items-start gap-4">
        <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${TOKEN_BG[lens.token]}`}>
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-balance">{lens.label} portal</h1>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed text-pretty">{lens.purpose}</p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
        {lens.reads}
      </div>

      <PortalWorkspace lensId={lens.id} children={childOptions} />
    </div>
  )
}
