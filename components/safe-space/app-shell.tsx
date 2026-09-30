'use client'

import {
  Home,
  HeartHandshake,
  NotebookPen,
  Target,
  Sparkles,
  Users,
  Wind,
  Settings,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, type ComponentType } from 'react'
import { SafeSpaceWordmark } from '@/components/safe-space/logo'
import { NeedSupportButton } from '@/components/safe-space/need-support-button'
import { useData } from '@/components/providers/data-provider'
import { useSettings } from '@/components/providers/settings-provider'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  short: string
  icon: ComponentType<{ className?: string }>
}

const NAV: NavItem[] = [
  { href: '/app', label: 'My space', short: 'Home', icon: Home },
  { href: '/app/check-in', label: 'How I feel', short: 'Feel', icon: HeartHandshake },
  { href: '/app/journal', label: 'My journal', short: 'Journal', icon: NotebookPen },
  { href: '/app/goals', label: 'My goals', short: 'Goals', icon: Target },
  { href: '/app/toolbox', label: 'My calm toolkit', short: 'Calm', icon: Wind },
  { href: '/app/what-helps-me', label: 'What helps me', short: 'Helps', icon: Sparkles },
  { href: '/app/safe-circle', label: 'My safe circle', short: 'Circle', icon: Users },
  { href: '/app/support', label: 'Get support', short: 'Support', icon: LifeBuoy },
  { href: '/app/settings', label: 'Your privacy', short: 'Privacy', icon: Settings },
]

const BOTTOM_NAV = NAV.slice(0, 5)

function isActive(pathname: string | null, href: string) {
  if (href === '/app') return pathname === '/app'
  return pathname?.startsWith(href)
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useData()
  const { theme, toggleTheme } = useSettings()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleExit() {
    signOut()
    router.push('/')
  }

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto bg-sidebar p-6 text-sidebar-foreground md:flex">
        <Link href="/app" className="mb-8 rounded-xl">
          <SafeSpaceWordmark />
        </Link>
        <nav className="flex flex-1 flex-col gap-1.5" aria-label="Main">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} active={!!isActive(pathname, item.href)} />
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-4">
          <p className="font-display text-lg leading-snug text-sidebar-primary">
            Your voice.
            <br />
            Your pace.
            <br />
            Your space.
          </p>
          <p className="text-xs leading-relaxed opacity-70">
            Supported by
            <br />
            Social Innovation CIC
          </p>
          <div className="flex flex-col gap-1 border-t border-sidebar-border pt-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm opacity-80 transition hover:bg-sidebar-accent hover:opacity-100"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {theme === 'dark' ? 'Light theme' : 'Dark theme'}
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="inline-flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm opacity-80 transition hover:bg-sidebar-accent hover:opacity-100"
            >
              <LogOut className="size-4" />
              Exit safely
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop top bar */}
      <header className="sticky top-0 z-20 hidden items-center justify-between border-b border-border bg-card/95 px-10 py-5 backdrop-blur md:ml-64 md:flex">
        <p className="text-sm text-muted-foreground">A little space for you</p>
        <div className="flex items-center gap-3">
          <Link
            href="/app/settings"
            className="inline-flex min-h-11 items-center rounded-lg border border-border bg-card px-4 text-sm transition hover:bg-muted"
          >
            Privacy &amp; settings
          </Link>
          <Link
            href="/app/support"
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm text-primary-foreground transition hover:opacity-90"
          >
            I need help
          </Link>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
        <Link href="/app">
          <SafeSpaceWordmark />
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-sidebar-accent"
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-sidebar-accent"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 overflow-y-auto bg-sidebar p-5 text-sidebar-foreground shadow-xl">
            <div className="flex items-center justify-between">
              <SafeSpaceWordmark />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-sidebar-accent"
              >
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1.5" aria-label="All areas">
              {NAV.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={!!isActive(pathname, item.href)}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </nav>
            <p className="font-display text-lg leading-snug text-sidebar-primary">
              Your voice. Your pace. Your space.
            </p>
            <button
              type="button"
              onClick={handleExit}
              className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-sidebar-accent text-sm"
            >
              <LogOut className="size-5" />
              Exit safely
            </button>
          </div>
        </div>
      )}

      <main className="px-4 pt-6 pb-32 md:ml-64 md:px-10 md:pt-8 md:pb-16">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-sidebar-border bg-sidebar pb-[env(safe-area-inset-bottom)] text-sidebar-foreground md:hidden"
        aria-label="Primary"
      >
        {BOTTOM_NAV.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-16 flex-1 flex-col items-center justify-center gap-1 py-2 text-xs',
                active ? 'text-sidebar-primary' : 'opacity-75',
              )}
            >
              <item.icon className="size-5" />
              {item.short}
            </Link>
          )
        })}
      </nav>

      <div className="md:hidden">
        <NeedSupportButton />
      </div>
    </div>
  )
}

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex min-h-12 items-center gap-3 rounded-lg border-l-2 px-4 text-sm transition-colors',
        active
          ? 'border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground'
          : 'border-transparent opacity-85 hover:bg-sidebar-accent/60 hover:opacity-100',
      )}
    >
      <item.icon className={cn('size-4 shrink-0', active && 'text-sidebar-primary')} />
      {item.label}
    </Link>
  )
}
