'use client'

import { useId, useState } from 'react'
import { Check, FileSearch, Loader2 } from 'lucide-react'

type RequestKind = 'access' | 'rectification' | 'erasure' | 'restriction'

const REQUEST_KINDS: { value: RequestKind; label: string; hint: string }[] = [
  { value: 'access', label: 'A copy of my information', hint: 'Subject Access Request' },
  { value: 'rectification', label: 'Correct something', hint: 'Rectification' },
  { value: 'erasure', label: 'Delete my information', hint: 'Erasure' },
  { value: 'restriction', label: 'Pause use of my information', hint: 'Restriction' },
]

// Builds a human-friendly, non-identifying reference so a person can quote their
// request. This is a prototype: nothing is sent to a server.
function makeReference() {
  const now = new Date()
  const y = now.getFullYear()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `SAR-${y}-${rand}`
}

export function SarRequestForm() {
  const formId = useId()
  const [kind, setKind] = useState<RequestKind>('access')
  const [onBehalf, setOnBehalf] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState<string | null>(null)

  const canSubmit = name.trim().length > 1 && email.trim().includes('@') && !submitting

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    // Simulated acknowledgement — the prototype does not transmit personal data.
    window.setTimeout(() => {
      setReference(makeReference())
      setSubmitting(false)
    }, 700)
  }

  if (reference) {
    return (
      <section
        aria-live="polite"
        className="mt-8 rounded-3xl border-2 border-primary/40 bg-primary/5 p-6"
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Check className="size-6" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-balance">
          Request received
        </h2>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
          Thank you. We will acknowledge your request and respond within one calendar
          month. Please keep your reference safe so you can quote it if you contact us.
        </p>
        <p className="mt-4 text-sm font-semibold">Your reference</p>
        <p className="font-mono text-lg font-bold tracking-wide text-primary">
          {reference}
        </p>
        <p className="mt-4 rounded-2xl border-2 border-accent/50 bg-accent/20 p-4 text-sm leading-relaxed text-accent-foreground">
          This is a demonstration prototype. No personal information was sent or stored.
          For a real request, email tanja.socialinnovationcic@zohomail.eu.
        </p>
      </section>
    )
  }

  return (
    <section className="mt-8 rounded-3xl border-2 border-border bg-card p-6">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <FileSearch className="size-6" />
      </span>
      <h2 className="mt-4 font-display text-xl font-bold text-balance">
        Make a request
      </h2>
      <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
        Tell us what you would like to do. You do not have to give a reason to ask for a
        copy of your own information.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <fieldset>
          <legend className="text-sm font-semibold">What would you like to do?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {REQUEST_KINDS.map((k) => {
              const active = kind === k.value
              return (
                <button
                  key={k.value}
                  type="button"
                  onClick={() => setKind(k.value)}
                  aria-pressed={active}
                  className={
                    active
                      ? 'flex min-h-14 flex-col items-start justify-center rounded-2xl border-2 border-primary bg-primary/10 px-4 py-2 text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
                      : 'flex min-h-14 flex-col items-start justify-center rounded-2xl border-2 border-border bg-background px-4 py-2 text-left transition-colors hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
                  }
                >
                  <span className="text-sm font-semibold">{k.label}</span>
                  <span className="text-xs text-muted-foreground">{k.hint}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="flex min-h-11 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={onBehalf}
            onChange={(e) => setOnBehalf(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 rounded border-2 border-border accent-primary"
          />
          <span className="text-sm leading-relaxed text-pretty">
            I am making this request on behalf of a child in my care.
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-name`} className="text-sm font-semibold">
              {onBehalf ? 'Your name' : 'Full name'}
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              className="mt-2 min-h-12 w-full rounded-xl border-2 border-border bg-background px-3 text-base focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            />
          </div>
          <div>
            <label htmlFor={`${formId}-email`} className="text-sm font-semibold">
              Email for our reply
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              required
              className="mt-2 min-h-12 w-full rounded-xl border-2 border-border bg-background px-3 text-base focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-details`} className="text-sm font-semibold">
            Anything that helps us find your information{' '}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id={`${formId}-details`}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="mt-2 w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-base leading-relaxed focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50 sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending
            </>
          ) : (
            'Send request'
          )}
        </button>
      </form>
    </section>
  )
}
