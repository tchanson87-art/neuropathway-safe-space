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
  Database,
  Cpu,
  Lightbulb,
  UserCheck,
  Gavel,
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

// The human-in-the-loop governance flow. The system organises and highlights;
// a trained, authorised person always makes the decision.
const DECISION_FLOW = [
  {
    icon: Database,
    kind: 'system' as const,
    title: 'Data',
    desc: "A child's own words, check-ins and everyday observations — recorded over time.",
  },
  {
    icon: Cpu,
    kind: 'system' as const,
    title: 'System analysis',
    desc: 'Entries are organised by need and impact. Nothing is diagnosed or scored as failing.',
  },
  {
    icon: Lightbulb,
    kind: 'system' as const,
    title: 'Pattern / information highlight',
    desc: 'Frequency, triggers and unmet needs are surfaced clearly for a person to read.',
  },
  {
    icon: UserCheck,
    kind: 'human' as const,
    title: 'Human review',
    desc: 'A trained, authorised adult reads the evidence in context — the system never acts alone.',
  },
  {
    icon: Gavel,
    kind: 'human' as const,
    title: 'Professional decision',
    desc: 'The professional decides what it means and what should happen next. They stay accountable.',
  },
  {
    icon: HeartHandshake,
    kind: 'human' as const,
    title: 'Action / support',
    desc: 'Support is put in place early — with the child and family, before things feel too big.',
  },
]

// Verified official figures. Each is individually attributed below.
const NEED_STATS = [
  { value: '718,838', label: 'children and young people in England had an EHC plan', token: 'teal' },
  { value: '46.1%', label: 'of new EHC plans were issued within the statutory 20 weeks', token: 'sky' },
  { value: '6.0%', label: 'of pupils have an EHC plan — up from 5.3% a year earlier', token: 'lavender' },
  { value: '14.8%', label: 'of pupils are on SEN support without a plan', token: 'peach' },
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

      {/* Why this matters */}
      <section className="mx-auto w-full max-w-5xl px-5 py-14">
        <h2 className="font-display text-2xl font-bold text-balance sm:text-3xl">
          Why early understanding matters
        </h2>
        <p className="mt-2 max-w-xl text-muted-foreground text-pretty leading-relaxed">
          Need is rising and formal support is slow to arrive. Recognising and recording
          need early — before things feel too big — is how prevention becomes the cure.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NEED_STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <span
                className="mb-3 block h-1.5 w-10 rounded-full"
                style={{ backgroundColor: `var(--${s.token})` }}
                aria-hidden="true"
              />
              <p className="font-display text-3xl font-extrabold tracking-tight">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
          Sources: Department for Education, <span className="italic">Education, health and care
          plans</span> (England, January 2026) and <span className="italic">Special educational
          needs in England</span> (2025/26 school census). Figures describe the national picture,
          not any individual.
        </p>
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

      {/* How decisions are made */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto w-full max-w-5xl px-5 py-14">
          <h2 className="font-display text-2xl font-bold text-balance sm:text-3xl">
            How decisions are made
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground text-pretty leading-relaxed">
            The system highlights; a person decides. Every step moves towards a trained,
            authorised professional — never an automated judgement about a child.
          </p>

          <ol className="mt-8 space-y-3">
            {DECISION_FLOW.map((step, i) => {
              const isHuman = step.kind === 'human'
              return (
                <li key={step.title} className="relative">
                  <div className="flex items-start gap-4 rounded-2xl border border-border bg-background p-4">
                    <span
                      className={
                        isHuman
                          ? 'inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground'
                          : 'inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary'
                      }
                    >
                      <step.icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-display text-base font-bold">
                          {i + 1}. {step.title}
                        </span>
                        <span
                          className={
                            isHuman
                              ? 'rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold tracking-wide text-primary uppercase'
                              : 'rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold tracking-wide text-muted-foreground uppercase'
                          }
                        >
                          {isHuman ? 'Human decides' : 'System assists'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed text-pretty">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  {i < DECISION_FLOW.length - 1 ? (
                    <span
                      className="ml-[38px] flex h-3 w-px items-center bg-border"
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              )
            })}
          </ol>
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
