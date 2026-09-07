import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { Wordmark } from '@/components/safe-space/logo'
import { SiteFooter } from '@/components/safe-space/site-footer'
import { POLICIES, getPolicy } from '@/lib/policies'

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const policy = getPolicy(slug)
  if (!policy) return { title: 'Policy not found' }
  return {
    title: `${policy.title} · NeuroPathway Safe Space`,
    description: policy.summary,
  }
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const policy = getPolicy(slug)
  if (!policy) notFound()

  const Icon = policy.icon

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4">
          <Wordmark />
          <Link
            href="/policies"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" />
            All policies
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-7" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-balance sm:text-4xl">
          {policy.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{policy.updated}</p>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed text-pretty">
          {policy.intro}
        </p>

        <div className="mt-8 space-y-6">
          {policy.sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-3xl border-2 border-border bg-card p-6"
            >
              <h2 className="font-display text-xl font-bold text-balance">
                {section.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-pretty leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border-2 border-accent/50 bg-accent/20 p-4 text-sm leading-relaxed text-accent-foreground">
          This is demonstration content for a prototype. It summarises NeuroPathway&apos;s
          intended governance and is not a substitute for a signed data-protection or
          safeguarding agreement.
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
