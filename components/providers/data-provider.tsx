'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  demoSafeCircle,
  demoGoals,
  demoSupportPrefs,
  demoSupportRequests,
  demoPatternFlags,
  type ChildProfile,
  type SafeCircleMember,
  type MoodCheckIn,
  type JournalEntry,
  type Goal,
  type GoalStatus,
  type SupportPrefs,
  type SupportRequest,
  type SupportRequestType,
  type PatternFlag,
  type AuditEntry,
  type Sharing,
} from '@/lib/safe-space'

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

// ---------- Supabase row <-> app model mappers ----------

type CheckInRow = {
  id: string
  created_at: string
  emotions: string[]
  intensity: number
  place: string | null
  before_context: string | null
  triggers: string[]
  sensory: string[]
  helped: string[]
  need: string | null
  note: string | null
  sharing: Sharing
  shared_with: string[]
}

type JournalRow = {
  id: string
  created_at: string
  type: JournalEntry['type']
  title: string
  body: string
  prompt_used: string | null
  category: JournalEntry['category']
  sharing: Sharing
  shared_with: string[]
}

function rowToCheckIn(r: CheckInRow): MoodCheckIn {
  return {
    id: r.id,
    date: r.created_at,
    emotions: r.emotions ?? [],
    intensity: r.intensity,
    place: r.place ?? undefined,
    before: r.before_context ?? undefined,
    triggers: r.triggers ?? [],
    sensory: r.sensory ?? [],
    helped: r.helped ?? [],
    need: r.need ?? undefined,
    note: r.note ?? undefined,
    sharing: r.sharing,
    sharedWith: r.shared_with ?? [],
  }
}

function rowToJournal(r: JournalRow): JournalEntry {
  return {
    id: r.id,
    date: r.created_at,
    type: r.type,
    title: r.title,
    body: r.body,
    promptUsed: r.prompt_used ?? undefined,
    category: r.category,
    sharing: r.sharing,
    sharedWith: r.shared_with ?? [],
  }
}

