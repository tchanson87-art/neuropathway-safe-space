import { notFound } from 'next/navigation'
import { HeartHandshake, FileText, ClipboardList, Upload, MessageSquare } from 'lucide-react'
import { getChild, listEvidence } from '@/lib/np/data'
import { EmptyState, Pill, AiTag, VerifiedTag, formatDate } from '@/components/np/ui'
import { ChildHeader } from '../child-header'

const RECORD_ICON: Record<string, typeof FileText> = {
  observation: ClipboardList,
  questionnaire: FileText,
  safe_space: HeartHandshake,
  document: Upload,
  note: MessageSquare,
}

export default async function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const child = await getChild(id)
  if (!child) notFound()
  const evidence = await listEvidence(id)

  return (
    <div className="space-y-6">
      <ChildHeader child={child} />

      <div>
        <h2 className="font-display text-xl font-bold">Evidence timeline</h2>
        <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
          One secure, chronological store. Sources stay distinct — professional records, questionnaire
          responses, and entries the child chose to share from Safe Space are never merged into one
          indistinguishable statement.
        </p>
      </div>

      {evidence.length === 0 ? (
        <EmptyState>No evidence recorded yet.</EmptyState>
      ) : (
        <ol className="relative space-y-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {evidence.map((e) => {
            const Icon = RECORD_ICON[e.record_type] ?? FileText
            const fromSafeSpace = e.source === 'safe_space'
            return (
              <li key={e.id} className="relative flex gap-4">
                <span
                  className={
                    'z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border ' +
                    (fromSafeSpace ? 'bg-teal/15 text-teal' : 'bg-card text-primary')
                  }
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="flex-1 rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{e.title}</p>
                    {fromSafeSpace ? <Pill tone="teal">Safe Space · shared with consent</Pill> : null}
                    {e.is_ai_assisted ? <AiTag /> : null}
                    {e.review_status === 'reviewed' ? <VerifiedTag /> : null}
                    <span className="ml-auto text-xs text-muted-foreground">{formatDate(e.event_date)}</span>
                  </div>
                  {e.body ? <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{e.body}</p> : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {e.author_role ?? 'unknown'} · {e.record_type.replace('_', ' ')}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
