'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, Wand2, Check, X, PencilLine, HelpCircle } from 'lucide-react'
import { runEngine, reviewPattern, type ActionResult } from '@/lib/np/actions'

function Spinner({ label, icon: Icon }: { label: string; icon: typeof Wand2 }) {
  const { pending } = useFormStatus()
  return (
    <>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
      {label}
    </>
  )
}

export function EngineButton({ childId }: { childId: string }) {
  const [state, action] = useActionState(
    async (): Promise<ActionResult> => runEngine(childId),
    null,
  )
  return (
    <form action={action}>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
      >
        <Spinner label="Run pattern engine" icon={Wand2} />
      </button>
      {state?.error ? <p className="mt-1 text-xs text-destructive">{state.error}</p> : null}
    </form>
  )
}

const DECISIONS = [
  { value: 'accepted', label: 'Accept', icon: Check },
  { value: 'amended', label: 'Amend', icon: PencilLine },
  { value: 'needs_evidence', label: 'Needs evidence', icon: HelpCircle },
  { value: 'rejected', label: 'Reject', icon: X },
] as const

export function ReviewControls({ patternId, childId }: { patternId: string; childId: string }) {
  const [decision, setDecision] = useState<string | null>(null)
  const [state, formAction] = useActionState(
    async (_prev: ActionResult | null, formData: FormData): Promise<ActionResult> => {
      const result = await reviewPattern(patternId, childId, formData)
      if (result.ok) setDecision(null)
      return result
    },
    null,
  )

  return (
    <form action={formAction} className="mt-4 border-t border-border pt-4">
      <p className="mb-2 text-sm font-semibold">Human review decision</p>
      <input type="hidden" name="decision" value={decision ?? ''} />
      <div className="flex flex-wrap gap-2">
        {DECISIONS.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => setDecision(d.value)}
            aria-pressed={decision === d.value}
            className={
              'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors ' +
              (decision === d.value
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-background text-muted-foreground hover:text-foreground')
            }
          >
            <d.icon className="size-4" />
            {d.label}
          </button>
        ))}
      </div>

      {decision === 'amended' ? (
        <textarea
          name="amended_summary"
          rows={2}
          required
          placeholder="Reword the pattern in careful, needs-led language"
          className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      ) : null}

      {decision ? (
        <>
          <textarea
            name="reasoning"
            rows={2}
            placeholder="Reasoning or professional context (optional but recommended)"
            className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <div className="mt-3 flex items-center gap-3">
            <SaveDecision />
            <button type="button" onClick={() => setDecision(null)} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </>
      ) : null}

      {state?.error ? <p className="mt-2 text-sm text-destructive">{state.error}</p> : null}
    </form>
  )
}

function SaveDecision() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      Record decision
    </button>
  )
}
