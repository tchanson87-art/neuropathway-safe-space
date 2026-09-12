'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function ChildTabs({ childId }: { childId: string }) {
  const pathname = usePathname()
  const base = `/pro/children/${childId}`
  const tabs = [
    { href: base, label: 'Overview', exact: true },
    { href: `${base}/observations`, label: 'Observations' },
    { href: `${base}/evidence`, label: 'Evidence' },
    { href: `${base}/patterns`, label: 'Patterns' },
    { href: `${base}/plans`, label: 'Support' },
    { href: `${base}/ehcp`, label: 'EHCP draft' },
  ]
  return (
    <nav aria-label="Child record sections" className="flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((t) => {
        const active = t.exact ? pathname === t.href : pathname.startsWith(t.href)
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'min-h-11 whitespace-nowrap border-b-2 px-3 pb-2 text-sm font-semibold transition-colors',
              active
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}
