'use client'

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  demoProfile,
  demoSafeCircle,
  demoCheckIns,
  demoJournal,
  demoGoals,
  demoSupportPrefs,
  demoSupportRequests,
  demoPatternFlags,
  demoAudit,
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

type DataContextValue = {
  signedIn: boolean
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
  const [signedIn, setSignedIn] = useState(false)
  const [onboarded, setOnboarded] = useState(false)

  const [profile] = useState<ChildProfile>(demoProfile)
  const [safeCircle] = useState<SafeCircleMember[]>(demoSafeCircle)
  const [checkIns, setCheckIns] = useState<MoodCheckIn[]>(demoCheckIns)
  const [journal, setJournal] = useState<JournalEntry[]>(demoJournal)
  const [goals, setGoals] = useState<Goal[]>(demoGoals)
  const [supportPrefs, setSupportPrefs] = useState<SupportPrefs>(demoSupportPrefs)
  const [supportRequests, setSupportRequests] =
    useState<SupportRequest[]>(demoSupportRequests)
  const [patternFlags] = useState<PatternFlag[]>(demoPatternFlags)
  const [audit, setAudit] = useState<AuditEntry[]>(demoAudit)

  const logAudit = useCallback((action: string, detail: string) => {
    setAudit((a) => [
      { id: uid(), at: new Date().toISOString(), actor: `${demoProfile.name} (Child)`, action, detail },
      ...a,
    ])
  }, [])

  const addCheckIn = useCallback(
    (c: Omit<MoodCheckIn, 'id' | 'date'>) => {
      const entry: MoodCheckIn = { ...c, id: uid(), date: new Date().toISOString() }
      setCheckIns((prev) => [entry, ...prev])
      logAudit('Created check-in', `Feelings: ${c.emotions.join(', ') || 'not specified'} · ${c.sharing}`)
    },
    [logAudit],
  )

  const addJournalEntry = useCallback(
    (e: Omit<JournalEntry, 'id' | 'date'>) => {
      const entry: JournalEntry = { ...e, id: uid(), date: new Date().toISOString() }
      setJournal((prev) => [entry, ...prev])
      logAudit('Created journal entry', `“${e.title}” · ${e.sharing}`)
    },
    [logAudit],
  )

  const setEntrySharing = useCallback(
    (id: string, sharing: Sharing, sharedWith: string[]) => {
      setJournal((prev) =>
        prev.map((e) => (e.id === id ? { ...e, sharing, sharedWith } : e)),
      )
      logAudit('Changed sharing on a journal entry', `Now ${sharing}`)
    },
    [logAudit],
  )

  const deleteJournalEntry = useCallback(
    (id: string) => {
      setJournal((prev) => prev.filter((e) => e.id !== id))
      logAudit('Removed a journal entry', 'Child chose to delete their entry')
    },
    [logAudit],
  )

  const addGoal = useCallback(
    (g: Omit<Goal, 'id'>) => {
      setGoals((prev) => [{ ...g, id: uid() }, ...prev])
      logAudit('Created goal', `“${g.title}”`)
    },
    [logAudit],
  )

  const toggleGoalStep = useCallback((goalId: string, stepId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              steps: g.steps.map((s) =>
                s.id === stepId ? { ...s, done: !s.done } : s,
              ),
            }
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
        // Demo: mark received shortly after to show the acknowledgement flow.
        receivedAt: new Date(now.getTime() + 1000 * 60).toISOString(),
        status: 'received',
        note,
      }
      setSupportRequests((prev) => [req, ...prev])
      logAudit('Sent support request', `Type: ${type}`)
    },
    [logAudit],
  )

  const value = useMemo<DataContextValue>(
    () => ({
      signedIn,
      onboarded,
      signIn: () => setSignedIn(true),
      signOut: () => setSignedIn(false),
      completeOnboarding: () => setOnboarded(true),
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
      onboarded,
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
