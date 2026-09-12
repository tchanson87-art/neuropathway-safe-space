import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { NpChild } from '@/lib/np/types'
import { Pill } from '@/components/np/ui'
import { ChildTabs } from './child-tabs'

export function ChildHeader({ child }: { child: NpChild }) {
  return (
    <div className="space-y-4">
      <Link
        href="/pro/children"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All children
      </Link>

      <div className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-bold text-primary">
          {child.preferred_name.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold">{child.preferred_name}</h1>
            {child.is_demo ? <Pill tone="sky">Demo</Pill> : null}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {[child.pronouns, child.age_band, child.year_group, child.education_setting]
              .filter(Boolean)
              .join(' · ') || 'Details not set'}
          </p>
        </div>
      </div>

      <ChildTabs childId={child.id} />
    </div>
  )
}
