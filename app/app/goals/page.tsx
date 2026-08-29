'use client'

import { useState } from 'react'
import { Target, Plus, X, Check, Pause, Play, Flag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/safe-space/page-header'
import { EmptyState, SectionLabel } from '@/components/safe-space/primitives'
import { useData } from '@/components/providers/data-provider'
import type { GoalStatus } from '@/lib/safe-space'
import { cn } from '@/lib/utils'

export default function GoalsPage() {
  const { goals, addGoal, toggleGoalStep, setGoalStatus } = useData()
  const [composing, setComposing] = useState(false)

  const [title, setTitle] = useState('')
  const [why, setWhy] = useState('')
  const [timescale, setTimescale] = useState('No rush')
  const [stepsText, setStepsText] = useState('')

  function reset() {
    setTitle('')
    setWhy('')
    setTimescale('No rush')
    setStepsText('')
  }

  function save() {
    if (!title.trim()) return
    const steps = stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((label, i) => ({ id: `s${i}-${Date.now()}`, label, done: false }))
    addGoal({
      title: title.trim(),
      why: why.trim(),
      timescale,
      steps,
      status: 'active',
      supporters: [],
    })
    reset()
    setComposing(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="My Goals"
        intro="Goals are small steps that matter to you. You set them, at your own pace, and you can change them any time."
        readAloudText="My Goals. Goals are small steps that matter to you. You set them, at your own pace, and you can change them any time."
        action={
          !composing ? (
            <button
              onClick={() => setComposing(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Plus className="size-4" /> New goal
            </button>
          ) : null
        }
      />

      {composing && (
        <Card className="mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">A new goal</h2>
            <button
              onClick={() => {
                reset()
                setComposing(false)
              }}
              aria-label="Close"
              className="rounded-full p-2 text-muted-foreground hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <X className="size-5" />
            </button>
          </div>

          <SectionLabel>What would you like to work towards?</SectionLabel>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="For example: feel calmer during changes"
            className="mb-4 w-full rounded-2xl border-2 border-border bg-background p-3 text-base font-medium placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          />

          <SectionLabel>Why does it matter to you? (optional)</SectionLabel>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            rows={2}
            placeholder="In your own words"
            className="mb-4 w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-base leading-relaxed placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          />

          <SectionLabel>Small steps (one per line, optional)</SectionLabel>
          <textarea
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            rows={3}
            placeholder={'Ask for the day plan\nUse my quiet space card'}
            className="mb-4 w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-base leading-relaxed placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          />

          <SectionLabel>When would you like to work on it?</SectionLabel>
          <div className="mb-5 flex flex-wrap gap-2">
            {['No rush', 'This week', 'This half term', 'This term'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimescale(t)}
                aria-pressed={timescale === t}
                className={cn(
                  'min-h-11 rounded-full border-2 px-4 font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  timescale === t
                    ? 'border-primary bg-primary/10'
                    : 'border-border text-muted-foreground hover:border-primary/40',
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={save}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Save my goal
          </button>
        </Card>
      )}

      {goals.length === 0 && !composing ? (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="There is no pressure to have any. When something feels important to you, you can add it here."
        />
      ) : (
        <ul className="space-y-4">
          {goals.map((goal) => {
            const doneCount = goal.steps.filter((s) => s.done).length
            const pct = goal.steps.length
              ? Math.round((doneCount / goal.steps.length) * 100)
              : 0
            return (
              <li key={goal.id}>
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={cn(
                          'mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                          goal.status === 'active' && 'bg-primary/12 text-primary',
                          goal.status === 'paused' && 'bg-muted text-muted-foreground',
                          goal.status === 'done' && 'bg-mint/40 text-foreground',
                        )}
                      >
                        <Flag className="size-3.5" />
                        {goal.status === 'active' && 'In progress'}
                        {goal.status === 'paused' && 'Paused'}
                        {goal.status === 'done' && 'Done'}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-balance">
                        {goal.title}
                      </h3>
                      {goal.why && (
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {goal.why}
                        </p>
                      )}
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        {goal.timescale}
                      </p>
                    </div>
                  </div>

                  {goal.steps.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {doneCount} of {goal.steps.length} steps
                        </span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <ul className="mt-4 space-y-2">
                        {goal.steps.map((step) => (
                          <li key={step.id}>
                            <button
                              onClick={() => toggleGoalStep(goal.id, step.id)}
                              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                              <span
                                className={cn(
                                  'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                  step.done
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border',
                                )}
                              >
                                {step.done && <Check className="size-4" />}
                              </span>
                              <span
                                className={cn(
                                  'text-sm',
                                  step.done && 'text-muted-foreground line-through',
                                )}
                              >
                                {step.label}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                    {goal.status !== 'active' && (
                      <StatusButton
                        onClick={() => setGoalStatus(goal.id, 'active')}
                        icon={Play}
                        label="Resume"
                      />
                    )}
                    {goal.status === 'active' && (
                      <StatusButton
                        onClick={() => setGoalStatus(goal.id, 'paused')}
                        icon={Pause}
                        label="Pause"
                      />
                    )}
                    {goal.status !== 'done' && (
                      <StatusButton
                        onClick={() => setGoalStatus(goal.id, 'done')}
                        icon={Check}
                        label="Mark done"
                      />
                    )}
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function StatusButton({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-border px-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Icon className="size-4" /> {label}
    </button>
  )
}
