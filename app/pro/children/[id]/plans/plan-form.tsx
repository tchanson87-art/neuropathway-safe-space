'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus, Loader2 } from 'lucide-react'
import { createSupportPlan, type ActionResult } from '@/lib/np/actions'

const field =
  'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40'
const label = 'block text-sm font-semibold mb-1.5'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-primary-foreground disabled:opacity-60">
      {pending ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
      Create support plan
    </button>
  )
}

export function PlanForm({
  childId,
  patterns,
}: {
  childId: string
  patterns: { id: string; summary: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState(
    async (_prev: ActionResult | null, formData: FormData): Promise<ActionResult> => {
      const result = await createSupportPlan(childId, formData)
      if (result.ok) setOpen(false)
      return result
    },
    null,
  )

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
        <Plus className="size-5" />
        Create support plan
      </button>
    )
  }

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">
        Turn a reviewed need into practical support. Support does not need to wait for a diagnosis.
      </p>
      <div>
        <label htmlFor="identified_need" className={label}>Identified need <span className="text-destructive">*</span></label>
        <input id="identified_need" name="identified_need" required className={field} placeholder="e.g. Reduce sensory overload during transitions" />
      </div>
      {patterns.length > 0 ? (
        <div>
          <label htmlFor="supporting_pattern_id" className={label}>Link to a reviewed pattern</label>
          <select id="supporting_pattern_id" name="supporting_pattern_id" className={field} defaultValue="">
            <option value="">None</option>
            {patterns.map((p) => (
              <option key={p.id} value={p.id}>{p.summary.slice(0, 80)}…</option>
            ))}
          </select>
        </div>
      ) : null}
      <div>
        <label htmlFor="desired_outcome" className={label}>Desired outcome <span className="text-destructive">*</span></label>
        <input id="desired_outcome" name="desired_outcome" required className={field} placeholder="What good looks like for this child" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="child_strengths" className={label}>Child&apos;s strengths to build on</label>
          <input id="child_strengths" name="child_strengths" className={field} />
        </div>
        <div>
          <label htmlFor="child_view" className={label}>Child&apos;s view</label>
          <input id="child_view" name="child_view" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="responsible_person" className={label}>Responsible person</label>
        <input id="responsible_person" name="responsible_person" className={field} placeholder="e.g. Class teacher / SENCO" />
      </div>

      {state?.error ? <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p> : null}

      <div className="flex items-center gap-3">
        <SubmitButton />
        <button type="button" onClick={() => setOpen(false)} className="min-h-12 rounded-full px-4 text-sm font-semibold text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  )
}
