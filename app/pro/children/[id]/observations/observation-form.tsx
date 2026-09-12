'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus, Loader2 } from 'lucide-react'
import { createObservation, type ActionResult } from '@/lib/np/actions'
import { DOMAIN_LABELS } from '@/lib/np/types'
import { cn } from '@/lib/utils'

const SETTINGS = ['home', 'school', 'clinic', 'community']
const SENSORY = ['noise', 'crowding', 'light', 'touch', 'smell', 'temperature']
const IMPACT = ['learning', 'participation', 'relationships', 'daily_life']

const field =
  'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40'
const label = 'block text-sm font-semibold mb-1.5'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
      Save observation
    </button>
  )
}

export function ObservationForm({ childId }: { childId: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState(
    async (_prev: ActionResult | null, formData: FormData): Promise<ActionResult> => {
      const result = await createObservation(childId, formData)
      if (result.ok) setOpen(false)
      return result
    },
    null,
  )

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
      >
        <Plus className="size-5" />
        Record an observation
      </button>
    )
  }

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">
        Record what you observed in about a minute. Please describe what you saw and heard, rather than
        assuming why. Only the fields marked required are needed.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="setting" className={label}>Setting <span className="text-destructive">*</span></label>
          <select id="setting" name="setting" required className={field} defaultValue="school">
            {SETTINGS.map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="occurred_at" className={label}>Date &amp; time</label>
          <input id="occurred_at" name="occurred_at" type="datetime-local" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="behaviour" className={label}>What happened (observable) <span className="text-destructive">*</span></label>
        <textarea id="behaviour" name="behaviour" required rows={2} className={field} placeholder="e.g. Covered ears and moved away from the group" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="antecedent" className={label}>What happened before</label>
          <input id="antecedent" name="antecedent" className={field} placeholder="e.g. Busy corridor at break" />
        </div>
        <div>
          <label htmlFor="trigger" className={label}>Possible trigger or demand</label>
          <input id="trigger" name="trigger" className={field} placeholder="e.g. Transition + noise" />
        </div>
        <div>
          <label htmlFor="child_communicated" className={label}>What the child communicated</label>
          <input id="child_communicated" name="child_communicated" className={field} placeholder="Words, sounds or actions" />
        </div>
        <div>
          <label htmlFor="emotional_state" className={label}>Emotional state</label>
          <input id="emotional_state" name="emotional_state" className={field} placeholder="e.g. Overwhelmed" />
        </div>
      </div>

      <fieldset>
        <legend className={label}>Sensory factors</legend>
        <div className="flex flex-wrap gap-2">
          {SENSORY.map((s) => (
            <label key={s} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10">
              <input type="checkbox" name="sensory_factors" value={s} className="size-4" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="domain" className={label}>Area of need</label>
          <select id="domain" name="domain" className={field} defaultValue="">
            <option value="">Not sure</option>
            {Object.entries(DOMAIN_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="intensity" className={label}>Impact (1–5)</label>
          <input id="intensity" name="intensity" type="number" min={1} max={5} className={field} />
        </div>
        <div>
          <label htmlFor="duration_minutes" className={label}>Duration (mins)</label>
          <input id="duration_minutes" name="duration_minutes" type="number" min={0} className={field} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="support_given" className={label}>Support provided</label>
          <input id="support_given" name="support_given" className={field} />
        </div>
        <div>
          <label htmlFor="what_helped" className={label}>What helped</label>
          <input id="what_helped" name="what_helped" className={field} />
        </div>
      </div>

      <fieldset>
        <legend className={label}>Effect on</legend>
        <div className="flex flex-wrap gap-2">
          {IMPACT.map((s) => (
            <label key={s} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10">
              <input type="checkbox" name="impact_area" value={s} className="size-4" />
              {s.replace('_', ' ')}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="child_view" className={label}>Child&apos;s view</label>
        <input id="child_view" name="child_view" className={field} placeholder="In the child's own words, if known" />
      </div>

      <div>
        <label htmlFor="sharing" className={label}>Sharing</label>
        <select id="sharing" name="sharing" className={cn(field, 'sm:max-w-xs')} defaultValue="shared">
          <option value="shared">Shared with the child&apos;s authorised team</option>
          <option value="private">Private to me</option>
        </select>
      </div>

      {state?.error ? (
        <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      ) : null}

      <div className="flex items-center gap-3">
        <SubmitButton />
        <button type="button" onClick={() => setOpen(false)} className="min-h-12 rounded-full px-4 text-sm font-semibold text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  )
}
