import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * NeuroPathway Safe Space brand mark — the official circular logo.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-accent/40',
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src="/images/neuropathway-logo.jpeg"
        alt=""
        width={72}
        height={72}
        className="size-full object-cover"
        priority
      />
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
        <div className="font-display text-base font-bold tracking-tight">
          NeuroPathway
        </div>
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {showOrg ? 'Safe Space · Social Innovation CIC' : 'Safe Space'}
        </div>
      </div>
    </div>
  )
}
