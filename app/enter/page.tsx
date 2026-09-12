'use client'

import { ArrowLeft, LogIn, UserPlus, Check, ShieldCheck, MailCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Wordmark } from '@/components/safe-space/logo'
import { useData } from '@/components/providers/data-provider'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type Mode = 'signin' | 'signup'

export default function EnterPage() {
  const router = useRouter()
  const { signedIn, sessionReady } = useData()

  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  useEffect(() => {
    if (sessionReady && signedIn) router.replace('/app')
  }, [signedIn, sessionReady, router])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
              `${window.location.origin}/auth/callback`,
            data: { display_name: name.trim() || null },
          },
        })
        if (error) {
          setError(error.message)
          return
        }
        // If email confirmation is required there is no session yet.
        if (!data.session) {
          setCheckEmail(true)
          return
        }
        router.replace('/app')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) {
          setError(
            /confirm/i.test(error.message)
              ? 'Please confirm your email address first — check your inbox for the link.'
              : 'That email or password did not match. Please try again.',
          )
          return
        }
        router.replace('/app')
      }
    } finally {
      setLoading(false)
    }
  }

  if (checkEmail) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <header className="mx-auto flex w-full max-w-md items-center justify-between px-5 py-4">
          <Wordmark />
        </header>
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-10 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-secondary">
            <MailCheck className="size-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-balance">Check your email</h1>
          <p className="mt-2 text-muted-foreground text-pretty leading-relaxed">
            We&apos;ve sent a confirmation link to{' '}
            <span className="font-semibold text-foreground">{email}</span>. Open it to
            finish setting up your Safe Space, then come back and sign in.
          </p>
          <button
            type="button"
            onClick={() => {
              setCheckEmail(false)
              setMode('signin')
            }}
            className="mt-6 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground"
          >
            Back to sign in
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-5 py-4">
        <Wordmark />
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full pr-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-10">
        <div className="text-center">
          <div className="mx-auto mb-5 flex size-24 items-center justify-center overflow-hidden rounded-full border border-accent/30 bg-[#0f1a3a] p-1.5 shadow-md">
            <Image
              src="/images/neuropathway-logo.jpeg"
              alt="NeuroPathway Safe Space logo"
              width={192}
              height={192}
              priority
              className="size-full rounded-full object-cover"
            />
          </div>
          <h1 className="font-display text-2xl font-bold text-balance sm:text-3xl">
            {mode === 'signin' ? 'Welcome back' : 'Create your Safe Space'}
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty leading-relaxed">
            {mode === 'signin'
              ? 'Sign in with your email and password to open your Safe Space.'
              : 'Set up a private account. Only you and the trusted adults you choose can see what you share.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError(null)
            }}
            className={cn(
              'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors',
              mode === 'signin' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
            )}
          >
            <LogIn className="size-4" />
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError(null)
            }}
            className={cn(
              'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors',
              mode === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
            )}
          >
            <UserPlus className="size-4" />
            Create account
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                What should we call you?
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name or nickname"
                className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              placeholder="you@example.com"
              className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
              className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-70"
          >
            {loading
              ? mode === 'signin'
                ? 'Signing you in…'
                : 'Creating your account…'
              : mode === 'signin'
                ? 'Enter Safe Space'
                : 'Create account'}
            {!loading && <Check className="size-5" />}
          </button>
        </form>

        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-secondary/50 p-4 text-sm leading-relaxed">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-secondary-foreground">
            Your account is protected with secure authentication. Everything you write
            stays private unless you choose to share it with a trusted adult.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          First time here?{' '}
          <Link
            href="/onboarding"
            className="font-bold text-primary underline-offset-2 hover:underline"
          >
            Take the quick tour
          </Link>
        </p>
      </main>
    </div>
  )
}
