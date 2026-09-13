import { notFound } from 'next/navigation'
import { Link2 } from 'lucide-react'
import { getChild, listPatterns, getPatternEvidence } from '@/lib/np/data'
import { EmptyState, Pill, AiTag, ConfidenceBadge, RiskBandBadge, EscalationBadge, StatusBadge, formatDate } from '@/components/np/ui'
import { DOMAIN_LABELS, SETTING_LABELS } from '@/lib/np/types'
import { ChildHeader } from '../child-header'
import { EngineButton, ReviewControls } from './pattern-controls'

export default async function PatternsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const child = await getChild(id)
  if (!child) notFound()

  const patterns = await listPatterns(id)
  const evidenceByPattern = await Promise.all(patterns.map((p) => getPatternEvidence(p.id)))

  return (
    <div className="space-y-6">
      <ChildHeader child={child} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold">Possible patterns</h2>
          <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
            These are cautious, explainable candidates generated from the recorded evidence. They are
            not conclusions or diagnoses — each one requires an authorised human decision and links back
            to the observations it came from.
          </p>
        </div>
        <EngineButton childId={id} />
      </div>

      {patterns.length === 0 ? (
        <EmptyState>
          No pattern candidates yet. Record a few observations, then run the pattern engine.
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {patterns.map((p, i) => (
            <li key={p.id} className="rounded-3xl border border-border bg-card p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Pill tone="teal">{DOMAIN_LABELS[p.domain] ?? p.domain}</Pill>
                <RiskBandBadge band={p.risk_band} />
                <EscalationBadge level={p.escalation} />
                <ConfidenceBadge level={p.confidence} />
                <StatusBadge status={p.status} />
                {p.is_ai_assisted ? <AiTag /> : null}
              </div>

              <p className="text-base leading-relaxed">{p.summary}</p>

              <div className="mt-3 rounded-2xl bg-background p-4 text-sm">
                <p className="font-semibold">Why this was surfaced</p>
                <p className="mt-1 text-muted-foreground leading-relaxed">{p.basis}</p>
                <p className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Frequency: {p.frequency}</span>
                  {p.occurrences_in_window && p.window_days ? (
                    <>
                      <span aria-hidden>·</span>
                      <span>
                        Peak {p.occurrences_in_window} in any {p.window_days} days
                      </span>
                    </>
                  ) : null}
                  <span aria-hidden>·</span>
                  <span>Settings: {p.settings.map((s) => SETTING_LABELS[s] ?? s).join(', ') || '—'}</span>
                  <span aria-hidden>·</span>
                  <span>{formatDate(p.date_range_start)} – {formatDate(p.date_range_end)}</span>
                  {p.model_version ? (
                    <>
                      <span aria-hidden>·</span>
                      <span>Model {p.model_version}</span>
                    </>
                  ) : null}
                </p>
              </div>

              {evidenceByPattern[i].length > 0 ? (
                <div className="mt-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
                    <Link2 className="size-4 text-primary" aria-hidden="true" />
                    Linked evidence ({evidenceByPattern[i].length})
                  </p>
                  <ul className="space-y-1.5">
                    {evidenceByPattern[i].map((e) => (
                      <li key={e.id} className="flex items-center gap-2 rounded-xl bg-background px-3 py-2 text-sm">
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate">{e.title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {e.source === 'safe_space' ? 'Safe Space' : e.author_role ?? '—'} · {formatDate(e.event_date)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {p.status === 'awaiting_review' || p.status === 'needs_evidence' ? (
                <ReviewControls patternId={p.id} childId={id} />
              ) : (
                <p className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
                  Reviewed — recorded as <span className="font-semibold text-foreground">{p.status.replace('_', ' ')}</span>.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
