import { Info } from 'lucide-react'
import { getPilotMetrics } from '@/lib/np/data'
import { SectionCard } from '@/components/np/ui'

export default async function PilotPage() {
  const m = await getPilotMetrics()

  const metrics = [
    { label: 'Participating children', value: m.children },
    { label: 'Observations recorded', value: m.observations },
    { label: 'Settings covered', value: m.crossSetting },
    { label: 'Questionnaires completed', value: m.questionnaires },
    { label: 'Evidence items collected', value: m.evidenceItems },
    { label: 'Shared from Safe Space', value: m.safeSpaceShared },
    { label: 'Patterns human-reviewed', value: m.patternsReviewed },
    { label: 'Support plans created', value: m.supportPlans },
    { label: 'Interventions reviewed', value: m.interventionReviews },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Pilot &amp; evaluation</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground leading-relaxed text-pretty">
          Aggregated, privacy-preserving process measures for pilot evaluation.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-secondary/40 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Info className="size-4" aria-hidden="true" />
          Aggregated data only
        </p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          No identifiable child-level data is shown to evaluators. These are process measures — they do
          not claim that NeuroPathway caused any outcome.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="font-display text-3xl font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionCard title="What these measures mean" description="Interpreting the pilot dashboard responsibly.">
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>Process measures show activity and reach, not clinical or educational outcomes.</li>
          <li>Cross-setting coverage indicates whether evidence is being gathered from more than one environment.</li>
          <li>Human-review counts show that the loop is keeping people, not automation, in charge of decisions.</li>
        </ul>
      </SectionCard>
    </div>
  )
}
