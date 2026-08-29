'use client'

import { LifeBuoy } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Always-available "I need support" action. Human-led route — never claims to
 * be monitored and never triggers an automated safeguarding decision.
 */
export function NeedSupportButton() {
  const pathname = usePathname()
  if (pathname?.startsWith('/app/support')) return null
  return (
    <Link
      href="/app/support"
      className="fixed right-4 bottom-24 z-40 inline-flex min-h-14 items-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-accent-foreground shadow-lg ring-1 ring-accent-foreground/10 transition-transform hover:scale-[1.03] focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none md:bottom-6"
    >
      <LifeBuoy className="size-5" />
      I need support
    </Link>
  )
}
