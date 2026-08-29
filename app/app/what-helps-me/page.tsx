'use client'

import { useState } from 'react'
import {
  Sparkles,
  Plus,
  X,
  Heart,
  Star,
  Shield,
  MessageCircle,
  Ear,
  CloudRain,
  Eye,
  HandHeart,
  Frown,
  Wind,
  Settings2,
  Users,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/safe-space/page-header'
import { PrivacyNote } from '@/components/safe-space/primitives'
import { useData } from '@/components/providers/data-provider'
import type { SupportPrefs } from '@/lib/safe-space'

type FieldKey = keyof SupportPrefs

const SECTIONS: {
  key: FieldKey
  title: string
  helper: string
  icon: typeof Heart
}[] = [
  { key: 'enjoy', title: 'Things I enjoy', helper: 'What I like doing', icon: Heart },
  { key: 'strengths', title: 'My strengths', helper: 'Things I am good at', icon: Star },
  { key: 'feelSafe', title: 'What helps me feel safe', helper: '', icon: Shield },
  {
    key: 'helpCommunicate',
    title: 'What helps me communicate',
    helper: 'How I share what I mean',
    icon: MessageCircle,
  },
  { key: 'sensory', title: 'My senses', helper: 'Sounds, lights, textures', icon: Ear },
  { key: 'difficult', title: 'Things I find hard', helper: '', icon: CloudRain },
  {
    key: 'earlySigns',
    title: 'Early signs I am struggling',
    helper: 'What adults might notice first',
    icon: Eye,
  },
  { key: 'helps', title: 'What helps in the moment', helper: '', icon: HandHeart },
  { key: 'makesHarder', title: 'What makes it harder', helper: '', icon: Frown },
  { key: 'calming', title: 'What calms me', helper: '', icon: Wind },
  {
    key: 'adjustments',
    title: 'Adjustments that help',
    helper: 'Small changes that make a difference',
    icon: Settings2,
  },
  {
    key: 'approach',
    title: 'How I would like adults to approach me',
    helper: '',
    icon: Users,
  },
]

export default function WhatHelpsMePage() {
  const { supportPrefs, updateSupportPrefs } = useData()
  const [draft, setDraft] = useState<SupportPrefs>(supportPrefs)
  const [dirty, setDirty] = useState(false)

  function addItem(key: FieldKey, value: string) {
    const v = value.trim()
    if (!v) return
    setDraft((d) => ({ ...d, [key]: [...d[key], v] }))
    setDirty(true)
  }

  function removeItem(key: FieldKey, index: number) {
    setDraft((d) => ({ ...d, [key]: d[key].filter((_, i) => i !== index) }))
    setDirty(true)
  }

  function saveAll() {
    updateSupportPrefs(draft)
    setDirty(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="What Helps Me"
        intro="This is your one-page profile. It helps the adults around you understand what you need, in your words. You are the expert on you."
        readAloudText="What Helps Me. This is your one-page profile. It helps the adults around you understand what you need, in your words. You are the expert on you."
      />

      <div className="mb-6">
        <PrivacyNote>
          You can share this with people in your Safe Circle. It can also be used as
          evidence in meetings about your support, always written in a way that respects
          your voice.
        </PrivacyNote>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <SupportSection
            key={section.key}
            title={section.title}
            helper={section.helper}
            icon={section.icon}
            items={draft[section.key]}
            onAdd={(v) => addItem(section.key, v)}
            onRemove={(i) => removeItem(section.key, i)}
          />
        ))}
      </div>

      {dirty && (
        <div className="sticky bottom-20 z-10 mt-6 sm:bottom-4">
          <button
            onClick={saveAll}
            className="flex w-full min-h-14 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Sparkles className="size-5" /> Save my profile
          </button>
        </div>
      )}
    </div>
  )
}

function SupportSection({
  title,
  helper,
  icon: Icon,
  items,
  onAdd,
  onRemove,
}: {
  title: string
  helper: string
  icon: typeof Heart
  items: string[]
  onAdd: (v: string) => void
  onRemove: (i: number) => void
}) {
  const [value, setValue] = useState('')
  const [adding, setAdding] = useState(false)

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h3 className="font-display font-semibold">{title}</h3>
          {helper && <p className="text-sm text-muted-foreground">{helper}</p>}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <li key={`${item}-${i}`}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
              {item}
              <button
                onClick={() => onRemove(i)}
                aria-label={`Remove ${item}`}
                className="rounded-full text-muted-foreground hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <X className="size-3.5" />
              </button>
            </span>
          </li>
        ))}
        {items.length === 0 && !adding && (
          <li className="text-sm text-muted-foreground">Nothing added yet.</li>
        )}
      </ul>

      {adding ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onAdd(value)
            setValue('')
          }}
          className="mt-3 flex gap-2"
        >
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Add in your own words"
            className="min-h-11 flex-1 rounded-full border-2 border-border bg-background px-4 text-sm focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false)
              setValue('')
            }}
            aria-label="Cancel"
            className="inline-flex min-h-11 items-center rounded-full border-2 border-border px-3 text-sm font-semibold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <X className="size-4" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-dashed border-border px-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Plus className="size-4" /> Add something
        </button>
      )}
    </Card>
  )
}
