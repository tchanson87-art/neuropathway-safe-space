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
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, type ComponentType } from 'react'
import { Wordmark } from '@/components/safe-space/logo'
import { NeedSupportButton } from '@/components/safe-space/need-support-button'
import { useData } from '@/components/providers/data-provider'
import { useSettings } from '@/components/providers/settings-provider'
import { cn } from '@/lib/utils'

type NavItem = { href: string; label: string; icon: ComponentType<{ className?: string }> }

const PRIMARY: NavItem[] = [
  { href: '/app', label: 'Home', icon: Home },
  { href: '/app/check-in', label: 'Check-In', icon: HeartHandshake },
  { href: '/app/journal', label: 'Journal', icon: NotebookPen },
  { href: '/app/goals', label: 'Goals', icon: Target },
  { href: '/app/safe-circle', label: 'Safe Circle', icon: Users },
]

const SECONDARY: NavItem[] = [
  { href: '/app/what-helps-me', label: 'What Helps Me', icon: Sparkles },
  { href: '/app/calm', label: 'Calming toolbox', icon: Wind },
  { href: '/app/settings', label: 'Settings', icon: Settings },
]

const ALL = [...PRIMARY, ...SECONDARY]

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
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar p-4 md:flex">
        <Link href="/app" className="mb-6 rounded-2xl p-1">
          <Wordmark showOrg />
        </Link>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
          {PRIMARY.map((item) => (
            <NavLink key={item.href} item={item} active={!!isActive(pathname, item.href)} />
          ))}
          <div className="my-3 h-px bg-sidebar-border" />
          {SECONDARY.map((item) => (
            <NavLink key={item.href} item={item} active={!!isActive(pathname, item.href)} />
          ))}
        </nav>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            {theme === 'dark' ? 'Light theme' : 'Dark theme'}
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <LogOut className="size-5" />
            Exit safely
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/app">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-x-0 top-0 rounded-b-3xl bg-card p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Wordmark showOrg />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-6" />
              </button>
            </div>
            <nav className="grid grid-cols-2 gap-2" aria-label="All areas">
              {ALL.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex min-h-14 items-center gap-3 rounded-2xl border border-border px-3 text-sm font-semibold',
                    isActive(pathname, item.href)
                      ? 'bg-primary/10 text-foreground'
                      : 'bg-card text-muted-foreground',
                  )}
                >
                  <item.icon className="size-5 text-primary" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={handleExit}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-muted text-sm font-bold text-foreground"
            >
              <LogOut className="size-5" />
              Exit safely
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-32 md:ml-64 md:max-w-3xl md:px-8 md:pb-16">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Primary"
      >
        {PRIMARY.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-h-16 flex-1 flex-col items-center justify-center gap-1 py-2 text-[0.68rem] font-semibold',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <item.icon className="size-6" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <NeedSupportButton />
    </div>
  )
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'inline-flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors',
        active
          ? 'bg-primary/12 text-foreground'
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
      )}
    >
      <item.icon className={cn('size-5', active && 'text-primary')} />
      {item.label}
    </Link>
  )
}
