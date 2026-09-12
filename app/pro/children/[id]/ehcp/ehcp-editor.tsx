'use client'

import { useState, useTransition } from 'react'
import { Save, Printer, Check, Loader2 } from 'lucide-react'
import { saveEhcpSections } from '@/lib/np/actions'

export interface EhcpSection {
  key: string
  label: string
  hint?: string
}

export const EHCP_SECTIONS: EhcpSection[] = [
  { key: 'child_family_views', label: 'Child and family views' },
  { key: 'strengths_aspirations', label: 'Strengths and aspirations' },
  { key: 'communication_interaction', label: 'Communication and interaction' },
  { key: 'cognition_learning', label: 'Cognition and learning' },
  { key: 'semh', label: 'Social, emotional and mental-health needs' },
  { key: 'sensory_physical', label: 'Sensory or physical needs' },
  { key: 'current_provision', label: 'Current provision' },
  { key: 'support_tried', label: 'Support already tried' },
  { key: 'outcomes_impact', label: 'Outcomes and impact' },
  { key: 'unmet_needs', label: 'Unmet needs' },
  { key: 'evidence_gaps', label: 'Evidence gaps requiring completion' },
]

export function EhcpEditor({
  childId,
  draftId,
  initialSections,
}: {
  childId: string
  draftId: string
  initialSections: Record<string, string>
}) {
  const [sections, setSections] = useState<Record<string, string>>(initialSections)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function save() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveEhcpSections(childId, draftId, sections)
      if (result.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        setError(result.error ?? 'Could not save.')
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : saved ? <Check className="size-4" /> : <Save className="size-4" />}
          {saved ? 'Saved' : 'Save draft'}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-bold text-foreground hover:bg-muted"
        >
          <Printer className="size-4" />
          Print / export PDF
        </button>
        {error ? <span className="text-sm text-destructive">{error}</span> : null}
      </div>

      <div className="space-y-4">
        {EHCP_SECTIONS.map((s) => {
          const value = sections[s.key] ?? ''
          const empty = value.trim().length === 0
          return (
            <div key={s.key} className="rounded-2xl border border-border bg-card p-4 print:border-0 print:p-0">
              <label htmlFor={`ehcp-${s.key}`} className="mb-1.5 flex items-center justify-between gap-2">
                <span className="font-display font-bold">{s.label}</span>
                {empty ? (
                  <span className="rounded-full bg-peach/25 px-2 py-0.5 text-xs font-semibold text-foreground print:hidden">
                    Evidence gap
                  </span>
                ) : null}
              </label>
              <textarea
                id={`ehcp-${s.key}`}
                value={value}
                onChange={(e) => setSections((prev) => ({ ...prev, [s.key]: e.target.value }))}
                rows={3}
                placeholder="Draft from verified records — do not invent evidence."
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/40 print:border-0 print:px-0"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
