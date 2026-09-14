'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, NotebookPen, RotateCcw, ShieldAlert, Sparkles, Lightbulb, Info } from 'lucide-react'
import {
  ANSWER_OPTIONS,
  LENSES,
  interpretResponses,
  type LensId,
} from '@/lib/np/portals'
import { EmptyState, RiskBandBadge, EscalationBadge, ConfidenceBadge } from '@/components/np/ui'
import { cn } from '@/lib/utils'

interface ChildOption {
  id: string
  name: string
}

export function PortalWorkspace({ lensId, children }: { lensId: LensId; children: ChildOption[] }) {
  const lens = LENSES[lensId]
  const [childId, setChildId] = useState<string>(children[0]?.id ?? '')
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({})

  const result = useMemo(() => interpretResponses(lensId, answers), [lensId, answers])
  const selectedChild = children.find((c) => c.id === childId) ?? null

  function setAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }
  function reset() {
    setAnswers({})
  }

  return (
    <div className="space-y-6">
      {/* Child + everyday observations */}
      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label htmlFor="portal-child" className="mb-1.5 block text-sm font-semibold">
            Child or young person
          </label>
          {children.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active children in this demo workspace yet.</p>
          ) : (
            <select
              id="portal-child"
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:max-w-xs"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {selectedChild ? (
          <Link
            href={`/pro/children/${selectedChild.id}/observations`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <NotebookPen className="size-4 text-primary" aria-hidden="true" />
            Record an everyday observation
          </Link>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Questionnaire */}
        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <ClipboardList className="size-5 text-primary" aria-hidden="true" />
                EHCP questionnaire
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Answer only what you have seen. {result.answered} of {result.total} answered.
              </p>
            </div>
            {result.answered > 0 ? (
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reset
              </button>
            ) : null}
          </div>

          <ol className="space-y-5">
            {lens.questions.map((q, i) => (
              <li key={q.id}>
                <fieldset>
                  <legend className="text-sm font-semibold leading-relaxed">
                    <span className="text-muted-foreground">{i + 1}. </span>
                    {q.text}
                  </legend>
                  {q.helper ? (
                    <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Info className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                      {q.helper}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {ANSWER_OPTIONS.map((opt) => {
                      const checked = answers[q.id] === opt.value
                      return (
                        <label
                          key={opt.value}
                          className={cn(
                            'inline-flex min-h-11 cursor-pointer items-center rounded-full border px-3 text-sm font-medium transition-colors',
                            checked
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background text-muted-foreground hover:bg-muted',
                          )}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.value}
                            checked={checked}
                            onChange={() => setAnswer(q.id, opt.value)}
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>
        </section>

        {/* Interpretation */}
        <section className="space-y-4">
          {result.safetyAlert ? (
            <div role="alert" className="rounded-3xl border-2 border-destructive/40 bg-destructive/10 p-5">
              <p className="flex items-center gap-2 font-display text-base font-bold text-destructive">
                <ShieldAlert className="size-5" aria-hidden="true" />
                SAFETY ALERT
              </p>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground">
                Immediate safeguarding review recommended. Follow your setting’s safeguarding
                procedure now — do not wait for this tool.
              </p>
            </div>
          ) : null}

          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="mb-1 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Sparkles className="size-5 text-lavender" aria-hidden="true" />
                Interpreted needs
              </h2>
              {result.headlineEscalation ? <EscalationBadge level={result.headlineEscalation} /> : null}
            </div>
            <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
              A cautious, needs-first reading of the answers, framed for {lens.label.toLowerCase()}.
              This is not a diagnosis and requires an authorised human decision.
            </p>

            {result.answered === 0 ? (
              <EmptyState>Insufficient evidence available. Answer a question to see an interpretation.</EmptyState>
            ) : result.concerns.length === 0 ? (
              <EmptyState>
                No difficulties reported so far{selectedChild ? ` for ${selectedChild.name}` : ''}. Areas answered as
                &ldquo;Not seen&rdquo; are shown below.
              </EmptyState>
            ) : (
              <ul className="space-y-3">
                {result.concerns.map((c) => (
                  <li key={c.domain} className="rounded-2xl bg-background p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-bold">{c.label}</span>
                      <RiskBandBadge band={c.riskBand} />
                      <ConfidenceBadge level={c.evidenceStrength} />
                    </div>
                    <p className="text-sm font-semibold leading-relaxed">{c.observedNeed}</p>
                    <dl className="mt-2 space-y-1.5 text-sm">
                      <Detail label="Functional impact">{c.functionalImpact}</Detail>
                      <Detail label="Pattern">
                        {c.frequencyWord} · {c.severityWord} impact · {c.contributing} of {c.answeredCount} answered
                        question{c.answeredCount === 1 ? '' : 's'} contributing
                      </Detail>
                      <Detail label="Recommended support">{c.recommendedSupport}</Detail>
                    </dl>
                    <div className="mt-2">
                      <EscalationBadge level={c.escalation} />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {result.goingWell.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-border p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <Lightbulb className="size-4 text-mint" aria-hidden="true" />
                  Reported as going well
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.goingWell.map((g) => (
                    <span key={g.domain} className="rounded-full bg-mint/20 px-2.5 py-1 text-xs font-medium">
                      {g.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <dt className="shrink-0 font-semibold text-muted-foreground">{label}:</dt>
      <dd className="leading-relaxed">{children}</dd>
    </div>
  )
}
