'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Check, Lock, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/safe-space/page-header'
import {
  ChoiceChip,
  IntensityScale,
  PrivacyNote,
  SectionLabel,
} from '@/components/safe-space/primitives'
import { useData } from '@/components/providers/data-provider'
import {
  EMOTION_OPTIONS,
  TRIGGER_OPTIONS,
  SENSORY_OPTIONS,
  HELPED_OPTIONS,
  type Sharing,
} from '@/lib/safe-space'
import { cn } from '@/lib/utils'

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

export default function CheckInPage() {
  const router = useRouter()
  const { addCheckIn, safeCircle } = useData()

  const [emotions, setEmotions] = useState<string[]>([])
  const [intensity, setIntensity] = useState(0)
  const [place, setPlace] = useState('')
  const [before, setBefore] = useState('')
  const [triggers, setTriggers] = useState<string[]>([])
  const [sensory, setSensory] = useState<string[]>([])
  const [helped, setHelped] = useState<string[]>([])
  const [need, setNeed] = useState('')
  const [note, setNote] = useState('')
  const [sharing, setSharing] = useState<Sharing>('private')
  const [sharedWith, setSharedWith] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const canSave = emotions.length > 0 && intensity > 0

  function save() {
    addCheckIn({
      emotions,
      intensity,
      place: place || undefined,
      before: before || undefined,
      triggers,
      sensory,
      helped,
      need: need || undefined,
      note: note || undefined,
      sharing,
      sharedWith: sharing === 'shared' ? sharedWith : [],
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md py-8 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Check className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Thank you for checking in</h1>
        <p className="mt-2 text-muted-foreground leading-relaxed text-pretty">
          You noticed how you feel, and that takes courage. Your check-in is saved
          {sharing === 'shared'
            ? ' and shared only with the people you chose.'
            : ' and kept private, just for you.'}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => router.push('/app/toolbox')}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Try a calm activity
          </button>
          <button
            onClick={() => router.push('/app')}
            className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-border px-6 font-semibold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="How are you feeling?"
        intro="Pick as many or as few as you like. There is no wrong answer, and you choose who sees this."
        readAloudText="How are you feeling? Pick as many or as few as you like. There is no wrong answer, and you choose who sees this."
      />

      <div className="space-y-6 pb-8">
        <Card className="p-5">
          <SectionLabel>My feelings right now</SectionLabel>
          <p className="-mt-1 mb-4 text-sm text-muted-foreground">
            Tap a face. Pick as many as you like.
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {EMOTION_OPTIONS.map((e) => {
              const selected = emotions.includes(e.label)
              return (
                <button
                  key={e.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setEmotions((p) => toggle(p, e.label))}
                  className={cn(
                    'flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-2 transition-all focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                    selected
                      ? 'border-primary bg-primary/8 scale-[1.02]'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  <span aria-hidden="true" className="text-4xl leading-none">
                    {e.face}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      selected ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {e.label}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <SectionLabel>How strong is the feeling?</SectionLabel>
          <IntensityScale value={intensity} onChange={setIntensity} />
        </Card>

        <Card className="p-5">
          <SectionLabel>Where are you?</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {['Home', 'School', 'Out and about', 'Somewhere else'].map((p) => (
              <ChoiceChip
                key={p}
                selected={place === p}
                onToggle={() => setPlace((cur) => (cur === p ? '' : p))}
              >
                {p}
              </ChoiceChip>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionLabel>What happened just before? (optional)</SectionLabel>
          <textarea
            value={before}
            onChange={(e) => setBefore(e.target.value)}
            rows={2}
            placeholder="Only if you want to. A few words is fine."
            className="w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-base leading-relaxed placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {TRIGGER_OPTIONS.map((t) => (
              <ChoiceChip
                key={t}
                selected={triggers.includes(t)}
                onToggle={() => setTriggers((p) => toggle(p, t))}
              >
                {t}
              </ChoiceChip>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionLabel>How does my body feel?</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {SENSORY_OPTIONS.map((s) => (
              <ChoiceChip
                key={s}
                selected={sensory.includes(s)}
                onToggle={() => setSensory((p) => toggle(p, s))}
              >
                {s}
              </ChoiceChip>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionLabel>What helped, even a little?</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {HELPED_OPTIONS.map((h) => (
              <ChoiceChip
                key={h}
                selected={helped.includes(h)}
                onToggle={() => setHelped((p) => toggle(p, h))}
              >
                {h}
              </ChoiceChip>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionLabel>Is there anything you need? (optional)</SectionLabel>
          <textarea
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            rows={2}
            placeholder="For example: a quiet space, a heads-up before change, someone to talk to."
            className="w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-base leading-relaxed placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          />
        </Card>

        <Card className="p-5">
          <SectionLabel>Who can see this?</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSharing('private')}
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                sharing === 'private'
                  ? 'border-primary bg-primary/8'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <Lock className="size-5 shrink-0 text-primary" />
              <span>
                <span className="block font-semibold">Only me</span>
                <span className="text-sm text-muted-foreground">Kept private in your space</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSharing('shared')}
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                sharing === 'shared'
                  ? 'border-primary bg-primary/8'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <Users className="size-5 shrink-0 text-primary" />
              <span>
                <span className="block font-semibold">Someone I trust</span>
                <span className="text-sm text-muted-foreground">Choose who from your Safe Circle</span>
              </span>
            </button>
          </div>

          {sharing === 'shared' && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Share with:</p>
              <div className="flex flex-wrap gap-2">
                {safeCircle.map((m) => (
                  <ChoiceChip
                    key={m.id}
                    selected={sharedWith.includes(m.id)}
                    onToggle={() => setSharedWith((p) => toggle(p, m.id))}
                  >
                    {m.name} · {m.role}
                  </ChoiceChip>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <PrivacyNote>
              You are always in control. You can change who sees this later, and you can
              delete it whenever you want.
            </PrivacyNote>
          </div>
        </Card>

        <button
          onClick={save}
          disabled={!canSave}
          className="flex w-full min-h-14 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-sm transition-transform enabled:hover:scale-[1.01] disabled:opacity-50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Heart className="size-5" />
          {canSave ? 'Save my check-in' : 'Pick a feeling to continue'}
        </button>
      </div>
    </div>
  )
}
