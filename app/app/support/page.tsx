'use client'

import { useState } from 'react'
import {
  LifeBuoy,
  MessageCircle,
  AlertTriangle,
  Phone,
  Check,
  Clock,
  ExternalLink,
  Heart,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/safe-space/page-header'
import { SafetyBanner, SectionLabel } from '@/components/safe-space/primitives'
import { useData } from '@/components/providers/data-provider'
import {
  SUPPORT_REQUEST_LABELS,
  type SupportRequestType,
} from '@/lib/safe-space'
import { cn } from '@/lib/utils'

const REQUEST_OPTIONS: {
  type: SupportRequestType
  urgent?: boolean
}[] = [
  { type: 'talk' },
  { type: 'worried' },
  { type: 'worried-other' },
  { type: 'share-entry' },
  { type: 'not-safe', urgent: true },
  { type: 'help-now', urgent: true },
]

const CRISIS_LINES = [
  { name: 'Childline', detail: 'Free, private, any time', number: '0800 1111', href: 'tel:08001111' },
  { name: 'Samaritans', detail: 'Someone to talk to, any time', number: '116 123', href: 'tel:116123' },
  { name: 'Shout', detail: 'Text support, 24/7', number: 'Text SHOUT to 85258', href: 'sms:85258' },
  { name: 'Emergency', detail: 'If you or someone is in danger now', number: '999', href: 'tel:999' },
]

function timeString(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SupportPage() {
  const { safeCircle, supportRequests, addSupportRequest } = useData()
  const [selected, setSelected] = useState<SupportRequestType | null>(null)
  const [sentTo, setSentTo] = useState<string>('')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const isUrgent = selected === 'not-safe' || selected === 'help-now'

  function submit() {
    if (!selected) return
    const target = isUrgent ? 'safeguarding-route' : sentTo || safeCircle[0]?.id || 'safeguarding-route'
    addSupportRequest(selected, target, note || undefined)
    setSent(true)
    setSelected(null)
    setNote('')
    setSentTo('')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Get support"
        intro="Asking for help is a brave and sensible thing to do. Choose what feels right. A real person will always be the one who helps you."
        readAloudText="Get support. Asking for help is a brave and sensible thing to do. Choose what feels right. A real person will always be the one who helps you."
      />

      <div className="mb-6">
        <SafetyBanner>
          If you are in danger right now, or someone might hurt you, please tell a trusted
          adult straight away or call 999. This space is checked by real people, not
          robots, but it is not watched every second.
        </SafetyBanner>
      </div>

      {sent && (
        <Card className="mb-6 flex items-start gap-3 border-primary/30 bg-primary/8 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Check className="size-5" />
          </span>
          <div>
            <h2 className="font-display font-semibold">Your message is on its way</h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              A trusted adult will see this and get back to you. You do not have to do
              anything else right now. You are not in trouble.
            </p>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <SectionLabel>What do you need?</SectionLabel>
        <ul className="grid gap-3 sm:grid-cols-2">
          {REQUEST_OPTIONS.map((opt) => (
            <li key={opt.type}>
              <button
                onClick={() => {
                  setSelected(opt.type)
                  setSent(false)
                }}
                aria-pressed={selected === opt.type}
                className={cn(
                  'flex w-full min-h-16 items-center gap-3 rounded-2xl border-2 p-4 text-left font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  selected === opt.type
                    ? 'border-primary bg-primary/8'
                    : opt.urgent
                      ? 'border-accent/40 bg-accent/15 hover:border-accent/70'
                      : 'border-border hover:border-primary/40',
                )}
              >
                {opt.urgent ? (
                  <AlertTriangle className="size-5 shrink-0 text-accent-foreground" />
                ) : (
                  <MessageCircle className="size-5 shrink-0 text-primary" />
                )}
                <span className="text-sm leading-snug">{SUPPORT_REQUEST_LABELS[opt.type]}</span>
              </button>
            </li>
          ))}
        </ul>

        {selected && (
          <div className="mt-5 border-t border-border pt-5">
            {isUrgent ? (
              <div className="rounded-2xl border-2 border-accent/40 bg-accent/15 p-4">
                <p className="font-semibold text-accent-foreground">
                  This will go straight to the safeguarding lead.
                </p>
                <p className="mt-1 text-sm text-accent-foreground/90 leading-relaxed">
                  A trained adult will make sure you are okay. If you can, please also tell
                  someone near you right now.
                </p>
              </div>
            ) : (
              <>
                <SectionLabel>Who would you like to send this to?</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {safeCircle.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSentTo(m.id)}
                      aria-pressed={sentTo === m.id}
                      className={cn(
                        'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                        sentTo === m.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border text-muted-foreground hover:border-primary/40',
                      )}
                    >
                      {m.name} · {m.role}
                    </button>
                  ))}
                </div>
              </>
            )}

            <SectionLabel>
              <span className="mt-4 block">Add a message (optional)</span>
            </SectionLabel>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="You can say as much or as little as you like."
              className="w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-base leading-relaxed focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            />

            <button
              onClick={submit}
              className="mt-4 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-lg font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <LifeBuoy className="size-5" /> Send this
            </button>
          </div>
        )}
      </Card>

      {supportRequests.length > 0 && (
        <section className="mt-8" aria-label="Your recent requests">
          <h2 className="mb-3 font-display text-lg font-semibold">What happened next</h2>
          <ul className="space-y-3">
            {supportRequests.map((req) => {
              const person =
                req.sentTo === 'safeguarding-route'
                  ? 'Safeguarding lead'
                  : safeCircle.find((m) => m.id === req.sentTo)?.name ?? 'A trusted adult'
              return (
                <li key={req.id}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{SUPPORT_REQUEST_LABELS[req.type]}</p>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                          req.status === 'responded'
                            ? 'bg-mint/40 text-foreground'
                            : 'bg-primary/12 text-primary',
                        )}
                      >
                        {req.status === 'responded' ? 'Replied' : 'Received'}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      Sent to {person} · {timeString(req.createdAt)}
                    </p>
                    {req.nextSteps && (
                      <p className="mt-2 rounded-xl bg-secondary/40 p-3 text-sm text-secondary-foreground leading-relaxed">
                        {req.nextSteps}
                      </p>
                    )}
                  </Card>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className="mt-8" aria-label="Helplines">
        <h2 className="mb-1 font-display text-lg font-semibold">People who can help any time</h2>
        <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
          These are free and private. You can contact them yourself, whenever you need.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CRISIS_LINES.map((line) => (
            <li key={line.name}>
              <a
                href={line.href}
                className="flex h-full items-start gap-3 rounded-2xl border-2 border-border bg-card p-4 transition-colors hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <span className="block font-semibold">{line.name}</span>
                  <span className="block text-sm text-muted-foreground">{line.detail}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {line.number} <ExternalLink className="size-3.5" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <Heart className="size-4 text-primary" />
        Whatever you are feeling, you deserve support and understanding.
      </p>
    </div>
  )
}
