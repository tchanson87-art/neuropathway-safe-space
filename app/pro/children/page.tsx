import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { listChildren } from '@/lib/np/data'
import { EmptyState, Pill } from '@/components/np/ui'

export default async function ChildrenPage() {
  const children = await listChildren()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-balance">Children &amp; assigned cases</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground leading-relaxed text-pretty">
          A strengths-based record for each child you are authorised to support. Choose a child to
          view their overview, observations, evidence and support.
        </p>
      </div>

      {children.length === 0 ? (
        <EmptyState>No children are currently assigned to you.</EmptyState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {children.map((c) => (
            <li key={c.id}>
              <Link
                href={`/pro/children/${c.id}`}
                className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 transition-colors hover:bg-muted"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-bold text-primary">
                  {c.preferred_name.slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-display text-lg font-bold">{c.preferred_name}</span>
                    {c.is_demo ? <Pill tone="sky">Demo</Pill> : null}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {[c.age_band, c.year_group, c.education_setting].filter(Boolean).join(' · ') || 'Details not set'}
                  </span>
                  {c.known_needs.length > 0 ? (
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {c.known_needs.slice(0, 3).map((n) => (
                        <Pill key={n}>{n}</Pill>
                      ))}
                    </span>
                  ) : null}
                </span>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
