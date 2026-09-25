'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  ArrowLeft,
  SkipForward,
  Lock,
  Users,
  Wind,
  NotebookPen,
  CalendarDays,
  HeartHandshake,
  ShieldAlert,
  Check,
  Phone,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Guide, GuideAvatar } from '@/components/safe-space/guide'
import { ReadAloud } from '@/components/safe-space/read-aloud'
import { useData } from '@/components/providers/data-provider'
import { useSettings } from '@/components/providers/settings-provider'
import {
  buildEverydayFlow,
  answersToCheckIn,
  answersRaiseSafety,
  UNSURE,
  type EverydayAnswers,
  type EverydayOption,
} from '@/lib/everyday-questions'
import { membersAuthorisedFor, type Sharing } from '@/lib/safe-space'
import { cn } from '@/lib/utils'

type Stage = 'questions' | 'sharing' | 'done'

export default function TodayCheckInPage() {
  const router = useRouter()
  const { addCheckIn, addSupportRequest, safeCircle } = useData()
  const { ageMode } = useSettings()

  const questions = useMemo(() => buildEverydayFlow(), [])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<EverydayAnswers>({})
  const [stage, setStage] = useState<Stage>('questions')
  const [sharing, setSharing] = useState<Sharing>('private')
  const [sharedWith, setSharedWith] = useState<string[]>([])
  const [sharedWithAdult, setSharedWithAdult] = useState(false)

  const total = questions.length
  const current = questions[step]
  const raisedSafety = answersRaiseSafety(answers)
  // Only trusted adults authorised to see check-ins can be chosen.
  const authorised = membersAuthorisedFor(safeCircle, 'check-ins')

  function choose(option: EverydayOption) {
    setAnswers((prev) => ({ ...prev, [current.id]: option }))
    advance()
  }

  function skip() {
    setAnswers((prev) => ({ ...prev, [current.id]: 'skipped' }))
    advance()
  }

  function advance() {
    if (step < total - 1) {
      setStep((s) => s + 1)
    } else {
      setStage('sharing')
    }
  }

  function back() {
    if (stage === 'sharing') {
      setStage('questions')
      return
    }
    if (step > 0) setStep((s) => s - 1)
  }

  function finish() {
    addCheckIn(answersToCheckIn(questions, answers, sharing, sharing === 'shared' ? sharedWith : []))
    setStage('done')
  }

  function shareWithTrustedAdult() {
    const adult =
      authorised.find((m) => m.role === 'Parent / Carer') ?? authorised[0] ?? safeCircle[0]
    if (adult) {
      addSupportRequest(
        'talk',
        adult.id,
        'I did my everyday check-in and would like a chat when you can.',
      )
      setSharedWithAdult(true)
    }
  }

  // ----- Sharing step -----
  if (stage === 'sharing') {
    return (
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <Guide>
            {raisedSafety
              ? 'Thank you for telling me how today really felt. Before we finish, you choose who — if anyone — can see this.'
              : 'Nice one for checking in. Last thing: you decide who can see this. There is no wrong choice.'}
          </Guide>
        </div>

        {raisedSafety && <SafetyGuidance ageMode={ageMode} />}

        <Card className="p-5">
          <p className="mb-1 font-display text-lg font-bold">Who can see this check-in?</p>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Nobody sees your answers unless you choose to share them. No computer watches your
            check-ins, and no one is alerted automatically.
          </p>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => setSharing('private')}
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                sharing === 'private' ? 'border-primary bg-primary/8' : 'border-border hover:border-primary/40',
              )}
            >
              <Lock className="size-5 shrink-0 text-primary" />
              <span>
                <span className="block font-semibold">Keep it just for me</span>
                <span className="text-sm text-muted-foreground">Private in your space. This is the default.</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSharing('shared')}
              disabled={authorised.length === 0}
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50',
                sharing === 'shared' ? 'border-primary bg-primary/8' : 'border-border hover:border-primary/40',
              )}
            >
              <Users className="size-5 shrink-0 text-primary" />
              <span>
                <span className="block font-semibold">Share with someone I trust</span>
                <span className="text-sm text-muted-foreground">
                  {authorised.length > 0
                    ? 'Choose who from your Safe Circle below.'
                    : 'No one in your Safe Circle can see check-ins yet.'}
                </span>
              </span>
            </button>
          </div>

          {sharing === 'shared' && authorised.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Share with:</p>
              <div className="flex flex-wrap gap-2">
                {authorised.map((m) => {
                  const on = sharedWith.includes(m.id)
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setSharedWith((p) => (on ? p.filter((x) => x !== m.id) : [...p, m.id]))
                      }
                      className={cn(
                        'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                        on
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/40',
                      )}
                    >
                      {m.name} · {m.role}
                      {on && <Check className="size-4 text-primary" />}
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 rounded-2xl bg-secondary/50 p-3 text-sm leading-relaxed text-secondary-foreground">
                Only the people you tick will be able to see this. You can change your mind or
                delete it later — you are always in control.
              </p>
            </div>
          )}
        </Card>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={back}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-border px-5 font-semibold text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <button
            type="button"
            onClick={finish}
            disabled={sharing === 'shared' && sharedWith.length === 0}
            className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-lg font-semibold text-primary-foreground shadow-sm transition-transform enabled:hover:scale-[1.01] disabled:opacity-50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:flex-none"
          >
            <Check className="size-5" />
            {sharing === 'shared' ? 'Share and finish' : 'Save and finish'}
          </button>
        </div>
      </div>
    )
  }

  // ----- Done step: helpful next choices -----
  if (stage === 'done') {
    return (
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <GuideAvatar size={96} float className="mx-auto" />
          <h1 className="mt-4 font-display text-2xl font-bold text-balance">
            Thank you for checking in
          </h1>
          <p className="mt-2 text-muted-foreground leading-relaxed text-pretty">
            You noticed how today felt, and that takes courage. It is saved
            {sharing === 'shared' ? ' and shared only with the people you chose.' : ' and kept just for you.'}
          </p>
        </div>

        {raisedSafety && <SafetyGuidance ageMode={ageMode} className="mb-6" />}

        <p className="mb-3 text-center text-sm font-semibold text-muted-foreground">
          Would you like to do one small thing next? Totally your choice.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <NextChoice href="/app/calm" icon={Wind} token="teal" title="A calm moment" desc="A gentle breathing activity." />
          <NextChoice href="/app/journal" icon={NotebookPen} token="sky" title="Write a little" desc="A journal prompt to explore a thought." />
          <NextChoice href="/app/goals" icon={HeartHandshake} token="mint" title="Plan for tomorrow" desc="Set one small step that matters." />
          <NextChoice href="/app/calendar" icon={CalendarDays} token="lavender" title="See my check-ins" desc="Look back at how days have felt." />
        </div>

        <div className="mt-5">
          {sharedWithAdult ? (
            <p className="flex items-center justify-center gap-2 rounded-2xl bg-primary/10 p-4 text-sm font-medium text-primary">
              <Check className="size-4" /> Your trusted adult has been asked for a chat.
            </p>
          ) : (
            <button
              type="button"
              onClick={shareWithTrustedAdult}
              disabled={safeCircle.length === 0}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-border px-6 font-semibold transition-colors hover:border-primary/40 disabled:opacity-50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Users className="size-5 text-primary" />
              Ask a trusted adult for a chat
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push('/app')}
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Back to home
        </button>
      </div>
    )
  }

  // ----- Questions step: one at a time -----
  const answered = answers[current.id]
  const progressText = `Question ${step + 1} of ${total}`

  return (
    <div className="mx-auto max-w-xl">
      {/* progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {current.chip}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">{progressText}</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-5 flex items-start gap-3">
        <GuideAvatar size={56} float />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h1 className="font-display text-2xl font-bold text-balance">{current.prompt}</h1>
            <ReadAloud text={`${current.prompt}. ${current.helper ?? ''}`} />
          </div>
          {current.helper && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{current.helper}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {current.options.map((o) => {
          const selected = answered !== 'skipped' && answered?.value === o.value
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={selected}
              onClick={() => choose(o)}
              className={cn(
                'flex min-h-28 flex-col items-center justify-center gap-2 rounded-3xl border-2 p-4 text-center transition-all focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                selected ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <span aria-hidden="true" className="text-4xl leading-none">{o.emoji}</span>
              <span className="text-sm font-semibold leading-snug">{o.label}</span>
            </button>
          )
        })}
      </div>

      {/* "I'm not sure" + Skip on every question */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => choose(UNSURE)}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-border px-5 font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span aria-hidden="true">{UNSURE.emoji}</span> {UNSURE.label}
        </button>
        <button
          type="button"
          onClick={skip}
          className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <SkipForward className="size-4" /> Skip this one
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <button
          type="button"
          onClick={skip}
          className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {step === total - 1 ? 'Finish' : 'Next'} <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function NextChoice({
  href,
  icon: Icon,
  token,
  title,
  desc,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  token: string
  title: string
  desc: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card
        className="flex h-full items-center gap-3 rounded-3xl border-2 p-4 transition-transform group-hover:-translate-y-0.5"
        style={{
          backgroundColor: `color-mix(in oklab, var(--${token}) 14%, var(--card))`,
          borderColor: `color-mix(in oklab, var(--${token}) 34%, var(--card))`,
        }}
      >
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `color-mix(in oklab, var(--${token}) 55%, var(--card))` }}
        >
          <Icon className="size-5 text-foreground" />
        </span>
        <span>
          <span className="block font-semibold">{title}</span>
          <span className="text-sm text-muted-foreground">{desc}</span>
        </span>
      </Card>
    </Link>
  )
}

function SafetyGuidance({
  ageMode,
  className,
}: {
  ageMode: 'younger' | 'teen'
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-5',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-6 shrink-0 text-destructive" />
        <div>
          <p className="font-display text-lg font-bold text-destructive">
            You don&apos;t have to carry this on your own
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            {ageMode === 'younger'
              ? 'It sounds like things feel really big right now. Please tell a grown-up you trust as soon as you can — a parent, carer, or someone at school. They want to help you.'
              : 'It sounds like things feel really heavy right now. Please reach out to a trusted adult as soon as you can — a parent, carer, or someone at school. You deserve support.'}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/app/support"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Users className="size-5" /> Reach my Safe Circle
            </Link>
            <a
              href="tel:116123"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-destructive/40 px-5 font-semibold text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Phone className="size-5 text-destructive" /> Get urgent help now
            </a>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            If you are in danger or need help right away, call 999. You can talk to Childline free,
            any time, on 0800 1111. No computer is watching this — reaching out is your choice, and
            it is a brave one.
          </p>
        </div>
      </div>
    </div>
  )
}
