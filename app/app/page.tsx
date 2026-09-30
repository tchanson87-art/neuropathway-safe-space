'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  NotebookPen,
  Target,
  Wind,
  Sparkles,
  Users,
  LifeBuoy,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ReadAloud } from '@/components/safe-space/read-aloud'
import { PatternInsightCard } from '@/components/safe-space/pattern-insight-card'
import { useData } from '@/components/providers/data-provider'
import { cn } from '@/lib/utils'

const AREAS = [
  {
    href: '/app/journal',
    title: 'Let it out',
    desc: 'A blank page. Your words. No pressure.',
    icon: NotebookPen,
    filled: true,
  },
  {
    href: '/app/what-helps-me',
    title: 'What helps me',
    desc: 'The things that help adults understand you.',
    icon: Sparkles,
    filled: false,
  },
  {
    href: '/app/goals',
    title: 'Dream a little',
    desc: 'Something you want to try, learn or become.',
    icon: Target,
    filled: true,
  },
  {
    href: '/app/toolbox',
    title: 'Find your calm',
    desc: 'Choose something that feels right for you.',
    icon: Wind,
    filled: false,
  },
  {
    href: '/app/safe-circle',
    title: 'My safe circle',
    desc: 'The trusted people who have your back.',
    icon: Users,
    filled: true,
  },
  {
    href: '/app/support',
    title: 'You can ask for help',
    desc: 'You deserve support when things feel difficult.',
    icon: LifeBuoy,
    filled: false,
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
  const lastCheckIn = checkIns[0]
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

  return (
    <div className="flex flex-col gap-8">
      <section className="relative isolate overflow-hidden rounded-2xl bg-sidebar text-sidebar-foreground">
        <Image
          src="/images/hero-waterfall.png"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 70vw, 100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sidebar/90 via-sidebar/60 to-sidebar/10" />
        <div className="flex items-start justify-between gap-4 p-6 sm:p-10">
          <div className="flex max-w-xl flex-col gap-5">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] text-sidebar-primary"
              suppressHydrationWarning
            >
              {greeting()}, {profile.name}
            </p>
            <h1 className="font-display text-4xl leading-tight font-bold text-balance sm:text-5xl">
              Your voice.
              <br />
              Your pace.
              <br />
              Your space.
            </h1>
            <p className="leading-relaxed text-pretty opacity-90">
              Your feelings matter. Your voice matters. Small steps can help you grow.
            </p>
            <Link
              href="/app/check-in"
              className="inline-flex min-h-12 items-center self-start rounded-lg bg-accent px-5 font-bold text-accent-foreground transition hover:brightness-105 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              How are you feeling?
            </Link>
          </div>
          <ReadAloud
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            text={`${greeting()}, ${profile.name}. Your voice. Your pace. Your space. Your feelings matter. Your voice matters. Small steps can help you grow.`}
          />
        </div>
      </section>

      {lastCheckIn && (
        <section aria-label="Your last check-in">
          <Card className="flex flex-row items-center justify-between gap-4 rounded-2xl p-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Last time you checked in
              </p>
              <p className="font-bold">
                You felt {lastCheckIn.emotions.join(' and ').toLowerCase() || 'something'}
                {lastCheckIn.place ? ` at ${lastCheckIn.place.toLowerCase()}` : ''}.
              </p>
              <p className="text-sm text-muted-foreground">Every feeling is allowed here.</p>
            </div>
            <Link
              href="/app/check-in"
              className="hidden shrink-0 items-center gap-1 text-sm font-bold text-tile hover:underline sm:inline-flex"
            >
              Check in again <ArrowRight className="size-4" />
            </Link>
          </Card>
        </section>
      )}

      <section aria-label="Gentle reflection">
        <PatternInsightCard />
      </section>

      <section aria-labelledby="need-today" className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <h2 id="need-today" className="font-display text-2xl font-bold text-balance">
            What do you need today?
          </h2>
          <p className="shrink-0 text-sm text-muted-foreground" suppressHydrationWarning>
            {today}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={cn(
                'group flex min-h-52 flex-col gap-4 rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none',
                a.filled
                  ? 'border-tile bg-tile text-tile-foreground'
                  : 'border-border bg-card text-tile',
              )}
            >
              <a.icon className="size-6" />
              <h3 className="font-display text-lg font-bold">{a.title}</h3>
              <p
                className={cn(
                  'leading-relaxed',
                  a.filled ? 'opacity-90' : 'text-muted-foreground',
                )}
              >
                {a.desc}
              </p>
              <ArrowRight className="mt-auto size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
