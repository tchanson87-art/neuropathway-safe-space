'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { useSettings } from '@/components/providers/settings-provider'
import { cn } from '@/lib/utils'

/**
 * Nova — the app's friendly guide character. Cheeky and reassuring, never a
 * therapist and never "watching". Nova only ever points at the buttons and
 * cheers the young person on; the young person is always in control.
 */

const NOVA_INTROS = [
  "Hi, I'm Nova. Think of me as a friendly star who hangs out here — not a grown-up checking up on you.",
  "Hey, it's Nova. No pressure today. We can do loads, or almost nothing. Both are completely fine.",
  "Nova here. You're the boss of this space. I just point at the buttons and cheer you on.",
  "Hi again. Whatever kind of day it is, you don't have to figure it out on your own.",
  "It's me, Nova. Small steps count. Turning up here is already one.",
]

/** Pick a line that stays steady through a session but varies day to day. */
export function pickNovaLine(seed = new Date().getDate()): string {
  return NOVA_INTROS[seed % NOVA_INTROS.length]
}

export function GuideAvatar({
  size = 72,
  float = false,
  className,
}: {
  size?: number
  float?: boolean
  className?: string
}) {
  const { reduceMotion } = useSettings()
  return (
    <Image
      src="/images/guide-nova.png"
      alt="Nova, your friendly guide"
      width={size}
      height={size}
      priority
      className={cn(
        'shrink-0 select-none object-contain drop-shadow-sm',
        float && !reduceMotion && 'animate-float-soft',
        className,
      )}
    />
  )
}

/**
 * Nova with a speech bubble. Use for greetings and gentle encouragement.
 */
export function Guide({
  children,
  size = 72,
  float = true,
  className,
}: {
  children: ReactNode
  size?: number
  float?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <GuideAvatar size={size} float={float} />
      <div className="relative mt-1 flex-1 rounded-2xl rounded-tl-sm border-2 border-border bg-card px-4 py-3 text-pretty">
        {/* little tail pointing back at Nova */}
        <span
          aria-hidden="true"
          className="absolute -left-[9px] top-3 size-3 rotate-45 border-b-2 border-l-2 border-border bg-card"
        />
        <p className="text-sm leading-relaxed sm:text-base">{children}</p>
      </div>
    </div>
  )
}
