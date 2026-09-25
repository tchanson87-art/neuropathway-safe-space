// The everyday check-in: a short, optional, conversational questionnaire.
// One question at a time, simple words, emoji + large buttons. Questions rotate
// day to day so it feels like a chat, not the same form every time.
//
// Nothing here diagnoses anything. Answers only ever describe how a day felt,
// in the young person's own words, and the young person chooses who (if anyone)
// can see them.

import type { MoodCheckIn } from '@/lib/safe-space'

export type AnswerTone = 'good' | 'ok' | 'hard'

export type EverydayOption = {
  value: string
  label: string
  emoji: string
  tone: AnswerTone
  /** Safety-sensitive answer — triggers gentle "reach a trusted adult" guidance. */
  alert?: boolean
}

/** Which part of the day a question is about — also used to build the summary. */
export type EverydayTopic =
  | 'feeling'
  | 'sleep'
  | 'energy'
  | 'school'
  | 'friends'
  | 'worries'
  | 'sensory'
  | 'went-well'
  | 'difficult'
  | 'tomorrow'

export type EverydayQuestion = {
  id: EverydayTopic
  chip: string
  prompt: string
  helper?: string
  options: EverydayOption[]
}

// Shared "I'm not sure" answer, offered on every question alongside a Skip control.
export const UNSURE: EverydayOption = {
  value: 'unsure',
  label: "I'm not sure",
  emoji: '🤔',
  tone: 'ok',
}

const FEELING: EverydayQuestion = {
  id: 'feeling',
  chip: 'Right now',
  prompt: 'How are you feeling right now?',
  helper: 'There is no wrong answer. Pick the one that fits best.',
  options: [
    { value: 'Happy', label: 'Good', emoji: '😊', tone: 'good' },
    { value: 'Calm', label: 'Calm', emoji: '😌', tone: 'good' },
    { value: 'Okay', label: 'Okay', emoji: '😐', tone: 'ok' },
    { value: 'Worried', label: 'Worried', emoji: '😟', tone: 'hard' },
    { value: 'Sad', label: 'Sad', emoji: '😢', tone: 'hard' },
    { value: 'Overwhelmed', label: 'Too much', emoji: '😵‍💫', tone: 'hard' },
  ],
}

const TOMORROW: EverydayQuestion = {
  id: 'tomorrow',
  chip: 'Tomorrow',
  prompt: 'What might help tomorrow feel a bit easier?',
  helper: 'Even a tiny thing counts.',
  options: [
    { value: 'Knowing the plan', label: 'Knowing the plan', emoji: '🗒️', tone: 'good' },
    { value: 'A quiet space', label: 'A quiet space', emoji: '🤫', tone: 'good' },
    { value: 'A trusted adult nearby', label: 'Someone nearby', emoji: '🧑‍🤝‍🧑', tone: 'good' },
    { value: 'A break', label: 'A break', emoji: '⏳', tone: 'good' },
    { value: 'More sleep', label: 'More sleep', emoji: '😴', tone: 'good' },
  ],
}

