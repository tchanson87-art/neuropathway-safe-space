'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppShell } from '@/components/safe-space/app-shell'
import { useData } from '@/components/providers/data-provider'

export default function AppAreaLayout({ children }: { children: React.ReactNode }) {
  const { signedIn, sessionReady } = useData()
  const router = useRouter()

  useEffect(() => {
    if (sessionReady && !signedIn) router.replace('/enter')
  }, [signedIn, sessionReady, router])

  if (!signedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6 text-center">
        <p className="text-sm text-muted-foreground">Taking you to the sign-in screen…</p>
      </div>
    )
  }

  return <AppShell>{children}</AppShell>
}
