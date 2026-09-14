// Domain model + fictional demonstration data for the Safe Space prototype.
// All names, events and content below are entirely fictional and used only
// to demonstrate the interface. No real child or family data is used.

export type Sharing = 'private' | 'shared'

export type SafeCircleRole =
  | 'Parent / Carer'
  | 'Teacher'
  | 'SENCO'
  | 'Pastoral worker'
  | 'Key worker'
  | 'Health professional'
  | 'Social worker'
  | 'Trusted adult'

export type ViewableArea =
  | 'check-ins'
  | 'journal'
  | 'goals'
  | 'what-helps-me'
  | 'support-requests'

export type SafeCircleMember = {
  id: string
  name: string
  role: SafeCircleRole
  initials: string
  contact: string
  contactMethod: string
  authorizedToView: ViewableArea[]
  lastAccessed?: string
}

export type MoodCheckIn = {
  id: string
  date: string // ISO
  emotions: string[]
  intensity: number // 1-5
  place?: string
  before?: string
  triggers: string[]
  sensory: string[]
  helped: string[]
  need?: string
  note?: string
  sharing: Sharing
  sharedWith: string[] // member ids
}

export type JournalCategory =
  | 'general'
  | 'strength'
  | 'positive'
  | 'difficult'
  | 'understand'
  | 'strategy'

export type JournalType = 'text' | 'voice' | 'drawing' | 'photo'

export type JournalEntry = {
  id: string
  date: string
  type: JournalType
  title: string
  body: string
  promptUsed?: string
  category: JournalCategory
  sharing: Sharing
  sharedWith: string[]
  accessLog?: { memberId: string; at: string }[]
}

export type GoalStep = { id: string; label: string; done: boolean }
export type GoalStatus = 'active' | 'paused' | 'done'

export type Goal = {
  id: string
  title: string
  why: string
  timescale: string
  steps: GoalStep[]
  barriers?: string
  supportNeeded?: string
  status: GoalStatus
  supporters: string[] // member ids
}

export type SupportPrefs = {
  enjoy: string[]
  strengths: string[]
  feelSafe: string[]
  helpCommunicate: string[]
  sensory: string[]
  difficult: string[]
  earlySigns: string[]
  helps: string[]
  makesHarder: string[]
  calming: string[]
  adjustments: string[]
  approach: string[]
}

export type SupportRequestType =
  | 'talk'
  | 'worried'
  | 'not-safe'
  | 'help-now'
  | 'share-entry'
  | 'worried-other'
  | 'wellbeing-check'

export type SupportRequest = {
  id: string
  type: SupportRequestType
  sentTo: string // member id or 'safeguarding-route'
  createdAt: string
  receivedAt?: string
  status: 'sent' | 'received' | 'in-progress' | 'responded'
  note?: string
  nextSteps?: string
}

export type PatternFlag = {
  id: string
  summary: string
  basis: string
  dateRange: string
  status: 'awaiting-review' | 'reviewed'
  reviewedBy?: string
  reviewNote?: string
  reviewedAt?: string
}

export type AuditEntry = {
  id: string
  at: string
  actor: string
  action: string
  detail: string
}

export type ChildProfile = {
  name: string
  accessCode: string
}

// ---------- Fictional seed data ----------

export const DEMO_ACCESS_CODE = 'SAFE-2731'

export const demoProfile: ChildProfile = {
  name: 'Robin',
  accessCode: DEMO_ACCESS_CODE,
}

export const demoSafeCircle: SafeCircleMember[] = [
  {
    id: 'm-mum',
    name: 'Sam Carter',
    role: 'Parent / Carer',
    initials: 'SC',
    contact: 'At home',
    contactMethod: 'Talk at home or message through Safe Space',
    authorizedToView: ['goals', 'what-helps-me'],
    lastAccessed: '2026-08-24T18:10:00.000Z',
  },
  {
    id: 'm-senco',
    name: 'Ms Okafor',
    role: 'SENCO',
    initials: 'MO',
    contact: 'Room 4, Learning Support',
    contactMethod: 'Ask at Learning Support or request a chat here',
    authorizedToView: ['what-helps-me', 'goals', 'check-ins'],
    lastAccessed: '2026-08-27T09:35:00.000Z',
  },
  {
    id: 'm-pastoral',
    name: 'Mr Bright',
    role: 'Pastoral worker',
    initials: 'MB',
    contact: 'Pastoral Office',
    contactMethod: 'Drop in at break or request a chat here',
    authorizedToView: ['support-requests'],
  },
]

