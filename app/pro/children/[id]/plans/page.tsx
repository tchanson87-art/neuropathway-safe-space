import { notFound } from 'next/navigation'
import { CalendarClock, Target } from 'lucide-react'
import { getChild, listSupportPlans, listInterventions, listPatterns } from '@/lib/np/data'
import { EmptyState, StatusBadge, formatDate } from '@/components/np/ui'
import { ChildHeader } from '../child-header'
import { PlanForm } from './plan-form'

export default async function PlansPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const child = await getChild(id)
  if (!child) notFound()

  const [plans, patterns] = await Promise.all([listSupportPlans(id), listPatterns(id)])
  const interventions = await Promise.all(plans.map((p) => listInterventions(p.id)))
  const reviewedPatterns = patterns
    .filter((p) => p.status === 'accepted' || p.status === 'amended')
    .map((p) => ({ id: p.id, summary: p.summary }))

  return (
    <div className="space-y-6">
      <ChildHeader child={child} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold">Support &amp; interventions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
            Practical adjustments built from reviewed evidence, each with a baseline and a measure so
            you can see whether it helped.
          </p>
        </div>
        <PlanForm childId={id} patterns={reviewedPatterns} />
      </div>

      {plans.length === 0 ? (
        <EmptyState>No support plans yet.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {plans.map((plan, i) => (
            <li key={plan.id} className="rounded-3xl border border-border bg-card p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Target className="size-5 text-primary" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold">{plan.identified_need}</h3>
                <StatusBadge status={plan.status} />
              </div>
              <p className="text-sm"><span className="font-semibold">Desired outcome:</span> {plan.desired_outcome}</p>
              {plan.child_view ? (
                <p className="mt-1 text-sm text-muted-foreground">Child&apos;s view: “{plan.child_view}”</p>
              ) : null}
              {plan.responsible_person ? (
                <p className="mt-1 text-xs text-muted-foreground">Responsible: {plan.responsible_person}</p>
              ) : null}

              {interventions[i].length > 0 ? (
                <div className="mt-4 space-y-3">
                  {interventions[i].map((iv) => (
                    <div key={iv.id} className="rounded-2xl bg-background p-4">
                      <p className="font-semibold">{iv.description}</p>
                      <div className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                        {iv.setting ? <p><span className="text-muted-foreground">Setting:</span> {iv.setting}</p> : null}
                        {iv.frequency ? <p><span className="text-muted-foreground">Frequency:</span> {iv.frequency}</p> : null}
                        {iv.baseline ? <p><span className="text-muted-foreground">Baseline:</span> {iv.baseline}</p> : null}
                        {iv.measure ? <p><span className="text-muted-foreground">Measure:</span> {iv.measure}</p> : null}
                      </div>
                      {iv.review_date ? (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <CalendarClock className="size-3.5" aria-hidden="true" />
                          Review due {formatDate(iv.review_date)}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
