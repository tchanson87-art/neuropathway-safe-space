'use client'

import Link from 'next/link'
import {
  Heart,
  BookOpen,
  Target,
  Sparkles,
  Users,
  Wind,
  ArrowRight,
  Sun,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ReadAloud } from '@/components/safe-space/read-aloud'
import { PatternInsightCard } from '@/components/safe-space/pattern-insight-card'
import { useData } from '@/components/providers/data-provider'
import { useSettings } from '@/components/providers/settings-provider'

const AREAS = [
  {
    href: '/app/check-in',
    title: 'Check In',
    desc: 'Show how you feel right now.',
    icon: Heart,
    token: 'teal',
  },
  {
    href: '/app/journal',
    title: 'My Journal',
    desc: 'Write, draw or record what is on your mind.',
    icon: BookOpen,
    token: 'sky',
  },
  {
    href: '/app/goals',
    title: 'My Goals',
    desc: 'Small steps that matter to you.',
    icon: Target,
    token: 'mint',
  },
  {
    href: '/app/what-helps-me',
    title: 'What Helps Me',
    desc: 'The things that help adults understand you.',
    icon: Sparkles,
    token: 'sun',
  },
  {
    href: '/app/safe-circle',
    title: 'My Safe Circle',
    desc: 'The trusted adults who can help.',
    icon: Users,
    token: 'lavender',
  },
  {
    href: '/app/toolbox',
    title: 'Calming Toolbox',
    desc: 'Gentle activities for a wobbly moment.',
    icon: Wind,
    token: 'peach',
  },
] as const

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomePage() {
  const { profile, checkIns } = useData()
  const { ageMode } = useSettings()

  const lastCheckIn = checkIns[0]
  const intro =
    ageMode === 'younger'
      ? 'This is your space. There is no wrong way to use it. What would you like to do?'
      : "This is your space, and you're in control of it. Take whatever you need today."

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-secondary via-card to-card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sun className="size-4" />
              {greeting()}, {profile.name}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold text-balance sm:text-3xl">
              How are you today?
            </h1>
            <p className="mt-2 max-w-lg text-muted-foreground text-pretty leading-relaxed">
              {intro}
            </p>
          </div>
          <ReadAloud text={`${greeting()}, ${profile.name}. How are you today? ${intro}`} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/app/check-in"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Heart className="size-5" />
            Start a check-in
          </Link>
          <Link
            href="/app/toolbox"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-border bg-card px-6 font-semibold transition-colors hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Wind className="size-5 text-primary" />
            I need a calm moment
          </Link>
        </div>
      </section>

      {lastCheckIn && (
        <section aria-label="Your last check-in">
          <Card className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Last time you checked in
              </p>
              <p className="mt-1 font-medium">
                You felt {lastCheckIn.emotions.join(' and ').toLowerCase() || 'something'}
                {lastCheckIn.place ? ` at ${lastCheckIn.place.toLowerCase()}` : ''}.
              </p>
              <p className="text-sm text-muted-foreground">
                That is okay. Every feeling is allowed here.
              </p>
            </div>
            <Link
              href="/app/check-in"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
            >
              Check in again <ArrowRight className="size-4" />
            </Link>
          </Card>
        </section>
      )}

      <section aria-label="Gentle reflection">
        <PatternInsightCard />
      </section>

      <section aria-label="Explore your space">
        <h2 className="mb-4 font-display text-lg font-semibold">Your space</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-3xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Card className="h-full p-6 transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                <span
                  className="flex size-12 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `color-mix(in oklab, var(--${a.token}) 30%, var(--card))`,
                  }}
                >
                  <a.icon className="size-6 text-foreground" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {a.desc}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
