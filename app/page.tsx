'use client'

import {
  ArrowRight,
  Home,
  HeartHandshake,
  NotebookPen,
  Target,
  Sparkles,
  Users,
  ShieldCheck,
  Lock,
  Accessibility,
  Check,
  Moon,
  Sun,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Wordmark } from '@/components/safe-space/logo'
import { SiteFooter } from '@/components/safe-space/site-footer'
import { useSettings } from '@/components/providers/settings-provider'

const CORE_MESSAGES = [
  { title: 'Your voice matters.', token: 'teal' },
  { title: 'Needs first, not diagnosis.', token: 'sky' },
  { title: 'Behaviour is communication.', token: 'lavender' },
  { title: 'Prevention Is the Cure.', token: 'peach' },
]

const AREAS = [
  { icon: Home, title: 'Home', desc: 'A calm starting point with a gentle greeting and no pressure.' },
  { icon: HeartHandshake, title: 'My Check-In', desc: 'Show how you feel with words, colours or pictures.' },
  { icon: NotebookPen, title: 'My Journal', desc: 'Write, speak or draw your day — privately, or shared if you choose.' },
  { icon: Target, title: 'My Goals', desc: 'Break something you care about into small, doable steps.' },
  { icon: Sparkles, title: 'What Helps Me', desc: 'Build a "How to Support Me" profile in your own words.' },
  { icon: Users, title: 'My Safe Circle', desc: 'Choose trusted adults and control what they can see.' },
]

const IS = [
  'A calm, child-led place to express feelings',
  'A way to record everyday experiences over time',
  'A tool to share your voice with trusted adults, when you choose',
  'A way to recognise strengths, triggers and what helps',
]
const IS_NOT = [
  'It does not diagnose or assess you',
  'It is not an emergency or crisis service',
  'It is not an AI chatbot or virtual friend',
  'It never makes decisions about you on its own',
]

export default function LandingPage() {
  const { theme, toggleTheme } = useSettings()

  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
        <Wordmark showOrg />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <Link
            href="/pro"
            className="hidden min-h-11 items-center gap-2 rounded-full border-2 border-border px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted sm:inline-flex"
          >
            For professionals
          </Link>
          <Link
            href="/enter"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Enter Safe Space
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-5xl items-center gap-8 px-5 pt-6 pb-14 md:grid-cols-2 md:pt-12">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-bold tracking-wide text-secondary-foreground uppercase">
            NeuroPathway · Social Innovation CIC
          </p>
          <h1 className="font-display text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl">
            Your voice matters.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            Safe Space is a calm place for children and young people to express how they
            feel, in a way that suits them — and to be heard by trusted adults before
            things feel too big.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="inline-flex min-h-13 items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Enter Safe Space
              <ArrowRight className="size-5" />
            </Link>
            <a
              href="#areas"
              className="inline-flex min-h-13 items-center gap-2 rounded-full border-2 border-border bg-card px-6 py-3 text-base font-bold text-foreground transition-colors hover:bg-muted"
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            A demonstration prototype for schools, families and partners. Fictional
            information only.
          </p>
        </div>

        <div className="relative flex justify-center">
          <div className="relative flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-full border border-accent/30 bg-[#0f1a3a] p-6 shadow-lg">
            <Image
              src="/images/neuropathway-logo.jpeg"
              alt="NeuroPathway Safe Space logo: a split brain within a golden orbit, above a winding pathway"
              width={640}
              height={640}
              priority
              className="animate-float-soft h-auto w-full rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Core messages */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid w-full max-w-5xl gap-3 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_MESSAGES.map((m) => (
            <div key={m.title} className="flex items-center gap-3 rounded-2xl bg-background p-4">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--${m.token})` }}
                aria-hidden="true"
              />
              <p className="font-display font-bold text-balance">{m.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Areas */}
      <section id="areas" className="mx-auto w-full max-w-5xl scroll-mt-6 px-5 py-14">
        <h2 className="font-display text-2xl font-bold text-balance sm:text-3xl">
          A calm place to be heard
        </h2>
        <p className="mt-2 max-w-xl text-muted-foreground text-pretty leading-relaxed">
          Six simple areas, designed with young people in mind. Nothing is competitive,
          and no one is ever shown as failing.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => (
            <div key={a.title} className="rounded-2xl border border-border bg-card p-5">
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <a.icon className="size-6" />
              </span>
              <h3 className="font-display text-lg font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Is / Is not */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-14 md:grid-cols-2">
          <div className="rounded-3xl bg-background p-6">
            <h3 className="font-display text-xl font-bold">What Safe Space is</h3>
            <ul className="mt-4 space-y-3">
              {IS.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-background p-6">
            <h3 className="font-display text-xl font-bold">What it is not</h3>
            <ul className="mt-4 space-y-3">
              {IS_NOT.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    ·
                  </span>
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Careful by design */}
      <section className="mx-auto w-full max-w-5xl px-5 py-14">
        <h2 className="font-display text-2xl font-bold text-balance sm:text-3xl">
          Careful by design
        </h2>
        <p className="mt-2 max-w-xl text-muted-foreground text-pretty leading-relaxed">
          Safe Space is built to support formal review through data-protection,
          safeguarding, information-governance, accessibility and clinical-safety
          workstreams.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Lock,
              title: 'Privacy by default',
              desc: 'Entries are private unless the child chooses to share. Data minimisation, clear correction and access routes, and full audit trails.',
            },
            {
              icon: ShieldCheck,
              title: 'Human-led safeguarding',
              desc: 'Any concern is routed only to authorised, trained people. AI never decides whether a child is safe and never contacts emergency services.',
            },
            {
              icon: Accessibility,
              title: 'Accessible for everyone',
              desc: 'Low-stimulation mode, light and dark themes, adjustable text, read-aloud support and reduced motion — set by the young person.',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-5">
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <c.icon className="size-6" />
              </span>
              <h3 className="font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-16">
        <div className="decorative-gradient flex flex-col items-start gap-5 rounded-3xl border border-border p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-balance">
              Ready to look around?
            </h2>
            <p className="mt-1 max-w-md text-muted-foreground text-pretty leading-relaxed">
              Step through the child-friendly onboarding to see how Safe Space feels.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex min-h-13 shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Enter Safe Space
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
