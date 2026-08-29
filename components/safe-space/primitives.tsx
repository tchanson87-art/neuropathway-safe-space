'use client'

import { Lock, Users, Check, ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Sharing } from '@/lib/safe-space'
import { cn } from '@/lib/utils'

export function SharingBadge({
  sharing,
  className,
}: {
  sharing: Sharing
  className?: string
}) {
  const isPrivate = sharing === 'private'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        isPrivate
          ? 'bg-muted text-muted-foreground'
          : 'bg-primary/12 text-primary',
        className,
      )}
    >
      {isPrivate ? <Lock className="size-3.5" /> : <Users className="size-3.5" />}
      {isPrivate ? 'Only me' : 'Shared'}
    </span>
  )
}

export function ChoiceChip({
  selected,
  onToggle,
  children,
  tokenColor,
  className,
}: {
  selected: boolean
  onToggle: () => void
  children: ReactNode
  tokenColor?: string
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        selected
          ? 'border-primary bg-primary/10 text-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
        className,
      )}
    >
      {tokenColor && (
        <span
          className="size-3 rounded-full"
          style={{ backgroundColor: `var(--${tokenColor})` }}
          aria-hidden="true"
        />
      )}
      {children}
      {selected && <Check className="size-4 text-primary" />}
    </button>
  )
}

export function IntensityScale({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const labels = ['A little', 'Some', 'Medium', 'A lot', 'Really strong']
  return (
    <div>
      <div className="flex items-end gap-2" role="group" aria-label="How strong is the feeling">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            aria-label={`${labels[n - 1]} (${n} of 5)`}
            onClick={() => onChange(n)}
            className={cn(
              'flex-1 rounded-xl border-2 transition-all focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
              value >= n
                ? 'border-primary/40 bg-primary/70'
                : 'border-border bg-muted hover:bg-muted/70',
            )}
            style={{ height: `${28 + n * 12}px` }}
          />
        ))}
      </div>
      <p className="mt-2 text-sm font-medium text-muted-foreground">
        {value ? labels[value - 1] : 'Tap to show how strong it feels'}
      </p>
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-7" />
      </span>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function PrivacyNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-secondary/50 p-4 text-sm leading-relaxed">
      <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
      <p className="text-secondary-foreground">{children}</p>
    </div>
  )
}

export function SafetyBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border-2 border-accent/50 bg-accent/25 p-4 text-sm leading-relaxed">
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
      <p className="text-accent-foreground">{children}</p>
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  )
}
