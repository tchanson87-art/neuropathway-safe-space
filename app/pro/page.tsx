import Link from 'next/link'
import { ArrowRight, ClipboardList, FolderOpen, HeartHandshake, Users } from 'lucide-react'
import { getDashboardSummary, getViewer } from '@/lib/np/data'
import { SectionCard, EmptyState, Pill } from '@/components/np/ui'

export default async function ProDashboardPage() {
  const [viewer, summary] = await Promise.all([getViewer(), getDashboardSummary()])
  const firstName = viewer?.name.split(' ')[0] ?? 'there'

  const stats = [
    { label: 'Children you can access', value: summary.children.length, icon: Users, href: '/pro/children' },
    { label: 'Patterns awaiting review', value: summary.awaitingReview, icon: ClipboardList, tone: 'sun' },
    { label: 'Active support plans', value: summary.activePlans, icon: FolderOpen, tone: 'mint' },
    { label: 'Shared from Safe Space', value: summary.safeSpaceShared, icon: HeartHandshake, tone: 'teal' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-balance sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 max-w-2xl text-muted-foreground text-pretty leading-relaxed">
          NeuroPathway helps the people around a child notice needs earlier, understand patterns
          clearly and build better support together — needs first, labels later, human decisions always.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <span className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="size-5" aria-hidden="true" />
            </span>
            <p className="font-display text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionCard
        title="Children assigned to you"
        description="You only see children and records you are authorised to access."
        action={
          <Link href="/pro/children" className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80">
            View all <ArrowRight className="size-4" />
          </Link>
        }
      >
        {summary.children.length === 0 ? (
          <EmptyState>No children are currently assigned to you.</EmptyState>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {summary.children.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/pro/children/${c.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 font-display text-base font-bold text-primary">
                      {c.preferred_name.slice(0, 1)}
                    </span>
                    <span>
                      <span className="block font-semibold leading-tight">{c.preferred_name}</span>
                      <span className="block text-xs text-muted-foreground">{c.age_band ?? 'Age not set'}</span>
                    </span>
                  </span>
                  {c.is_demo ? <Pill tone="sky">Demo</Pill> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="The NeuroPathway loop" description="Every step keeps a human in the loop.">
          <ol className="space-y-2 text-sm leading-relaxed">
            {[
              'Record everyday observations from home, school and services',
              'Bring them into one authorised evidence store',
              'Surface possible repeated patterns — cautiously, with sources',
              'Authorised human review accepts, amends or rejects',
              'Turn reviewed needs into practical support and adjustments',
              'Record outcomes and update confidence over time',
            ].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="What NeuroPathway does not do" description="Safe by design.">
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>It never diagnoses autism, ADHD or any medical condition.</li>
            <li>It never makes automated decisions about safeguarding, eligibility or placement.</li>
            <li>It never presents AI-assisted text as verified human evidence.</li>
            <li>It never replaces teachers, SENCOs, clinicians or social workers.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}
