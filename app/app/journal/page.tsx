'use client'

import { useState } from 'react'
import {
  BookOpen,
  PenLine,
  Mic,
  Palette,
  Camera,
  Trash2,
  Eye,
  Plus,
  X,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/safe-space/page-header'
import {
  ChoiceChip,
  SharingBadge,
  PrivacyNote,
  EmptyState,
  SectionLabel,
} from '@/components/safe-space/primitives'
import { useData } from '@/components/providers/data-provider'
import {
  JOURNAL_PROMPTS,
  membersAuthorisedFor,
  type JournalCategory,
  type JournalType,
  type Sharing,
} from '@/lib/safe-space'
import { cn } from '@/lib/utils'

const TYPE_META: Record<JournalType, { label: string; icon: typeof PenLine }> = {
  text: { label: 'Write', icon: PenLine },
  voice: { label: 'Voice note', icon: Mic },
  drawing: { label: 'Draw', icon: Palette },
  photo: { label: 'Photo', icon: Camera },
}

const CATEGORIES: { value: JournalCategory; label: string }[] = [
  { value: 'general', label: 'Just thoughts' },
  { value: 'strength', label: 'Something I am proud of' },
  { value: 'positive', label: 'A good moment' },
  { value: 'difficult', label: 'Something hard' },
  { value: 'understand', label: 'What I want understood' },
  { value: 'strategy', label: 'Something that helped' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function JournalPage() {
  const { journal, addJournalEntry, deleteJournalEntry, safeCircle } = useData()
  const [composing, setComposing] = useState(false)

  const [type, setType] = useState<JournalType>('text')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<JournalCategory>('general')
  const [promptUsed, setPromptUsed] = useState<string>('')
  const [sharing, setSharing] = useState<Sharing>('private')
  const [sharedWith, setSharedWith] = useState<string[]>([])
  const [shareError, setShareError] = useState(false)

  // Least-privilege: only adults explicitly authorised to view journals can be chosen.
  const journalRecipients = membersAuthorisedFor(safeCircle, 'journal')

  function reset() {
    setType('text')
    setTitle('')
    setBody('')
    setCategory('general')
    setPromptUsed('')
    setSharing('private')
    setSharedWith([])
    setShareError(false)
  }

  function toggleRecipient(id: string) {
    setShareError(false)
    setSharedWith((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  }

  function chooseSharing(next: Sharing) {
    setSharing(next)
    setShareError(false)
    if (next === 'private') setSharedWith([])
  }

  function save() {
    if (!title.trim() && !body.trim()) return
    // Tight sharing: an entry marked "shared" must name at least one authorised adult,
    // otherwise it stays private rather than being shared with nobody or everybody.
    if (sharing === 'shared' && sharedWith.length === 0) {
      setShareError(true)
      return
    }
    addJournalEntry({
      type,
      title: title.trim() || 'Untitled entry',
      body: body.trim(),
      category,
      promptUsed: promptUsed || undefined,
      sharing,
      sharedWith: sharing === 'shared' ? sharedWith : [],
    })
    reset()
    setComposing(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="My Journal"
        intro="A private place to put your thoughts into words, pictures or your voice. You decide what stays private and what you share."
        readAloudText="My Journal. A private place to put your thoughts into words, pictures or your voice. You decide what stays private and what you share."
        action={
          !composing ? (
            <button
              onClick={() => setComposing(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Plus className="size-4" /> New entry
            </button>
          ) : null
        }
      />

      {composing && (
        <Card className="mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">New journal entry</h2>
            <button
              onClick={() => {
                reset()
                setComposing(false)
              }}
              aria-label="Close"
              className="rounded-full p-2 text-muted-foreground hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <X className="size-5" />
            </button>
          </div>

          <SectionLabel>How would you like to record it?</SectionLabel>
          <div className="mb-5 flex flex-wrap gap-2">
            {(Object.keys(TYPE_META) as JournalType[]).map((t) => {
              const Icon = TYPE_META[t].icon
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                    type === t
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40 text-muted-foreground',
                  )}
                >
                  <Icon className="size-4" /> {TYPE_META[t].label}
                </button>
              )
            })}
          </div>

          <SectionLabel>Need a starting point?</SectionLabel>
          <div className="mb-5 flex flex-wrap gap-2">
            {JOURNAL_PROMPTS.slice(0, 5).map((p) => (
              <ChoiceChip
                key={p}
                selected={promptUsed === p}
                onToggle={() => {
                  setPromptUsed((cur) => (cur === p ? '' : p))
                }}
              >
                {p}
              </ChoiceChip>
            ))}
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a title (optional)"
            className="mb-3 w-full rounded-2xl border-2 border-border bg-background p-3 text-base font-medium placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          />

          {type === 'text' ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder={promptUsed || 'Write whatever you like. This is your space.'}
              className="mb-4 w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-base leading-relaxed placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            />
          ) : (
            <div className="mb-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/40 p-8 text-center text-muted-foreground">
              {(() => {
                const Icon = TYPE_META[type].icon
                return <Icon className="size-8 text-primary" />
              })()}
              <p className="text-sm font-medium">
                {type === 'voice' && 'Tap to record a voice note (demo)'}
                {type === 'drawing' && 'Open the drawing canvas (demo)'}
                {type === 'photo' && 'Add a photo from your device (demo)'}
              </p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={2}
                placeholder="Add a few words about it (optional)"
                className="mt-2 w-full resize-none rounded-xl border-2 border-border bg-background p-3 text-sm leading-relaxed focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
              />
            </div>
          )}

          <SectionLabel>What is this entry about?</SectionLabel>
          <div className="mb-5 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <ChoiceChip
                key={c.value}
                selected={category === c.value}
                onToggle={() => setCategory(c.value)}
              >
                {c.label}
              </ChoiceChip>
            ))}
          </div>

          <SectionLabel>Keep it private or share it?</SectionLabel>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => chooseSharing('private')}
              aria-pressed={sharing === 'private'}
              className={cn(
                'rounded-2xl border-2 p-4 text-left font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                sharing === 'private' ? 'border-primary bg-primary/8' : 'border-border',
              )}
            >
              Only me
              <span className="block text-sm font-normal text-muted-foreground">
                Private, just for you
              </span>
            </button>
            <button
              type="button"
              onClick={() => chooseSharing('shared')}
              aria-pressed={sharing === 'shared'}
              className={cn(
                'rounded-2xl border-2 p-4 text-left font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                sharing === 'shared' ? 'border-primary bg-primary/8' : 'border-border',
              )}
            >
              Share with someone I trust
              <span className="block text-sm font-normal text-muted-foreground">
                You choose exactly who
              </span>
            </button>
          </div>

          {sharing === 'shared' && (
            <div className="mb-4">
              {journalRecipients.length > 0 ? (
                <>
                  <SectionLabel>Choose who can see this entry</SectionLabel>
                  <p className="mb-2 text-sm text-muted-foreground leading-relaxed">
                    Only these adults can be chosen, because only they are allowed to see
                    journal entries. Nobody else will ever see it.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {journalRecipients.map((m) => {
                      const on = sharedWith.includes(m.id)
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleRecipient(m.id)}
                          aria-pressed={on}
                          className={cn(
                            'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                            on
                              ? 'border-primary bg-primary/10'
                              : 'border-border text-muted-foreground hover:border-primary/40',
                          )}
                        >
                          {on && <Eye className="size-4 text-primary" />}
                          {m.name} · {m.role}
                        </button>
                      )
                    })}
                  </div>
                  {shareError && (
                    <p className="mt-2 text-sm font-semibold text-destructive">
                      Please choose at least one person, or keep it private.
                    </p>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border-2 border-accent/40 bg-accent/15 p-4 text-sm leading-relaxed text-accent-foreground">
                  No one in your Safe Circle is set up to see journal entries yet, so this
                  will stay private. A parent, carer or key worker can help you set that up.
                </div>
              )}
            </div>
          )}

          <PrivacyNote>
            Your words stay in your words. An entry is only ever seen by the exact people
            you name here, and they cannot change what you have written.
          </PrivacyNote>

          <div className="mt-5 flex gap-3">
            <button
              onClick={save}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Save entry
            </button>
          </div>
        </Card>
      )}

      {journal.length === 0 && !composing ? (
        <EmptyState
          icon={BookOpen}
          title="Your journal is empty"
          description="When you are ready, add your first entry. There is no right or wrong way to do it."
          action={
            <button
              onClick={() => setComposing(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-5 font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Plus className="size-4" /> Write my first entry
            </button>
          }
        />
      ) : (
        <ul className="space-y-4">
          {journal.map((entry) => {
            const Icon = TYPE_META[entry.type].icon
            const sharedNames = entry.sharedWith
              .map((id) => safeCircle.find((m) => m.id === id)?.name)
              .filter(Boolean)
            return (
              <li key={entry.id}>
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="size-4 text-primary" />
                      <span>{formatDate(entry.date)}</span>
                    </div>
                    <SharingBadge sharing={entry.sharing} />
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold text-balance">
                    {entry.title}
                  </h3>
                  {entry.body && (
                    <p className="mt-1 text-muted-foreground leading-relaxed text-pretty">
                      {entry.body}
                    </p>
                  )}
                  {entry.promptUsed && (
                    <p className="mt-2 text-xs italic text-muted-foreground">
                      Prompt: {entry.promptUsed}
                    </p>
                  )}

                  {entry.sharing === 'shared' && (
                    <div className="mt-3 rounded-xl bg-secondary/40 p-3 text-sm">
                      <p className="font-medium text-secondary-foreground">
                        Shared with {sharedNames.join(', ') || 'your chosen adult'}
                      </p>
                      {entry.accessLog && entry.accessLog.length > 0 && (
                        <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                          <Eye className="size-3.5" />
                          {safeCircle.find((m) => m.id === entry.accessLog![0].memberId)?.name}{' '}
                          read this on {formatDate(entry.accessLog[0].at)}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <Trash2 className="size-4" /> Delete
                    </button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
