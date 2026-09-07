import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Wordmark } from '@/components/safe-space/logo'
import { SiteFooter } from '@/components/safe-space/site-footer'
import { POLICIES } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Policies · NeuroPathway Safe Space',
  description:
    'Privacy, safeguarding, and governance and compliance for NeuroPathway Safe Space.',
}

export default function PoliciesPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
          <Wordmark />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <h1 className="font-display text-3xl font-bold text-balance sm:text-4xl">
          Policies & governance
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed text-pretty">
          Safe Space is built on clear standards for privacy, safeguarding and
          responsible AI. These summaries explain, in plain language, how the platform
          protects children and young people.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POLICIES.map((policy) => {
            const Icon = policy.icon
            return (
              <Link
                key={policy.slug}
                href={`/policies/${policy.slug}`}
                className="group flex flex-col rounded-3xl border-2 border-border bg-card p-6 transition-colors hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold">{policy.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed text-pretty">
                  {policy.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
