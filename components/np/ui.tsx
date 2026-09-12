import type { ReactNode } from 'react'
import { Sparkles, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Marks content produced with AI assistance so it stays visually distinct from verified human evidence. */
export function AiTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-lavender/15 px-2 py-0.5 text-xs font-semibold text-foreground',
        className,
      )}
    >
      <Sparkles className="size-3 text-lavender" aria-hidden="true" />
      AI-assisted · needs human review
    </span>
  )
}

export function VerifiedTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mint/20 px-2 py-0.5 text-xs font-semibold text-foreground">
      <ShieldCheck className="size-3 text-mint" aria-hidden="true" />
      Verified by human
    </span>
  )
}

const CONFIDENCE_STYLE: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  moderate: 'bg-sun/25 text-foreground',
  high: 'bg-mint/25 text-foreground',
}

export function ConfidenceBadge({ level }: { level: string }) {
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold capitalize', CONFIDENCE_STYLE[level] ?? CONFIDENCE_STYLE.low)}>
      {level} confidence
    </span>
  )
}

const STATUS_STYLE: Record<string, string> = {
  awaiting_review: 'bg-sun/25 text-foreground',
  accepted: 'bg-mint/25 text-foreground',
  rejected: 'bg-muted text-muted-foreground',
  needs_evidence: 'bg-peach/25 text-foreground',
  amended: 'bg-sky/20 text-foreground',
  active: 'bg-mint/25 text-foreground',
  review_due: 'bg-sun/25 text-foreground',
  completed: 'bg-muted text-muted-foreground',
  stopped: 'bg-muted text-muted-foreground',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', STATUS_STYLE[status] ?? 'bg-muted text-muted-foreground')}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export function Pill({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'teal' | 'sky' }) {
  const tones = {
    muted: 'bg-muted text-muted-foreground',
    teal: 'bg-teal/15 text-foreground',
    sky: 'bg-sky/15 text-foreground',
  }
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', tones[tone])}>{children}</span>
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-3xl border border-border bg-card p-5 sm:p-6', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-balance">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed text-pretty">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background/60 px-4 py-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}

export function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateTime(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
