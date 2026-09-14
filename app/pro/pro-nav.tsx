'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, ClipboardList, ShieldAlert, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/pro', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/pro/children', label: 'Children', icon: Users, exact: false },
  { href: '/pro/portals', label: 'Portals', icon: ClipboardList, exact: false },
  { href: '/pro/safeguarding', label: 'Safeguarding', icon: ShieldAlert, exact: false },
  { href: '/pro/pilot', label: 'Pilot', icon: BarChart3, exact: false },
]

export function ProNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Professional sections" className="flex gap-1 overflow-x-auto">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href)
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <l.icon className="size-4" aria-hidden="true" />
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
