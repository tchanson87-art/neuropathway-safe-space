'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useSettings } from '@/components/providers/settings-provider'
import { cn } from '@/lib/utils'

type Phase = { label: string; seconds: number; scale: number }

const PHASES: Phase[] = [
  { label: 'Breathe in', seconds: 4, scale: 1 },
  { label: 'Hold', seconds: 4, scale: 1 },
  { label: 'Breathe out', seconds: 6, scale: 0.55 },
  { label: 'Rest', seconds: 2, scale: 0.55 },
]

export function BreathingExercise() {
  const { reduceMotion: reducedMotion } = useSettings()
  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remaining, setRemaining] = useState(PHASES[0].seconds)
  const [rounds, setRounds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1
        setPhaseIndex((pi) => {
          const next = (pi + 1) % PHASES.length
          if (next === 0) setRounds((n) => n + 1)
          setRemaining(PHASES[next].seconds)
          return next
        })
        return PHASES[(phaseIndex + 1) % PHASES.length].seconds
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, phaseIndex])

  function reset() {
    setRunning(false)
    setPhaseIndex(0)
    setRemaining(PHASES[0].seconds)
    setRounds(0)
  }

  const phase = PHASES[phaseIndex]

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-64 w-full items-center justify-center overflow-hidden">
        <div
          className={cn(
            'absolute rounded-full bg-primary/15',
            !reducedMotion && 'transition-all ease-in-out',
          )}
          style={{
            width: 200,
            height: 200,
            transform: `scale(${running ? phase.scale : 0.7})`,
            transitionDuration: reducedMotion ? '0ms' : `${phase.seconds}s`,
          }}
          aria-hidden="true"
        />
        <div
          className={cn(
            'absolute rounded-full bg-primary/25',
            !reducedMotion && 'transition-all ease-in-out',
          )}
          style={{
            width: 140,
            height: 140,
            transform: `scale(${running ? phase.scale : 0.7})`,
            transitionDuration: reducedMotion ? '0ms' : `${phase.seconds}s`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 text-center">
          <p className="font-display text-2xl font-bold text-foreground" aria-live="polite">
            {running ? phase.label : 'Ready when you are'}
          </p>
          {running && (
            <p className="mt-1 text-4xl font-bold text-primary tabular-nums">{remaining}</p>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        {rounds > 0 ? `${rounds} calm ${rounds === 1 ? 'round' : 'rounds'} done` : 'Follow the circle at your own pace'}
      </p>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {running ? <Pause className="size-5" /> : <Play className="size-5" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-border px-5 font-semibold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <RotateCcw className="size-4" /> Reset
        </button>
      </div>
    </div>
  )
}