export const demoCheckIns: MoodCheckIn[] = [
  {
    id: 'c1',
    date: '2026-08-28T15:40:00.000Z',
    emotions: ['Worried', 'Tired'],
    intensity: 4,
    place: 'School',
    before: 'The timetable changed and I did not know where to go.',
    triggers: ['Change of plan', 'Loud corridor'],
    sensory: ['Noise felt too much', 'Tight chest'],
    helped: ['Quiet space', 'Ear defenders'],
    need: 'A heads-up when things change.',
    note: 'After-school felt really heavy today.',
    sharing: 'shared',
    sharedWith: ['m-senco'],
  },
  {
    id: 'c2',
    date: '2026-08-27T08:15:00.000Z',
    emotions: ['Calm', 'Hopeful'],
    intensity: 2,
    place: 'Home',
    before: 'Had breakfast and knew the plan for the day.',
    triggers: [],
    sensory: ['Felt settled'],
    helped: ['Knowing the plan'],
    need: 'More mornings like this.',
    sharing: 'private',
    sharedWith: [],
  },
  {
    id: 'c3',
    date: '2026-08-25T15:30:00.000Z',
    emotions: ['Frustrated'],
    intensity: 3,
    place: 'School',
    before: 'Group work was noisy and fast.',
    triggers: ['Loud group work', 'Fast pace'],
    sensory: ['Noise felt too much'],
    helped: ['Working with one person'],
    need: 'A quieter way to do group tasks.',
    sharing: 'private',
    sharedWith: [],
  },
]

export const demoJournal: JournalEntry[] = [
  {
    id: 'j1',
    date: '2026-08-28T16:20:00.000Z',
    type: 'text',
    title: 'The corridor was too loud',
    body: 'When the bell went everyone rushed and it got really loud. I wish there was a few minutes before to get ready to move.',
    promptUsed: 'What would you like an adult to understand?',
    category: 'understand',
    sharing: 'shared',
    sharedWith: ['m-senco'],
    accessLog: [{ memberId: 'm-senco', at: '2026-08-28T17:02:00.000Z' }],
  },
  {
    id: 'j2',
    date: '2026-08-26T19:05:00.000Z',
    type: 'text',
    title: 'Proud of my drawing',
    body: 'I finished a big drawing of the sea. I worked on it for ages and did not give up.',
    promptUsed: 'What are you proud of today?',
    category: 'strength',
    sharing: 'private',
    sharedWith: [],
  },
  {
    id: 'j3',
    date: '2026-08-24T17:40:00.000Z',
    type: 'drawing',
    title: 'How today felt',
    body: 'A drawing of stormy clouds turning into calmer sky.',
    category: 'general',
    sharing: 'private',
    sharedWith: [],
  },
]

export const demoGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Feel calmer during changes at school',
    why: 'Changes make my chest tight and I want to feel more ready.',
    timescale: 'Over this half term',
    steps: [
      { id: 's1', label: 'Ask for the day plan each morning', done: true },
      { id: 's2', label: 'Use my quiet space card when I need it', done: true },
      { id: 's3', label: 'Try ear defenders in the busy corridor', done: false },
      { id: 's4', label: 'Tell Ms Okafor which changes are hardest', done: false },
    ],
    barriers: 'Sometimes I forget to ask, or it feels embarrassing.',
    supportNeeded: 'A reminder and a quiet way to show I need my card.',
    status: 'active',
    supporters: ['m-senco'],
  },
  {
    id: 'g2',
    title: 'Share one good thing each week',
    why: 'I want adults to see the things that go well too.',
    timescale: 'No rush',
    steps: [
      { id: 's1', label: 'Notice one good moment', done: true },
      { id: 's2', label: 'Write or draw it', done: false },
    ],
    status: 'paused',
    supporters: [],
  },
]

export const demoSupportPrefs: SupportPrefs = {
  enjoy: ['Drawing', 'Being near water', 'Building models'],
  strengths: ['Noticing detail', 'Kind to animals', 'Good memory for facts'],
  feelSafe: ['A quiet corner', 'Knowing the plan', 'A trusted adult nearby'],
  helpCommunicate: ['A bit of time to think', 'Writing instead of speaking sometimes'],
  sensory: ['Loud noise is hard', 'I like soft textures', 'Bright lights bother me'],
  difficult: ['Sudden changes', 'Busy corridors', 'Being rushed'],
  earlySigns: ['I go quiet', 'My chest feels tight', 'I fidget more'],
  helps: ['A calm voice', 'A heads-up before change', 'A quiet space'],
  makesHarder: ['Being told to hurry', 'Lots of questions at once'],
  calming: ['Breathing slowly', 'Drawing', 'Listening to soft sounds'],
  adjustments: ['A few minutes before moving rooms', 'A quiet space card'],
  approach: ['Talk to me calmly', 'Give me time', 'Ask, do not assume'],
}

