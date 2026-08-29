import { cn } from '@/lib/utils'

/**
 * Safe Space brand mark: two overlapping rounded forms suggesting a sheltering
 * nest / cupped hands around a small centre. Deliberately abstract — no puzzle
 * pieces, no medical or cartoon imagery.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-2xl bg-primary/12 text-primary',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-6">
        <path
          d="M12 20.5c-1.4-3-4.2-4.1-6-6.1C3.8 12 3.6 8.4 6 6.6c1.9-1.4 4.3-.7 6 1.2 1.7-1.9 4.1-2.6 6-1.2 2.4 1.8 2.2 5.4 0 7.8-1.8 2-4.6 3.1-6 6.1Z"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="12" cy="11.2" r="2.1" className="fill-card" />
      </svg>
    </span>
  )
}

export function Wordmark({
  className,
  showOrg = false,
}: {
  className?: string
  showOrg?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Logo />
      <div className="leading-tight">
        <div className="font-display text-base font-bold tracking-tight">Safe Space</div>
        <div className="text-[0.7rem] font-medium text-muted-foreground">
          {showOrg ? 'NeuroPathway · Social Innovation CIC' : 'NeuroPathway'}
        </div>
      </div>
    </div>
  )
}
