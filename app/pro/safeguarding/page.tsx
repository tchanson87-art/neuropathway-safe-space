import { ShieldAlert, Phone } from 'lucide-react'
import { listAllSafeguarding } from '@/lib/np/data'
import { SectionCard, EmptyState, StatusBadge, formatDateTime } from '@/components/np/ui'

const URGENCY_STYLE: Record<string, string> = {
  monitor: 'bg-muted text-muted-foreground',
  review: 'bg-sun/25 text-foreground',
  urgent: 'bg-destructive/15 text-destructive',
}

export default async function SafeguardingPage() {
  const events = await listAllSafeguarding()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Safeguarding</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground leading-relaxed text-pretty">
          Safeguarding is rules-led and human-reviewed. NeuroPathway may flag content for urgent review,
          but it never independently decides that abuse occurred and never makes a final safeguarding
          decision. Only authorised safeguarding reviewers can see these records.
        </p>
      </div>

      <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
        <p className="flex items-center gap-2 font-semibold">
          <Phone className="size-4" aria-hidden="true" />
          NeuroPathway is not an emergency service.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          If a child is in immediate danger, follow your organisation&apos;s escalation procedure and
          contact the appropriate emergency or safeguarding services directly.
        </p>
      </div>

      <SectionCard title="Authorised review queue" description="Concerns awaiting or in human review.">
        {events.length === 0 ? (
          <EmptyState>No safeguarding events are currently recorded in your authorised scope.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => (
              <li key={e.id} className="rounded-2xl bg-background p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <ShieldAlert className="size-4 text-destructive" aria-hidden="true" />
                  <span className="font-semibold">{e.child_name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${URGENCY_STYLE[e.urgency]}`}>
                    {e.urgency}
                  </span>
                  <StatusBadge status={e.status} />
                  <span className="ml-auto text-xs text-muted-foreground">{formatDateTime(e.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed">{e.summary}</p>
                {e.source ? <p className="mt-1 text-xs text-muted-foreground">Source: {e.source}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  )
}