export const demoSupportRequests: SupportRequest[] = [
  {
    id: 'r1',
    type: 'talk',
    sentTo: 'm-pastoral',
    createdAt: '2026-08-27T12:30:00.000Z',
    receivedAt: '2026-08-27T12:41:00.000Z',
    status: 'responded',
    note: 'Could we have a quick chat this week?',
    nextSteps: 'Mr Bright suggested meeting Thursday break in the Pastoral Office.',
  },
]

export const demoPatternFlags: PatternFlag[] = [
  {
    id: 'p1',
    summary:
      'Worried or overwhelmed feelings appear more often around unexpected changes to the timetable, mainly at school in the afternoon.',
    basis: '3 check-ins and 1 journal entry between 24–28 Aug mention changes and noise.',
    dateRange: '24–28 August 2026',
    status: 'awaiting-review',
  },
]

export const demoAudit: AuditEntry[] = [
  {
    id: 'a1',
    at: '2026-08-28T17:02:00.000Z',
    actor: 'Ms Okafor (SENCO)',
    action: 'Viewed shared journal entry',
    detail: '“The corridor was too loud” — human review recorded, wording unchanged.',
  },
  {
    id: 'a2',
    at: '2026-08-27T12:41:00.000Z',
    actor: 'Mr Bright (Pastoral worker)',
    action: 'Received support request',
    detail: '“I would like someone to talk to.”',
  },
  {
    id: 'a3',
    at: '2026-08-24T18:10:00.000Z',
    actor: 'Sam Carter (Parent / Carer)',
    action: 'Viewed shared goal',
    detail: '“Feel calmer during changes at school.”',
  },
]

// UI option lists (fixed, professionally-styled interface content)

export const EMOTION_OPTIONS: { label: string; token: string; face: string }[] = [
  { label: 'Happy', token: 'sun', face: '😊' },
  { label: 'Calm', token: 'mint', face: '😌' },
  { label: 'Hopeful', token: 'teal', face: '🙂' },
  { label: 'Okay', token: 'sky', face: '😐' },
  { label: 'Excited', token: 'sun', face: '🤩' },
  { label: 'Tired', token: 'lavender', face: '🥱' },
  { label: 'Worried', token: 'sky', face: '😟' },
  { label: 'Sad', token: 'sky', face: '😢' },
  { label: 'Frustrated', token: 'peach', face: '😤' },
  { label: 'Angry', token: 'peach', face: '😠' },
  { label: 'Overwhelmed', token: 'lavender', face: '😵‍💫' },
  { label: 'Unsure', token: 'muted', face: '🤔' },
]

export const TRIGGER_OPTIONS = [
  'Change of plan',
  'Loud noise',
  'Busy space',
  'Being rushed',
  'Too many questions',
  'Fell out with someone',
  'Tired',
  'Hungry',
  'New place',
  'Not sure',
]

export const SENSORY_OPTIONS = [
  'Noise felt too much',
  'Lights felt too bright',
  'Tight chest',
  'Wobbly tummy',
  'Wanted to move',
  'Wanted to be still',
  'Felt hot',
  'Felt settled',
]

export const HELPED_OPTIONS = [
  'Quiet space',
  'Ear defenders',
  'A trusted adult',
  'Deep breaths',
  'A short break',
  'Knowing the plan',
  'Drawing',
  'Music',
  'Nothing yet',
]

export const JOURNAL_PROMPTS = [
  'What happened today?',
  'How did it make you feel?',
  'What would you like an adult to understand?',
  'What helped, even a little?',
  'What are you proud of today?',
  'Would you like to keep this private or share it?',
  'Would you like support from someone in your Safe Circle?',
]

export const VIEWABLE_AREA_LABELS: Record<ViewableArea, string> = {
  'check-ins': 'Check-ins',
  journal: 'Journal',
  goals: 'Goals',
  'what-helps-me': 'What Helps Me',
  'support-requests': 'Support requests',
}

export const SUPPORT_REQUEST_LABELS: Record<SupportRequestType, string> = {
  talk: 'I would like someone to talk to',
  worried: 'Something is worrying me',
  'not-safe': 'I do not feel safe',
  'help-now': 'I need help now',
  'share-entry': 'I want to share an entry',
  'worried-other': 'I am worried about someone else',
  'wellbeing-check': 'A gentle check-in shared with your trusted adult',
}
