import { notFound } from 'next/navigation'
import { Lock } from 'lucide-react'
import { getChild, listObservations } from '@/lib/np/data'
import { EmptyState, Pill, formatDateTime } from '@/components/np/ui'
import { DOMAIN_LABELS, SETTING_LABELS } from '@/lib/np/types'
import { ChildHeader } from '../child-header'
import { ObservationForm } from './observation-form'

export default async function ObservationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const child = await getChild(id)
  if (!child) notFound()
  const observations = await listObservations(id)

  return (
    <div className="space-y-6">
      <ChildHeader child={child} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">Observations</h2>
          <p className="text-sm text-muted-foreground">
            {observations.length} recorded. Each observation is attributed to its author and added to the evidence chronology.
          </p>
        </div>
        <ObservationForm childId={id} />
      </div>

      {observations.length === 0 ? (
        <EmptyState>No observations yet. Record the first one above.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {observations.map((o) => (
            <li key={o.id} className="rounded-3xl border border-border bg-card p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Pill tone="sky">{SETTING_LABELS[o.setting] ?? o.setting}</Pill>
                {o.domain ? <Pill tone="teal">{DOMAIN_LABELS[o.domain] ?? o.domain}</Pill> : null}
                {o.intensity ? <Pill>Impact {o.intensity}/5</Pill> : null}
                {o.sharing === 'private' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <Lock className="size-3" /> Private
                  </span>
                ) : null}
                <span className="ml-auto text-xs text-muted-foreground">{formatDateTime(o.occurred_at)}</span>
              </div>
              <p className="font-semibold leading-relaxed">{o.behaviour}</p>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                {o.antecedent ? <Row label="Before">{o.antecedent}</Row> : null}
                {o.trigger ? <Row label="Possible trigger">{o.trigger}</Row> : null}
                {o.child_communicated ? <Row label="Child communicated">{o.child_communicated}</Row> : null}
                {o.emotional_state ? <Row label="Emotional state">{o.emotional_state}</Row> : null}
                {o.sensory_factors.length ? <Row label="Sensory">{o.sensory_factors.join(', ')}</Row> : null}
                {o.support_given ? <Row label="Support given">{o.support_given}</Row> : null}
                {o.what_helped ? <Row label="What helped">{o.what_helped}</Row> : null}
                {o.child_view ? <Row label="Child's view">{o.child_view}</Row> : null}
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">
                Recorded by {o.observer_role ?? 'unknown role'}
                {o.impact_area.length ? ` · affects ${o.impact_area.map((i) => i.replace('_', ' ')).join(', ')}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 font-semibold text-muted-foreground">{label}:</dt>
      <dd>{children}</dd>
    </div>
  )
}
