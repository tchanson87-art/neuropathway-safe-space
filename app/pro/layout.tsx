import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Info } from 'lucide-react'
import { getViewer } from '@/lib/np/data'
import { ProNav } from './pro-nav'

export const metadata: Metadata = {
  title: 'NeuroPathway — Professional platform',
  description:
    'Evidence before labels. A needs-led pathway that turns everyday observations into structured, human-reviewed EHCP-ready evidence.',
}

const ROLE_LABELS: Record<string, string> = {
  parent: 'Parent / carer',
  teacher: 'Teacher',
  senco: 'SENCO',
  health: 'Health professional',
  social_care: 'Social-care professional',
  professional: 'Health / professional',
  admin: 'Organisation admin',
  child: 'Child / young person',
  practitioner: 'Practitioner',
  evaluator: 'Pilot evaluator',
  safeguarding: 'Safeguarding reviewer',
  org_admin: 'Organisation admin',
  platform_admin: 'Platform admin',
}

export default async function ProLayout({ children }: { children: ReactNode }) {
  const viewer = await getViewer()
  if (!viewer) redirect('/enter?next=/pro')

  return (
    <div className="min-h-dvh bg-background">
      {/* Demo workspace banner — required whenever data is illustrative */}
      <div className="bg-accent/25 text-accent-foreground">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-2 text-xs font-semibold">
          <Info className="size-4 shrink-0" aria-hidden="true" />
          <p>Demo workspace — no real child records are stored in this prototype. All data is fictional.</p>
        </div>
      </div>

      <header className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/pro" className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 font-display text-lg font-extrabold text-primary">
                N
              </span>
              <span>
                <span className="block font-display text-base leading-tight font-extrabold">NeuroPathway</span>
                <span className="block text-xs leading-tight text-muted-foreground">Evidence before labels</span>
              </span>
            </Link>
            <div className="text-right">
              <p className="text-sm font-semibold leading-tight">{viewer.name}</p>
              <p className="text-xs leading-tight text-muted-foreground">
                {ROLE_LABELS[viewer.role] ?? viewer.role}
                {viewer.organization ? ` · ${viewer.organization}` : ''}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <ProNav />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-20">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-relaxed text-pretty">
            NeuroPathway&trade;, NeuroPathway Safe Space&trade; and Prevention Is the
            Cure&trade; are trademarks of NeuroPathway Social Innovation CIC (Company No.{' '}
            <span className="font-medium text-foreground">17366103</span>).
          </p>
          <p className="shrink-0">
            Contact:{' '}
            <a
              href="mailto:tanja.socialinnovationcic@zohomail.eu"
              className="font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              tanja.socialinnovationcic@zohomail.eu
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
