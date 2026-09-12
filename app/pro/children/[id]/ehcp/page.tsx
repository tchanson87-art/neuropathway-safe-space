import { notFound } from 'next/navigation'
import { getChild, getEhcpDraft, listEvidence, getViewer } from '@/lib/np/data'
import { AiTag, formatDate } from '@/components/np/ui'
import { ChildHeader } from '../child-header'
import { EhcpEditor } from './ehcp-editor'

export default async function EhcpPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const child = await getChild(id)
  if (!child) notFound()

  const [draft, evidence, viewer] = await Promise.all([
    getEhcpDraft(id),
    listEvidence(id),
    getViewer(),
  ])

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <ChildHeader child={child} />
      </div>

      {/* Print header */}
      <div className="hidden print:block">
        <h1 className="font-display text-2xl font-extrabold">EHCP evidence draft — {child.preferred_name}</h1>
        <p className="text-sm text-muted-foreground">
          Generated {formatDate(new Date().toISOString())} · Draft evidence pack, not a legal or professional decision.
        </p>
      </div>

      <div className="print:hidden">
        <h2 className="font-display text-xl font-bold">EHCP evidence generator</h2>
        <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed text-pretty">
          This organises verified information into the areas an EHCP needs. It drafts from your records,
          flags where evidence is limited, and never invents evidence or makes a diagnosis. The output is a
          fully editable draft evidence pack for a human to complete and check.
        </p>
        <div className="mt-3">
          <AiTag />
        </div>
      </div>

      {draft ? (
        <EhcpEditor childId={id} draftId={draft.id} initialSections={draft.sections ?? {}} />
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No EHCP draft exists for this child yet.
        </p>
      )}

      {/* Source chronology for the printable pack */}
      <section className="rounded-2xl border border-border bg-card p-5 print:border-0 print:p-0">
        <h3 className="font-display font-bold">Source chronology</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Every statement above should be traceable to these records.
        </p>
        <ol className="space-y-1.5 text-sm">
          {evidence.map((e) => (
            <li key={e.id} className="flex flex-wrap gap-2">
              <span className="font-semibold">{formatDate(e.event_date)}</span>
              <span>{e.title}</span>
              <span className="text-muted-foreground">
                — {e.source === 'safe_space' ? 'Safe Space (child, shared with consent)' : e.author_role ?? 'unknown'}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-xs text-muted-foreground print:mt-6">
        Prepared by {viewer?.name ?? 'practitioner'}. This is a draft evidence pack produced with AI
        assistance and human editing. It does not diagnose and does not guarantee any EHCP outcome.
      </p>
    </div>
  )
}
