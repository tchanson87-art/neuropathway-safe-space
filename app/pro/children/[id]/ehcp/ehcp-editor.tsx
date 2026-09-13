'use client'

import { useState, useTransition } from 'react'
import { Save, Printer, Check, Loader2 } from 'lucide-react'
import { saveEhcpSections } from '@/lib/np/actions'

export interface EhcpSection {
  key: string
  label: string
  statutory: string
  hint?: string
}

/** Statutory EHC plan sections A–K, per the SEND Code of Practice (0–25 years). */
export const STATUTORY_TITLES: Record<string, string> = {
  A: 'Section A — Views, interests and aspirations',
  B: 'Section B — Special educational needs (SEN)',
  C: 'Section C — Health needs related to SEN',
  D: 'Section D — Social care needs related to SEN',
  E: 'Section E — Outcomes',
  F: 'Section F — Special educational provision',
  G: 'Section G — Health provision',
  H: 'Section H — Social care provision',
  I: 'Section I — Placement',
  J: 'Section J — Personal budget',
  K: 'Section K — Advice and information (appendices)',
}

export const EHCP_SECTIONS: EhcpSection[] = [
  { key: 'child_family_views', statutory: 'A', label: 'Child and family views' },
  { key: 'strengths_aspirations', statutory: 'A', label: 'Strengths and aspirations' },
  { key: 'communication_interaction', statutory: 'B', label: 'Communication and interaction' },
  { key: 'cognition_learning', statutory: 'B', label: 'Cognition and learning' },
  { key: 'semh', statutory: 'B', label: 'Social, emotional and mental-health needs' },
  { key: 'sensory_physical', statutory: 'B', label: 'Sensory or physical needs' },
  { key: 'unmet_needs', statutory: 'B', label: 'Unmet needs' },
  {
    key: 'health_needs',
    statutory: 'C',
    label: 'Health needs related to SEN',
    hint: 'Only health needs that relate to the child\u2019s SEN. Leave blank if none are evidenced.',
  },
  {
    key: 'social_care_needs',
    statutory: 'D',
    label: 'Social care needs related to SEN',
    hint: 'Social care needs identified under the Children and Families Act. Leave blank if none are evidenced.',
  },
  { key: 'outcomes_impact', statutory: 'E', label: 'Outcomes (SMART) and impact' },
  { key: 'current_provision', statutory: 'F', label: 'Current special educational provision' },
  { key: 'support_tried', statutory: 'F', label: 'Support already tried' },
  {
    key: 'health_provision',
    statutory: 'G',
    label: 'Health provision',
    hint: 'Provision required to meet the Section C needs. For a clinician to complete.',
  },
  {
    key: 'social_care_provision',
    statutory: 'H',
    label: 'Social care provision',
    hint: 'Provision under the Chronically Sick and Disabled Persons Act (H1) and other social care (H2).',
  },
  {
    key: 'placement',
    statutory: 'I',
    label: 'Placement — type of setting',
    hint: 'The type of setting that can meet needs. The named school is added by the local authority.',
  },
  {
    key: 'personal_budget',
    statutory: 'J',
    label: 'Personal budget',
    hint: 'Record if a personal budget has been requested or agreed. Optional.',
  },
  {
    key: 'evidence_appendices',
    statutory: 'K',
    label: 'Advice and information gathered',
    hint: 'List the reports and records this pack draws on. Every claim above should trace to one.',
  },
  {
    key: 'evidence_gaps',
    statutory: 'K',
    label: 'Evidence gaps requiring completion',
  },
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

      <div className="space-y-6">
        {Object.keys(STATUTORY_TITLES).map((letter) => {
          const groupSections = EHCP_SECTIONS.filter((s) => s.statutory === letter)
          if (groupSections.length === 0) return null
          return (
            <div key={letter} className="space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-primary print:text-foreground">
                {STATUTORY_TITLES[letter]}
              </h3>
              {groupSections.map((s) => {
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
                    {s.hint ? (
                      <p className="mb-2 text-xs text-muted-foreground leading-relaxed">{s.hint}</p>
                    ) : null}
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
          )
        })}
      </div>
    </div>
  )
}
