'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppShell } from '@/components/safe-space/app-shell'
import { useData } from '@/components/providers/data-provider'

export default function AppAreaLayout({ children }: { children: React.ReactNode }) {
  const { signedIn } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!signedIn) router.replace('/enter')
  }, [signedIn, router])

  if (!signedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6 text-center">
        <p className="text-sm text-muted-foreground">Taking you to the sign-in screen…</p>
      </div>
    )
  }

  return <AppShell>{children}</AppShell>
}