type DataContextValue = {
  signedIn: boolean
  sessionReady: boolean
  onboarded: boolean
  signIn: () => void
  signOut: () => void
  completeOnboarding: () => void

  profile: ChildProfile
  safeCircle: SafeCircleMember[]

  checkIns: MoodCheckIn[]
  addCheckIn: (c: Omit<MoodCheckIn, 'id' | 'date'>) => void

  journal: JournalEntry[]
  addJournalEntry: (e: Omit<JournalEntry, 'id' | 'date'>) => void
  setEntrySharing: (id: string, sharing: Sharing, sharedWith: string[]) => void
  deleteJournalEntry: (id: string) => void

  goals: Goal[]
  addGoal: (g: Omit<Goal, 'id'>) => void
  toggleGoalStep: (goalId: string, stepId: string) => void
  setGoalStatus: (goalId: string, status: GoalStatus) => void

  supportPrefs: SupportPrefs
  updateSupportPrefs: (next: SupportPrefs) => void

  supportRequests: SupportRequest[]
  addSupportRequest: (type: SupportRequestType, sentTo: string, note?: string) => void

  patternFlags: PatternFlag[]
  audit: AuditEntry[]
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), [])

  const [signedIn, setSignedIn] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [onboarded, setOnboarded] = useState(false)
  const [displayName, setDisplayName] = useState('Friend')
  const userIdRef = useRef<string | null>(null)

  // Persisted-to-Supabase collections.
  const [checkIns, setCheckIns] = useState<MoodCheckIn[]>([])
  const [journal, setJournal] = useState<JournalEntry[]>([])

  // Demo collections retained for this iteration (no dedicated tables yet).
  const [safeCircle] = useState<SafeCircleMember[]>(demoSafeCircle)
  const [goals, setGoals] = useState<Goal[]>(demoGoals)
  const [supportPrefs, setSupportPrefs] = useState<SupportPrefs>(demoSupportPrefs)
  const [supportRequests, setSupportRequests] =
    useState<SupportRequest[]>(demoSupportRequests)
  const [patternFlags] = useState<PatternFlag[]>(demoPatternFlags)
  const [audit, setAudit] = useState<AuditEntry[]>([])

  const logAudit = useCallback((action: string, detail: string) => {
    setAudit((a) => [
      { id: uid(), at: new Date().toISOString(), actor: `${displayName} (Child)`, action, detail },
      ...a,
    ])
  }, [displayName])

  // Load the signed-in user's data from Supabase.
  const loadUserData = useCallback(
    async (userId: string) => {
      const [{ data: profileRow }, { data: checkinRows }, { data: journalRows }] =
        await Promise.all([
          supabase
            .from('safespace_profiles')
            .select('display_name, onboarding_completed')
            .eq('id', userId)
            .maybeSingle(),
          supabase
            .from('safespace_checkins')
            .select(
              'id, created_at, emotions, intensity, place, before_context, triggers, sensory, helped, need, note, sharing, shared_with',
            )
            .eq('user_id', userId)
            .order('created_at', { ascending: false }),
          supabase
            .from('safespace_journal')
            .select(
              'id, created_at, type, title, body, prompt_used, category, sharing, shared_with',
            )
            .eq('user_id', userId)
            .order('created_at', { ascending: false }),
        ])

      if (profileRow) {
        setDisplayName(profileRow.display_name || 'Friend')
        setOnboarded(Boolean(profileRow.onboarding_completed))
      }
      setCheckIns((checkinRows ?? []).map((r) => rowToCheckIn(r as CheckInRow)))
      setJournal((journalRows ?? []).map((r) => rowToJournal(r as JournalRow)))
    },
    [supabase],
  )

  // Establish the auth session and react to sign in/out.
  useEffect(() => {
    let active = true

    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return
      const user = data.user
      if (user) {
        userIdRef.current = user.id
        setSignedIn(true)
        await loadUserData(user.id)
      }
      setSessionReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      if (user) {
        if (userIdRef.current !== user.id) {
          userIdRef.current = user.id
          void loadUserData(user.id)
        }
        setSignedIn(true)
      } else {
        userIdRef.current = null
        setSignedIn(false)
        setCheckIns([])
        setJournal([])
        setOnboarded(false)
        setDisplayName('Friend')
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [supabase, loadUserData])

  const signOut = useCallback(() => {
    void supabase.auth.signOut()
  }, [supabase])

  const completeOnboarding = useCallback(() => {
    setOnboarded(true)
    const userId = userIdRef.current
    if (userId) {
      void supabase
        .from('safespace_profiles')
        .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
        .eq('id', userId)
    }
  }, [supabase])

  const addCheckIn = useCallback(
    async (c: Omit<MoodCheckIn, 'id' | 'date'>) => {
      const userId = userIdRef.current
      if (!userId) return
      const { data, error } = await supabase
        .from('safespace_checkins')
        .insert({
          user_id: userId,
          emotions: c.emotions,
          intensity: c.intensity,
          place: c.place ?? null,
          before_context: c.before ?? null,
          triggers: c.triggers,
          sensory: c.sensory,
          helped: c.helped,
          need: c.need ?? null,
          note: c.note ?? null,
          sharing: c.sharing,
          shared_with: c.sharedWith,
        })
        .select(
          'id, created_at, emotions, intensity, place, before_context, triggers, sensory, helped, need, note, sharing, shared_with',
        )
        .single()
      if (error || !data) return
      setCheckIns((prev) => [rowToCheckIn(data as CheckInRow), ...prev])
      logAudit('Created check-in', `Feelings: ${c.emotions.join(', ') || 'not specified'} · ${c.sharing}`)
    },
    [supabase, logAudit],
  )

  const addJournalEntry = useCallback(
    async (e: Omit<JournalEntry, 'id' | 'date'>) => {
      const userId = userIdRef.current
      if (!userId) return
      const { data, error } = await supabase
        .from('safespace_journal')
        .insert({
          user_id: userId,
          type: e.type,
          title: e.title,
          body: e.body,
          prompt_used: e.promptUsed ?? null,
          category: e.category,
          sharing: e.sharing,
          shared_with: e.sharedWith,
        })
        .select('id, created_at, type, title, body, prompt_used, category, sharing, shared_with')
        .single()
      if (error || !data) return
      setJournal((prev) => [rowToJournal(data as JournalRow), ...prev])
      logAudit('Created journal entry', `"${e.title}" · ${e.sharing}`)
    },
    [supabase, logAudit],
  )

  const setEntrySharing = useCallback(
    async (id: string, sharing: Sharing, sharedWith: string[]) => {
      setJournal((prev) =>
        prev.map((e) => (e.id === id ? { ...e, sharing, sharedWith } : e)),
      )
      await supabase
        .from('safespace_journal')
        .update({ sharing, shared_with: sharedWith })
        .eq('id', id)
      logAudit('Changed sharing on a journal entry', `Now ${sharing}`)
    },
    [supabase, logAudit],
  )

  const deleteJournalEntry = useCallback(
    async (id: string) => {
      setJournal((prev) => prev.filter((e) => e.id !== id))
      await supabase.from('safespace_journal').delete().eq('id', id)
      logAudit('Removed a journal entry', 'Child chose to delete their entry')
    },
    [supabase, logAudit],
  )

  // ----- Demo-only mutations (kept in memory this iteration) -----

  const addGoal = useCallback(
    (g: Omit<Goal, 'id'>) => {
      setGoals((prev) => [{ ...g, id: uid() }, ...prev])
      logAudit('Created goal', `"${g.title}"`)
    },
    [logAudit],
  )

  const toggleGoalStep = useCallback((goalId: string, stepId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, steps: g.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)) }
          : g,
      ),
    )
  }, [])

  const setGoalStatus = useCallback(
    (goalId: string, status: GoalStatus) => {
      setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, status } : g)))
      logAudit('Updated a goal', `Status: ${status}`)
    },
    [logAudit],
  )

  const updateSupportPrefs = useCallback(
    (next: SupportPrefs) => {
      setSupportPrefs(next)
      logAudit('Updated How to Support Me', 'Support profile edited')
    },
    [logAudit],
  )

  const addSupportRequest = useCallback(
    (type: SupportRequestType, sentTo: string, note?: string) => {
      const now = new Date()
      const req: SupportRequest = {
        id: uid(),
        type,
        sentTo,
        createdAt: now.toISOString(),
        receivedAt: new Date(now.getTime() + 1000 * 60).toISOString(),
        status: 'received',
        note,
      }
      setSupportRequests((prev) => [req, ...prev])
      logAudit('Sent support request', `Type: ${type}`)
    },
    [logAudit],
  )

  const profile = useMemo<ChildProfile>(
    () => ({ name: displayName, accessCode: '' }),
    [displayName],
  )

  const value = useMemo<DataContextValue>(
    () => ({
      signedIn,
      sessionReady,
      onboarded,
      signIn: () => {},
      signOut,
      completeOnboarding,
      profile,
      safeCircle,
      checkIns,
      addCheckIn,
      journal,
      addJournalEntry,
      setEntrySharing,
      deleteJournalEntry,
      goals,
      addGoal,
      toggleGoalStep,
      setGoalStatus,
      supportPrefs,
      updateSupportPrefs,
      supportRequests,
      addSupportRequest,
      patternFlags,
      audit,
    }),
    [
      signedIn,
      sessionReady,
      onboarded,
      signOut,
      completeOnboarding,
      profile,
      safeCircle,
      checkIns,
      addCheckIn,
      journal,
      addJournalEntry,
      setEntrySharing,
      deleteJournalEntry,
      goals,
      addGoal,
      toggleGoalStep,
      setGoalStatus,
      supportPrefs,
      updateSupportPrefs,
      supportRequests,
      addSupportRequest,
      patternFlags,
      audit,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
