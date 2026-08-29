'use client'

import { Volume2 } from 'lucide-react'
import { useSettings } from '@/components/providers/settings-provider'
import { cn } from '@/lib/utils'

/**
 * Read-aloud control. Only actually speaks when text-to-speech is enabled in
 * settings; otherwise it gently points the child to the setting.
 */
export function ReadAloud({ text, className }: { text: string; className?: string }) {
  const { speak, tts } = useSettings()
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      title={tts ? 'Read this aloud' : 'Turn on read-aloud in Settings first'}
      className={cn(
        'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        !tts && 'opacity-55',
        className,
      )}
    >
      <Volume2 className="size-5" />
      <span className="sr-only">Read this section aloud</span>
    </button>
  )
}
