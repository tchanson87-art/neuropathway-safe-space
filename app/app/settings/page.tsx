'use client'

import {
  Sun,
  Moon,
  Waves,
  Type,
  Zap,
  Volume2,
  Baby,
  User,
  ShieldCheck,
  History,
  Eye,
  LogOut,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/safe-space/page-header'
import { SectionLabel } from '@/components/safe-space/primitives'
import { useSettings, type TextSize } from '@/components/providers/settings-provider'
import { useData } from '@/components/providers/data-provider'
import { cn } from '@/lib/utils'

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        checked ? 'bg-primary' : 'bg-muted',
      )}
    >
      <span
        className={cn(
          'inline-block size-5 rounded-full bg-card shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}

function Row({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const s = useSettings()
  const { patternFlags, audit, signOut } = useData()

  const textSizes: { value: TextSize; label: string }[] = [
    { value: 'base', label: 'Normal' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Largest' },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Settings"
        intro="Make Safe Space feel right for you. Nothing here changes what you have written; it only changes how things look and feel."
        readAloudText="Settings. Make Safe Space feel right for you. Nothing here changes what you have written; it only changes how things look and feel."
      />

      <Card className="mb-6 divide-y divide-border p-5">
        <div className="pb-4">
          <SectionLabel>Look and feel</SectionLabel>
        </div>
        <Row icon={s.theme === 'dark' ? Moon : Sun} title="Theme" desc="Light or dark colours">
          <div className="flex rounded-full border-2 border-border p-1">
            <button
              onClick={() => s.setTheme('light')}
              aria-pressed={s.theme === 'light'}
              className={cn(
                'min-h-9 rounded-full px-3 text-sm font-semibold',
                s.theme === 'light' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
              )}
            >
              Light
            </button>
            <button
              onClick={() => s.setTheme('dark')}
              aria-pressed={s.theme === 'dark'}
              className={cn(
                'min-h-9 rounded-full px-3 text-sm font-semibold',
                s.theme === 'dark' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
              )}
            >
              Dark
            </button>
          </div>
        </Row>
        <Row
          icon={Waves}
          title="Low-stimulation mode"
          desc="Softer colours and fewer distractions"
        >
          <Toggle checked={s.lowStim} onChange={s.setLowStim} label="Low-stimulation mode" />
        </Row>
        <Row icon={Type} title="Text size" desc="Make words bigger and easier to read">
          <div className="flex rounded-full border-2 border-border p-1">
            {textSizes.map((t) => (
              <button
                key={t.value}
                onClick={() => s.setTextSize(t.value)}
                aria-pressed={s.textSize === t.value}
                className={cn(
                  'min-h-9 rounded-full px-3 text-sm font-semibold',
                  s.textSize === t.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Row>
        <Row icon={Zap} title="Reduce movement" desc="Turn off gentle animations">
          <Toggle checked={s.reduceMotion} onChange={s.setReduceMotion} label="Reduce movement" />
        </Row>
        <Row icon={Volume2} title="Read aloud" desc="Show buttons that read text to you">
          <Toggle checked={s.tts} onChange={s.setTts} label="Read aloud" />
        </Row>
      </Card>

      <Card className="mb-6 p-5">
        <SectionLabel>How Safe Space talks to me</SectionLabel>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          Choose the version that feels right. It changes the words and pictures, not what
          you can do.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => s.setAgeMode('younger')}
            aria-pressed={s.ageMode === 'younger'}
            className={cn(
              'flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
              s.ageMode === 'younger' ? 'border-primary bg-primary/8' : 'border-border',
            )}
          >
            <Baby className="size-6 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold">Ages 8&ndash;12</span>
              <span className="text-sm text-muted-foreground">Warmer, simpler wording</span>
            </span>
          </button>
          <button
            onClick={() => s.setAgeMode('teen')}
            aria-pressed={s.ageMode === 'teen'}
            className={cn(
              'flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
              s.ageMode === 'teen' ? 'border-primary bg-primary/8' : 'border-border',
            )}
          >
            <User className="size-6 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold">Ages 13&ndash;17</span>
              <span className="text-sm text-muted-foreground">More grown-up tone</span>
            </span>
          </button>
        </div>
      </Card>

      <Card className="mb-6 p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <h2 className="font-display font-semibold">Who has looked at my things</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          You can always see when a trusted adult has viewed something you shared. Nothing
          is decided by a computer, and nothing you wrote is ever changed.
        </p>

        {patternFlags.length > 0 && (
          <div className="mt-4 rounded-2xl border-2 border-border bg-secondary/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Noticed by Safe Space, waiting for a person to review
            </p>
            {patternFlags.map((flag) => (
              <div key={flag.id} className="mt-2">
                <p className="text-sm leading-relaxed">{flag.summary}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on: {flag.basis}
                </p>
                <span className="mt-2 inline-block rounded-full bg-accent/25 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  A trusted adult will review this
                </span>
              </div>
            ))}
          </div>
        )}

        <ul className="mt-4 space-y-3">
          {audit.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {entry.action.toLowerCase().includes('view') ? (
                  <Eye className="size-4" />
                ) : (
                  <History className="size-4" />
                )}
              </span>
              <div>
                <p className="text-sm font-medium">{entry.actor}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.action}. {entry.detail}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.at).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <button
        onClick={() => {
          signOut()
          router.push('/')
        }}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-border font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <LogOut className="size-5" /> Sign out
      </button>

      <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed text-pretty">
        This is a demonstration prototype. All names and entries are fictional. Safe Space
        supports understanding and early help; it does not diagnose.
      </p>
    </div>
  )
}
