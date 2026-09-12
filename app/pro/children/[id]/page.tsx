import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Heart, Sparkles, Ear, Puzzle, HeartHandshake } from 'lucide-react'
import {
  getChild,
  listObservations,
  listPatterns,
  listSupportPlans,
  listEvidence,
} from '@/lib/np/data'
import { SectionCard, EmptyState, StatusBadge, AiTag, Pill, formatDate } from '@/components/np/ui'
import { DOMAIN_LABELS } from '@/lib/np/types'
import { ChildHeader } from './child-header'

export default async function ChildOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const child = await getChild(id)
  if (!child) notFound()

  const [observations, patterns, plans, evidence] = await Promise.all([
    listObservations(id),
    listPatterns(id),
    listSupportPlans(id),
    listEvidence(id),
  ])

  const strengthBlocks = [
    { icon: Sparkles, title: 'Strengths', items: child.strengths },
    { icon: Heart, title: 'Interests', items: child.interests },
    { icon: Ear, title: 'Sensory preferences', items: child.sensory_prefs },
    { icon: Puzzle, title: 'Reasonable adjustments', items: child.reasonable_adjustments },
  ].filter((b) => b.items.length > 0)

  const awaiting = patterns.filter((p) => p.status === 'awaiting_review')

  return (
    <div className="space-y-6">
      <ChildHeader child={child} />

      {/* Strengths first, by design */}
      <SectionCard title="Who this child is" description="A strengths-based picture comes before any needs or difficulties.">
        <div className="grid gap-4 sm:grid-cols-2">
          {strengthBlocks.map((b) => (
            <div key={b.title} className="rounded-2xl bg-background p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                <b.icon className="size-4 text-primary" aria-hidden="true" />
                {b.title}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {b.items.map((i) => (
                  <Pill key={i} tone="teal">{i}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
        {child.known_needs.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-border p-4">
            <p className="mb-2 text-sm font-bold">Known needs (functional, not diagnostic)</p>
            <div className="flex flex-wrap gap-1.5">
              {child.known_needs.map((n) => (
                <Pill key={n}>{n}</Pill>
              ))}
            </div>
          </div>
        ) : null}
      </SectionCard>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Observations', value: observations.length, href: `observations` },
          { label: 'Evidence items', value: evidence.length, href: `evidence` },
          { label: 'Patterns to review', value: awaiting.length, href: `patterns` },
          { label: 'Support plans', value: plans.length, href: `plans` },
        ].map((s) => (
          <Link
            key={s.label}
            href={`/pro/children/${id}/${s.href}`}
            className="rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted"
          >
            <p className="font-display text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Patterns awaiting review"
          description="Cautious candidates that need an authorised human decision."
          action={
            <Link href={`/pro/children/${id}/patterns`} className="text-sm font-semibold text-primary hover:underline">
              Review
            </Link>
          }
        >
          {awaiting.length === 0 ? (
            <EmptyState>No patterns are waiting for review.</EmptyState>
          ) : (
            <ul className="space-y-3">
              {awaiting.slice(0, 3).map((p) => (
                <li key={p.id} className="rounded-2xl bg-background p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Pill tone="teal">{DOMAIN_LABELS[p.domain] ?? p.domain}</Pill>
                    <StatusBadge status={p.status} />
                    <AiTag />
                  </div>
                  <p className="text-sm leading-relaxed">{p.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Recent evidence"
          description="Newest items in the chronological evidence store."
          action={
            <Link href={`/pro/children/${id}/evidence`} className="text-sm font-semibold text-primary hover:underline">
              Timeline
            </Link>
          }
        >
          {evidence.length === 0 ? (
            <EmptyState>No evidence recorded yet.</EmptyState>
          ) : (
            <ul className="space-y-2">
              {evidence.slice(0, 4).map((e) => (
                <li key={e.id} className="flex items-start gap-3 rounded-2xl bg-background p-3">
                  {e.source === 'safe_space' ? (
                    <HeartHandshake className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                  ) : (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.author_role ?? 'unknown'} · {formatDate(e.event_date)}
                      {e.source === 'safe_space' ? ' · shared from Safe Space' : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
