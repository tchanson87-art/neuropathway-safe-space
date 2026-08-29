'use client'

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark'
export type TextSize = 'base' | 'large' | 'xlarge'
export type AgeMode = 'younger' | 'teen'

type Settings = {
  theme: Theme
  lowStim: boolean
  textSize: TextSize
  reduceMotion: boolean
  tts: boolean
  ageMode: AgeMode
}

type SettingsContextValue = Settings & {
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  setLowStim: (v: boolean) => void
  setTextSize: (v: TextSize) => void
  setReduceMotion: (v: boolean) => void
  setTts: (v: boolean) => void
  setAgeMode: (v: AgeMode) => void
  speak: (text: string) => void
}

const DEFAULTS: Settings = {
  theme: 'light',
  lowStim: false,
  textSize: 'base',
  reduceMotion: false,
  tts: false,
  ageMode: 'teen',
}

const STORAGE_KEY = 'safespace.settings.v1'

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [ready, setReady] = useState(false)

  // Load saved accessibility preferences (UI prefs only, no user content).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) })
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  // Apply to <html> and persist.
  useEffect(() => {
    if (!ready) return
    const root = document.documentElement
    root.classList.toggle('dark', settings.theme === 'dark')
    root.classList.toggle('light', settings.theme === 'light')
    root.classList.toggle('low-stim', settings.lowStim)
    root.classList.toggle('reduce-motion', settings.reduceMotion)
    root.setAttribute('data-text-size', settings.textSize)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* ignore */
    }
  }, [settings, ready])

  const update = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) =>
      setSettings((s) => ({ ...s, [key]: value })),
    [],
  )

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
      if (!settings.tts) return
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.rate = settings.ageMode === 'younger' ? 0.92 : 1
      utter.pitch = 1
      window.speechSynthesis.speak(utter)
    },
    [settings.tts, settings.ageMode],
  )

  const value: SettingsContextValue = {
    ...settings,
    setTheme: (t) => update('theme', t),
    toggleTheme: () => update('theme', settings.theme === 'dark' ? 'light' : 'dark'),
    setLowStim: (v) => update('lowStim', v),
    setTextSize: (v) => update('textSize', v),
    setReduceMotion: (v) => update('reduceMotion', v),
    setTts: (v) => update('tts', v),
    setAgeMode: (v) => update('ageMode', v),
    speak,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
