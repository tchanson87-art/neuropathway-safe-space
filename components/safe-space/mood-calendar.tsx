'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MoodCheckIn } from '@/lib/safe-space'
import { EMOTION_OPTIONS } from '@/lib/safe-space'
import { cn } from '@/lib/utils'

const FACE_BY_EMOTION = new Map(EMOTION_OPTIONS.map((e) => [e.label, e.face]))

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

/** A gentle month view of the young person's own check-ins — their answers,
 *  only ever visible to them here. No scores, no streaks. */
export function MoodCalendar({ checkIns }: { checkIns: MoodCheckIn[] }) {
  const [cursor, setCursor] = useState(() => {
    const n = new Date()
    return new Date(n.getFullYear(), n.getMonth(), 1)
  })
  const [selected, setSelected] = useState<string | null>(null)

  // Group check-ins by calendar day, keeping the most recent first.
  const byDay = useMemo(() => {
    const map = new Map<string, MoodCheckIn[]>()
    for (const c of checkIns) {
      const d = new Date(c.date)
      const key = dayKey(d)
      const list = map.get(key) ?? []
      list.push(c)
      map.set(key, list)
    }
    return map
  }, [checkIns])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const monthName = cursor.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const todayKey = dayKey(today)

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const selectedList = selected ? byDay.get(selected) ?? [] : []

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="Previous month"
          className="inline-flex size-11 items-center justify-center rounded-full border-2 border-border text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ChevronLeft className="size-5" />
        </button>
        <p className="font-display text-lg font-bold">{monthName}</p>
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Next month"
          className="inline-flex size-11 items-center justify-center rounded-full border-2 border-border text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5" role="grid" aria-label={`Check-ins for ${monthName}`}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="pb-1 text-center text-xs font-bold text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} aria-hidden="true" />
          const key = `${year}-${month}-${day}`
          const list = byDay.get(key) ?? []
          const top = list[0]
          const face = top ? FACE_BY_EMOTION.get(top.emotions[0]) : undefined
          const isToday = key === todayKey
          const isSelected = key === selected
          return (
            <button
              key={key}
              type="button"
              disabled={list.length === 0}
              aria-pressed={isSelected}
              onClick={() => setSelected(isSelected ? null : key)}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-xl border-2 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                list.length > 0
                  ? 'cursor-pointer border-primary/25 bg-primary/5 hover:border-primary/50'
                  : 'border-transparent bg-muted/40 text-muted-foreground',
                isSelected && 'border-primary bg-primary/10',
                isToday && 'ring-2 ring-accent',
              )}
            >
              <span className={cn('text-[0.7rem] font-semibold', face && 'sr-only')}>{day}</span>
              {face && (
                <span aria-hidden="true" className="text-xl leading-none">
                  {face}
                </span>
              )}
              {list.length > 1 && (
                <span className="absolute bottom-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary/15 text-[0.6rem] font-bold text-primary">
                  {list.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="mt-5 rounded-2xl border-2 border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {new Date(selectedList[0]?.date ?? Date.now()).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          {selectedList.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No check-in on this day.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {selectedList.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-2xl leading-none">
                    {FACE_BY_EMOTION.get(c.emotions[0]) ?? '🙂'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">
                      {c.emotions.join(' and ') || 'A check-in'}
                    </p>
                    {c.note && (
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {c.note}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(c.date).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      {c.sharing === 'shared' ? 'Shared with someone you chose' : 'Only you can see this'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
