'use client'

import Link from 'next/link'
import { MessageCircle, Clock, Eye, ShieldCheck, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/safe-space/page-header'
import { PrivacyNote } from '@/components/safe-space/primitives'
import { useData } from '@/components/providers/data-provider'
import { VIEWABLE_AREA_LABELS } from '@/lib/safe-space'

function timeAgo(iso?: string) {
  if (!iso) return 'Not yet'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SafeCirclePage() {
  const { safeCircle } = useData()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="My Safe Circle"
        intro="These are the trusted adults who can help. You can see exactly what each of them is allowed to view, and reach them when you need to."
        readAloudText="My Safe Circle. These are the trusted adults who can help. You can see exactly what each of them is allowed to view, and reach them when you need to."
      />

      <div className="mb-6">
        <PrivacyNote>
          Nobody can see anything unless you have shared it with them. This page always
          shows the truth about who can view what.
        </PrivacyNote>
      </div>

      <ul className="space-y-4">
        {safeCircle.map((member) => (
          <li key={member.id}>
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 font-display text-lg font-bold text-primary"
                  aria-hidden="true"
                >
                  {member.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">{member.role}</p>

                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    {member.contact}
                  </p>
                  <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MessageCircle className="mt-0.5 size-4 shrink-0" />
                    {member.contactMethod}
                  </p>

                  <div className="mt-4 rounded-xl bg-secondary/40 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-secondary-foreground">
                      <Eye className="size-3.5" /> Can currently view
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {member.authorizedToView.length > 0 ? (
                        member.authorizedToView.map((area) => (
                          <span
                            key={area}
                            className="rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-foreground"
                          >
                            {VIEWABLE_AREA_LABELS[area]}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Nothing shared yet
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    Last looked: {timeAgo(member.lastAccessed)}
                  </p>

                  <div className="mt-4">
                    <Link
                      href="/app/support"
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-border px-4 text-sm font-semibold transition-colors hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <MessageCircle className="size-4 text-primary" />
                      Message {member.name.split(' ')[0]}
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="mt-6 flex items-start gap-3 border-primary/20 bg-primary/5 p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <h3 className="font-display font-semibold">Adding or changing your circle</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            A parent, carer or key worker can help you add a trusted adult. You always
            get to choose what each person can see, and you can change your mind at any
            time.
          </p>
        </div>
      </Card>
    </div>
  )
}
