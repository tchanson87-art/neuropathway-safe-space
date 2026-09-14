'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LENS_ORDER, LENSES } from '@/lib/np/portals'

export function PortalTabs() {
  const pathname = usePathname()
  return (
    <nav aria-label="Professional portals" className="flex gap-1 overflow-x-auto border-b border-border">
      {LENS_ORDER.map((id) => {
        const lens = LENSES[id]
        const href = `/pro/portals/${id}`
        const active = pathname === href
        return (
          <Link
            key={id}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'min-h-11 whitespace-nowrap border-b-2 px-3 pb-2 text-sm font-semibold transition-colors',
              active
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {lens.shortLabel}
          </Link>
        )
      })}
    </nav>
  )
}
