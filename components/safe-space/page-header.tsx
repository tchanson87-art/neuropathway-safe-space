'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { ReadAloud } from '@/components/safe-space/read-aloud'

export function PageHeader({
  title,
  intro,
  readAloudText,
  action,
}: {
  title: string
  intro?: string
  readAloudText?: string
  action?: ReactNode
}) {
  const router = useRouter()
  return (
    <header className="mb-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-full pr-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-balance sm:text-3xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-1.5 max-w-xl text-muted-foreground text-pretty leading-relaxed">
              {intro}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {readAloudText && <ReadAloud text={readAloudText} />}
          {action}
        </div>
      </div>
    </header>
  )
}