// Rotating middle questions — a different mix appears each day.
const ROTATING: EverydayQuestion[] = [
  {
    id: 'sleep',
    chip: 'Sleep',
    prompt: 'How did you sleep last night?',
    options: [
      { value: 'Slept well', label: 'Really well', emoji: '😴', tone: 'good' },
      { value: 'Okay sleep', label: 'Okay', emoji: '🙂', tone: 'ok' },
      { value: 'Kept waking', label: 'Kept waking', emoji: '😕', tone: 'hard' },
      { value: 'Barely slept', label: 'Barely slept', emoji: '😩', tone: 'hard' },
    ],
  },
  {
    id: 'energy',
    chip: 'Energy',
    prompt: 'How is your energy today?',
    options: [
      { value: 'Lots of energy', label: 'Lots', emoji: '⚡', tone: 'good' },
      { value: 'Enough energy', label: 'Enough', emoji: '🙂', tone: 'ok' },
      { value: 'Running low', label: 'Running low', emoji: '🔋', tone: 'hard' },
      { value: 'Really tired', label: 'Really tired', emoji: '🥱', tone: 'hard' },
    ],
  },
  {
    id: 'school',
    chip: 'School',
    prompt: 'How did school feel today?',
    helper: 'If you were not at school, pick whatever fits your day.',
    options: [
      { value: 'School was good', label: 'Good', emoji: '🌟', tone: 'good' },
      { value: 'School was okay', label: 'Okay', emoji: '🙂', tone: 'ok' },
      { value: 'School was tricky', label: 'A bit tricky', emoji: '😬', tone: 'hard' },
      { value: 'School was really hard', label: 'Really hard', emoji: '😣', tone: 'hard' },
    ],
  },
  {
    id: 'friends',
    chip: 'Friends',
    prompt: 'How were things with friends today?',
    options: [
      { value: 'Good with friends', label: 'Good', emoji: '😄', tone: 'good' },
      { value: 'Quiet day', label: 'Quiet', emoji: '🙂', tone: 'ok' },
      { value: 'Felt left out', label: 'Left out', emoji: '😔', tone: 'hard' },
      { value: 'Fell out with someone', label: 'Fell out', emoji: '💔', tone: 'hard' },
    ],
  },
  {
    id: 'worries',
    chip: 'Worries',
    prompt: 'Is anything worrying you right now?',
    helper: 'You can share as little or as much as you like.',
    options: [
      { value: 'No worries today', label: 'Not really', emoji: '😊', tone: 'good' },
      { value: 'A small worry', label: 'A small worry', emoji: '🤏', tone: 'ok' },
      { value: 'A big worry', label: 'A big worry', emoji: '😟', tone: 'hard' },
      { value: 'It feels too much', label: 'It feels too much', emoji: '😰', tone: 'hard', alert: true },
    ],
  },
  {
    id: 'sensory',
    chip: 'Your body',
    prompt: 'Did anything feel too much for your body today?',
    helper: 'Like loud noise, bright lights, or busy places.',
    options: [
      { value: 'Felt comfortable', label: 'Felt fine', emoji: '😌', tone: 'good' },
      { value: 'Noise felt too much', label: 'Too loud', emoji: '🔊', tone: 'hard' },
      { value: 'Lights felt too bright', label: 'Too bright', emoji: '💡', tone: 'hard' },
      { value: 'Too busy and crowded', label: 'Too busy', emoji: '🌀', tone: 'hard' },
    ],
  },
  {
    id: 'went-well',
    chip: 'Good bit',
    prompt: 'What went well today, even a little?',
    helper: 'Small good things count too.',
    options: [
      { value: 'Something I enjoyed', label: 'Enjoyed something', emoji: '🎨', tone: 'good' },
      { value: 'Someone was kind', label: 'Someone was kind', emoji: '💛', tone: 'good' },
      { value: 'I tried something hard', label: 'Tried something hard', emoji: '💪', tone: 'good' },
      { value: 'A calm moment', label: 'A calm moment', emoji: '🌿', tone: 'good' },
    ],
  },
  {
    id: 'difficult',
    chip: 'Tricky bit',
    prompt: 'Was anything difficult today?',
    options: [
      { value: 'Nothing too hard', label: 'Not really', emoji: '🙂', tone: 'good' },
      { value: 'A change of plan', label: 'A change of plan', emoji: '🔀', tone: 'hard' },
      { value: 'Being rushed', label: 'Being rushed', emoji: '⏱️', tone: 'hard' },
      { value: 'Too many questions', label: 'Too many questions', emoji: '❓', tone: 'hard' },
    ],
  },
]

/**
 * Build today's flow: always open with feelings and close with "what might help
 * tomorrow", with a rotating handful of middle questions in between so the
 * check-in feels like a conversation rather than the same form each day.
 */
export function buildEverydayFlow(date = new Date()): EverydayQuestion[] {
  // Day-of-year offset gives a stable-per-day but varied selection.
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000)
  const count = ROTATING.length
  const howMany = 4
  const middle: EverydayQuestion[] = []
  for (let i = 0; i < howMany; i++) {
    middle.push(ROTATING[(dayOfYear + i) % count])
  }
  return [FEELING, ...middle, TOMORROW]
}

export type EverydayAnswers = Record<string, EverydayOption | 'skipped'>

/** True if any given answer is safety-sensitive. */
export function answersRaiseSafety(answers: EverydayAnswers): boolean {
  return Object.values(answers).some((a) => a !== 'skipped' && a.alert === true)
}

const TONE_INTENSITY: Record<AnswerTone, number> = { good: 2, ok: 3, hard: 4 }

/**
 * Map the conversational answers onto the existing MoodCheckIn shape so the
 * everyday check-in shows up in the mood calendar and gentle reflection exactly
 * like any other check-in — no separate storage, no lost data.
 */
export function answersToCheckIn(
  questions: EverydayQuestion[],
  answers: EverydayAnswers,
  sharing: MoodCheckIn['sharing'],
  sharedWith: string[],
): Omit<MoodCheckIn, 'id' | 'date'> {
  const emotions: string[] = []
  const sensory: string[] = []
  const helped: string[] = []
  const triggers: string[] = []
  const noteParts: string[] = []
  let intensity = 3

  for (const q of questions) {
    const a = answers[q.id]
    if (!a || a === 'skipped' || a.value === 'unsure') continue

    if (q.id === 'feeling') {
      emotions.push(a.value)
      intensity = TONE_INTENSITY[a.tone]
    } else if (q.id === 'sensory' && a.tone === 'hard') {
      sensory.push(a.value)
    } else if (q.id === 'difficult' && a.tone === 'hard') {
      triggers.push(a.value)
    } else if (q.id === 'tomorrow' || q.id === 'went-well') {
      helped.push(a.value)
    }
    noteParts.push(`${q.chip}: ${a.label}`)
  }

  return {
    emotions: emotions.length ? emotions : ['Okay'],
    intensity,
    triggers,
    sensory,
    helped,
    note: noteParts.join(' · ') || undefined,
    sharing,
    sharedWith,
  }
}
