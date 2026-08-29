'use client'

import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, KeyRound, QrCode, Check, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Wordmark } from '@/components/safe-space/logo'
import { useData } from '@/components/providers/data-provider'
import { DEMO_ACCESS_CODE } from '@/lib/safe-space'
import { cn } from '@/lib/utils'

function normalise(v: string) {
  return v.trim().toUpperCase().replace(/\s+/g, '')
}

export default function EnterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-background">
          <Wordmark />
        </div>
      }
    >
      <EnterContent />
    </Suspense>
  )
}

function EnterContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { signIn, signedIn } = useData()

  const [tab, setTab] = useState<'code' | 'qr'>('code')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // If arriving via a scanned QR link (?code=...), prefill.
  useEffect(() => {
    const c = params.get('code')
    if (c) {
      setCode(normalise(c))
      setTab('code')
    }
  }, [params])

  useEffect(() => {
    if (signedIn) router.replace('/app')
  }, [signedIn, router])

  // The QR encodes a deep link back to this screen carrying the demo code —
  // a school or carer would print/share this so a child can scan to sign in.
  const qrValue = useMemo(() => {
    if (typeof window === 'undefined') return `/enter?code=${DEMO_ACCESS_CODE}`
    return `${window.location.origin}/enter?code=${DEMO_ACCESS_CODE}`
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (normalise(code) !== DEMO_ACCESS_CODE) {
      setError('That code did not match. Please check it and try again.')
      return
    }
    setLoading(true)
    // Simulated secure verification for the prototype.
    setTimeout(() => {
      signIn()
      router.push('/app')
    }, 550)
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
            Welcome back
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty leading-relaxed">
            Sign in with the access code your school or carer gave you, or scan your Safe
            Space QR code.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5">
          <button
            type="button"
            onClick={() => setTab('code')}
            className={cn(
              'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors',
              tab === 'code'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground',
            )}
          >
            <KeyRound className="size-4" />
            Access code
          </button>
          <button
            type="button"
            onClick={() => setTab('qr')}
            className={cn(
              'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors',
              tab === 'qr'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground',
            )}
          >
            <QrCode className="size-4" />
            QR code
          </button>
        </div>

        {tab === 'code' ? (
          <form onSubmit={submit} className="mt-6">
            <label htmlFor="access-code" className="mb-2 block text-sm font-semibold">
              Your access code
            </label>
            <input
              id="access-code"
              inputMode="text"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                setError(null)
              }}
              placeholder="SAFE-0000"
              aria-invalid={!!error}
              aria-describedby={error ? 'code-error' : 'code-hint'}
              className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-center font-display text-xl font-bold tracking-widest text-foreground placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            />
            {error ? (
              <p id="code-error" className="mt-2 text-sm font-medium text-destructive">
                {error}
              </p>
            ) : (
              <p id="code-hint" className="mt-2 text-sm text-muted-foreground">
                Demo code for this prototype:{' '}
                <button
                  type="button"
                  onClick={() => setCode(DEMO_ACCESS_CODE)}
                  className="font-bold text-primary underline-offset-2 hover:underline"
                >
                  {DEMO_ACCESS_CODE}
                </button>
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              {loading ? 'Signing you in…' : 'Enter Safe Space'}
              {!loading && <Check className="size-5" />}
            </button>
          </form>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <div className="rounded-3xl border-2 border-border bg-white p-5">
              <QRCodeSVG
                value={qrValue}
                size={196}
                level="M"
                marginSize={0}
                title="Safe Space sign-in QR code"
              />
            </div>
            <p className="mt-4 max-w-xs text-center text-sm text-muted-foreground text-pretty leading-relaxed">
              A school or carer can print or share this QR code. Scanning it opens Safe
              Space with the access code filled in.
            </p>
            <button
              type="button"
              onClick={() => {
                setCode(DEMO_ACCESS_CODE)
                setTab('code')
              }}
              className="mt-5 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Use this code
              <ArrowLeft className="size-5 rotate-180" />
            </button>
          </div>
        )}

        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-secondary/50 p-4 text-sm leading-relaxed">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-secondary-foreground">
            Codes are issued by trusted adults. In the full service, access uses secure
            authentication with session time-outs. This prototype uses fictional data only.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          First time here?{' '}
          <Link href="/onboarding" className="font-bold text-primary underline-offset-2 hover:underline">
            Take the quick tour
          </Link>
        </p>
      </main>
    </div>
  )
}
