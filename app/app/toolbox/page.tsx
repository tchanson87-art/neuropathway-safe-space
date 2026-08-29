'use client'

import { useState } from 'react'
import {
  Wind,
  Eye,
  Hand,
  Footprints,
  Music,
  PenLine,
  ChevronRight,
  Check,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/safe-space/page-header'
import { BreathingExercise } from '@/components/safe-space/breathing-exercise'
import { cn } from '@/lib/utils'

const GROUNDING_STEPS = [
  { count: 5, sense: 'things you can see', icon: Eye },
  { count: 4, sense: 'things you can touch', icon: Hand },
  { count: 3, sense: 'things you can hear', icon: Music },
  { count: 2, sense: 'things you can smell', icon: Wind },
  { count: 1, sense: 'slow breath', icon: Footprints },
]

type Tool = 'breathing' | 'grounding' | 'sounds' | 'brain-dump'

const TOOLS: { id: Tool; title: string; desc: string; icon: typeof Wind; token: string }[] = [
  { id: 'breathing', title: 'Breathe with me', desc: 'A gentle circle to slow your breathing.', icon: Wind, token: 'teal' },
  { id: 'grounding', title: '5-4-3-2-1 grounding', desc: 'Notice the world around you, one sense at a time.', icon: Eye, token: 'sky' },
  { id: 'sounds', title: 'Calming sounds', desc: 'Soft sounds to help you settle.', icon: Music, token: 'lavender' },
  { id: 'brain-dump', title: 'Empty my head', desc: 'Let busy thoughts out onto the page.', icon: PenLine, token: 'mint' },
]

export default function ToolboxPage() {
  const [active, setActive] = useState<Tool | null>(null)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Calming Toolbox"
        intro="A wobbly moment is okay. These are gentle things you can try, whenever you need them. There is nothing to get right."
        readAloudText="Calming Toolbox. A wobbly moment is okay. These are gentle things you can try, whenever you need them. There is nothing to get right."
      />

      {!active ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActive(tool.id)}
              className="text-left focus-visible:outline-none"
            >
              <Card className="h-full p-5 transition-all hover:-translate-y-1 hover:shadow-md">
                <span
                  className="flex size-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `color-mix(in oklab, var(--${tool.token}) 30%, var(--card))` }}
                >
                  <tool.icon className="size-6 text-foreground" />
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{tool.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {tool.desc}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Try it <ChevronRight className="size-4" />
                </span>
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setActive(null)}
            className="mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-full pr-3 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Back to the toolbox
          </button>
          <Card className="p-6">
            {active === 'breathing' && <BreathingExercise />}
            {active === 'grounding' && <Grounding />}
            {active === 'sounds' && <CalmingSounds />}
            {active === 'brain-dump' && <BrainDump />}
          </Card>
        </div>
      )}
    </div>
  )
}

function Grounding() {
  const [step, setStep] = useState(0)
  const current = GROUNDING_STEPS[step]
  const done = step >= GROUNDING_STEPS.length

  if (done) {
    return (
      <div className="py-8 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Check className="size-8" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold">Well done</h3>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          You brought yourself back to the here and now. That is a real skill.
        </p>
        <button
          onClick={() => setStep(0)}
          className="mt-5 inline-flex min-h-12 items-center rounded-full border-2 border-border px-6 font-semibold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Go again
        </button>
      </div>
    )
  }

  const Icon = current.icon
  return (
    <div className="py-6 text-center">
      <span className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Icon className="size-9" />
      </span>
      <p className="mt-5 font-display text-4xl font-bold text-primary">{current.count}</p>
      <p className="mt-1 text-xl font-medium text-balance">{current.sense}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Take your time. There is no rush.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2" aria-hidden="true">
        {GROUNDING_STEPS.map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-2 rounded-full transition-all',
              i === step ? 'w-8 bg-primary' : 'w-2 bg-muted',
            )}
          />
        ))}
      </div>
      <button
        onClick={() => setStep((s) => s + 1)}
        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-8 font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        Next
      </button>
    </div>
  )
}

function CalmingSounds() {
  const sounds = ['Gentle waves', 'Soft rain', 'Quiet forest', 'Slow hum']
  const [playing, setPlaying] = useState<string | null>(null)
  return (
    <div>
      <h3 className="font-display text-lg font-semibold">Calming sounds</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        Pick a sound and let it play softly. Use headphones if that feels better.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {sounds.map((s) => (
          <li key={s}>
            <button
              onClick={() => setPlaying((cur) => (cur === s ? null : s))}
              aria-pressed={playing === s}
              className={cn(
                'flex w-full min-h-14 items-center gap-3 rounded-2xl border-2 px-4 font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                playing === s ? 'border-primary bg-primary/8' : 'border-border hover:border-primary/40',
              )}
            >
              <Music className={cn('size-5', playing === s ? 'text-primary' : 'text-muted-foreground')} />
              {s}
              {playing === s && (
                <span className="ml-auto text-xs font-semibold text-primary">Playing</span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
        Demo prototype: audio playback would be wired up here in the full app.
      </p>
    </div>
  )
}

function BrainDump() {
  const [text, setText] = useState('')
  const [cleared, setCleared] = useState(false)
  return (
    <div>
      <h3 className="font-display text-lg font-semibold">Empty my head</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        Write down anything that is buzzing around. When you are ready, you can gently let
        it go. Nothing here is saved unless you choose to.
      </p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setCleared(false)
        }}
        rows={6}
        placeholder="Let the thoughts out..."
        className="mt-4 w-full resize-none rounded-2xl border-2 border-border bg-background p-4 text-base leading-relaxed focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => {
            setText('')
            setCleared(true)
          }}
          className="inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Let it go
        </button>
        {cleared && (
          <span className="text-sm font-medium text-primary">Gone. Take a breath.</span>
        )}
      </div>
    </div>
  )
}
