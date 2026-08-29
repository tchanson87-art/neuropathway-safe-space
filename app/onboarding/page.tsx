'use client'

import {
  ArrowRight,
  ArrowLeft,
  HeartHandshake,
  Lock,
  Users,
  ShieldAlert,
  LifeBuoy,
  Accessibility,
  DoorOpen,
  Check,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Wordmark } from '@/components/safe-space/logo'
import { ReadAloud } from '@/components/safe-space/read-aloud'

type Step = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  example?: string
}

const STEPS: Step[] = [
  {
    icon: HeartHandshake,
    title: 'Welcome to Safe Space',
    body: 'This is a calm place to show how you feel, keep a journal, set goals and share your voice with people you trust. There is no right or wrong way to use it.',
  },
  {
    icon: HeartHandshake,
    title: 'What it can help with',
    body: 'It can help you notice feelings, remember what happened, spot what helps you, and let trusted adults understand you better — so support can come sooner.',
  },
  {
    icon: ShieldAlert,
    title: 'What it cannot do',
    body: 'Safe Space does not decide what is wrong with you and is not an emergency service. It is not a robot friend and will never chat back to you or pretend to be a person.',
  },
  {
    icon: Lock,
    title: 'Private or shared — you choose',
    body: 'Everything you add is private by default. That means only you can see it. If you want, you can share something with a trusted adult from your Safe Circle.',
    example: 'Private means only you. Shared means a chosen adult can see that one thing.',
  },
  {
    icon: Users,
    title: 'How your words are kept',
    body: 'Your words are stored safely and are always kept exactly as you wrote them. If you share something, you can see who saw it and when. You can ask for anything to be corrected.',
  },
  {
    icon: ShieldAlert,
    title: 'When an adult may need to act',
    body: 'We can never promise complete secrecy. If a trusted adult believes you or someone else may be in danger, they may need to act to keep everyone safe. They will try to talk with you about it.',
  },
  {
    icon: LifeBuoy,
    title: 'Asking for help',
    body: 'There is an "I need support" button on every screen. You can use it to ask to talk, say something is worrying you, or ask for help. It goes to a real person, not a computer.',
  },
  {
    icon: Accessibility,
    title: 'Make it comfortable',
    body: 'In Settings you can turn on a calm low-stimulation mode, switch light or dark, make text bigger, turn on read-aloud, and reduce movement on the screen.',
  },
  {
    icon: DoorOpen,
    title: 'Leaving safely',
    body: 'You can leave any time using "Exit safely" in the menu. Take breaks whenever you like — you will never be in trouble for not checking in.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [i, setI] = useState(0)
  const step = STEPS[i]
  const last = i === STEPS.length - 1
  const readText = `${step.title}. ${step.body} ${step.example ?? ''}`

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-5 py-4">
        <Wordmark />
        <Link
          href="/enter"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Skip
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-8">
        {/* progress dots */}
        <div className="mb-8 flex items-center justify-center gap-1.5" aria-hidden="true">
          {STEPS.map((_, n) => (
            <span
              key={n}
              className={`h-1.5 rounded-full transition-all ${
                n === i ? 'w-6 bg-primary' : n < i ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-primary/12 text-primary animate-float-soft">
            <step.icon className="size-9" />
          </span>
          <div className="mb-2 flex items-center justify-center gap-1">
            <h1 className="font-display text-2xl font-bold text-balance sm:text-3xl">
              {step.title}
            </h1>
            <ReadAloud text={readText} />
          </div>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            {step.body}
          </p>
          {step.example && (
            <p className="mt-4 max-w-md rounded-2xl bg-secondary/50 px-4 py-3 text-sm font-medium text-secondary-foreground">
              {step.example}
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {i > 0 ? (
            <button
              type="button"
              onClick={() => setI((n) => n - 1)}
              className="inline-flex min-h-13 items-center gap-2 rounded-full border-2 border-border bg-card px-5 py-3 font-bold text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-5" />
              Back
            </button>
          ) : (
            <span className="flex-1" />
          )}
          {last ? (
            <button
              type="button"
              onClick={() => router.push('/enter')}
              className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              I&apos;m ready
              <Check className="size-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setI((n) => n + 1)}
              className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Next
              <ArrowRight className="size-5" />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
