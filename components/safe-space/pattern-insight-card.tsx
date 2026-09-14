'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ShieldAlert, Loader2, Heart, Lightbulb, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useData } from '@/components/providers/data-provider'

type Insight = {
  safetyAlert: boolean
  summary: string
  strengths: string[]
  observedNeeds: string[]
  patterns: string[]
  gentleSuggestion: string
  evidenceStrength: 'Low' | 'Moderate' | 'High'
}

type ApiResult =
  | Insight
  | { insufficient: true; message: string }
  | { error: string }

export function PatternInsightCard() {
  const { raiseWellbeingAlert } = useData()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [notifiedAdult, setNotifiedAdult] = useState<string | null>(null)

  async function run() {
    setLoading(true)
    setResult(null)
    setNotifiedAdult(null)
    try {
      const res = await fetch('/api/pattern-insight', { method: 'POST' })
      const data = (await res.json()) as ApiResult
      setResult(data)
      // Route a flagged wellbeing signal to the child's trusted adult in their Safe Circle.
      if (data && !('insufficient' in data) && !('error' in data) && data.safetyAlert) {
        const adult = raiseWellbeingAlert()
        setNotifiedAdult(adult ? adult.name.split(' ')[0] : null)
      }
    } catch {
      setResult({ error: 'Something went wrong. Please try again in a moment.' })
    } finally {
      setLoading(false)
    }
  }

  const insight =
    result && !('insufficient' in result) && !('error' in result) ? result : null

  return (
    <Card
      className="rounded-[1.6rem] border-2 p-6"
      style={{
        backgroundColor: 'color-mix(in oklab, var(--lavender) 14%, var(--card))',
        borderColor: 'color-mix(in oklab, var(--lavender) 34%, var(--card))',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className="sticker flex size-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'color-mix(in oklab, var(--lavender) 58%, var(--card))' }}
          >
            <Sparkles className="size-5 text-foreground" strokeWidth={2.2} />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold">Gentle reflection</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground leading-relaxed">
              When you&apos;re ready, I can quietly look over your own check-ins and journal
              and reflect back what I notice. Nothing is shared — this is just for you.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-70 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {loading ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
        {loading ? 'Looking gently…' : result ? 'Reflect again' : 'Reflect on my week'}
      </button>

      {result && 'insufficient' in result && (
        <p className="mt-4 rounded-2xl bg-secondary/50 p-4 text-sm leading-relaxed text-secondary-foreground">
          {result.message}
        </p>
      )}

      {result && 'error' in result && (
        <p role="alert" className="mt-4 text-sm font-medium text-destructive">
          {result.error}
        </p>
      )}

      {insight && (
        <div className="mt-5 space-y-4">
          {insight.safetyAlert && (
            <div className="flex items-start gap-3 rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-4">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div>
                <p className="font-bold text-destructive">Please tell a trusted adult</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">
                  Some of what you wrote sounds really hard. You deserve support right now —
                  please reach out to someone in your Safe Circle, or an adult you trust, as
                  soon as you can.
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
                  {notifiedAdult
                    ? `We've gently let ${notifiedAdult} know you might need a check-in, so someone you trust can be there for you. You are not on your own with this.`
                    : 'A gentle check-in has been logged so a trusted adult can be there for you. You are not on your own with this.'}
                </p>
                <Link
                  href="/app/support"
                  className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  Reach my Safe Circle now
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}

          <p className="leading-relaxed text-pretty">{insight.summary}</p>

          {insight.strengths.length > 0 && (
            <div>
              <p className="flex items-center gap-2 text-sm font-bold">
                <Heart className="size-4 text-primary" /> What&apos;s going well
              </p>
              <ul className="mt-2 space-y-1.5">
                {insight.strengths.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insight.observedNeeds.length > 0 && (
            <div>
              <p className="text-sm font-bold">What you might need</p>
              <ul className="mt-2 space-y-1.5">
                {insight.observedNeeds.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insight.patterns.length > 0 && (
            <div>
              <p className="text-sm font-bold">Things I noticed</p>
              <ul className="mt-2 space-y-1.5">
                {insight.patterns.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-2xl bg-secondary/50 p-4">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-secondary-foreground">
              {insight.gentleSuggestion}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Evidence strength: {insight.evidenceStrength}. This is a gentle reflection, not a
            diagnosis. Only a qualified professional can diagnose.
          </p>
        </div>
      )}
    </Card>
  )
}
