// Professional portals (lenses) — role-specific EHCP questionnaires plus a pure,
// explainable interpretation of answers into functional behaviour patterns.
//
// Principles enforced here, per the NeuroPathway custom instructions:
//  - Needs first, not labels. Never diagnose. Describe functional impact.
//  - Zero hallucination. Only interpret questions that were actually answered.
//    Unanswered areas return "Insufficient evidence available", never a guess.
//  - Safeguarding first. A high answer to a safety-sensitive question raises a
//    SAFETY ALERT and an urgent escalation.
//
// This module is pure data + pure functions so it can run on the client for a
// live, transparent interpretation and on the server if persistence is added.

import type { NpDomain } from './types'
import { DOMAIN_LABELS } from './types'

export type LensId = 'health' | 'social_care' | 'camhs' | 'parent'

export interface LensQuestion {
  id: string
  text: string
  domain: NpDomain
  helper?: string
  /** Safety-sensitive: a high answer triggers a safeguarding alert + urgent review. */
  safetySensitive?: boolean
}

export interface LensDef {
  id: LensId
  label: string
  shortLabel: string
  /** This professional's specific purpose — what they are here to understand. */
  purpose: string
  /** What this lens reads the answers *for*. */
  reads: string
  /** Design token used for accenting this lens. */
  token: 'teal' | 'sky' | 'lavender' | 'peach' | 'mint'
  domains: NpDomain[]
  questions: LensQuestion[]
}

/** Shared 0–4 frequency/impact scale shown for every question. */
export const ANSWER_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Not seen' },
  { value: 1, label: 'Occasionally' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Most days' },
]

export const LENSES: Record<LensId, LensDef> = {
  health: {
    id: 'health',
    label: 'Health care',
    shortLabel: 'Health',
    purpose:
      'Understand how physical health — sleep, eating, continence, motor skills and medical-sensory needs — affects this child’s everyday functioning.',
    reads:
      'Health care reads the answers for physical-health contributors that may sit underneath distress or behaviour, so the health need is addressed first.',
    token: 'teal',
    domains: ['daily_living', 'sensory', 'emotional_regulation', 'behavioural'],
    questions: [
      { id: 'h_sleep', text: 'How often is the child affected by disrupted sleep or daytime tiredness?', domain: 'daily_living' },
      { id: 'h_eating', text: 'How often do eating, appetite or mealtime difficulties affect the child?', domain: 'daily_living' },
      { id: 'h_continence', text: 'How often do toileting or continence needs affect participation?', domain: 'daily_living' },
      { id: 'h_motor', text: 'How often do motor or coordination difficulties affect tasks (handwriting, PE, dressing)?', domain: 'daily_living' },
      { id: 'h_sensory', text: 'How often does sensory sensitivity (noise, light, touch, pain) affect the child?', domain: 'sensory' },
      { id: 'h_discomfort', text: 'How often does physical discomfort or illness lead to distress or dysregulation?', domain: 'emotional_regulation' },
    ],
  },
  social_care: {
    id: 'social_care',
    label: 'Social care',
    shortLabel: 'Social care',
    purpose:
      'Understand how the home environment, routines, relationships and daily living shape the child’s needs, and what early help would strengthen.',
    reads:
      'Social care reads the answers for unmet needs and family stress that early help could ease before difficulties escalate.',
    token: 'peach',
    domains: ['daily_living', 'social_interaction', 'emotional_regulation', 'behavioural'],
    questions: [
      { id: 's_routines', text: 'How often are home routines (mornings, mealtimes, bedtime) hard to keep consistent?', domain: 'daily_living' },
      { id: 's_relationships', text: 'How often is the child in conflict with, or withdrawn from, family members?', domain: 'social_interaction' },
      { id: 's_change', text: 'How often do changes at home or in care arrangements unsettle the child?', domain: 'emotional_regulation' },
      { id: 's_selfcare', text: 'How often does the child need extra support with everyday self-care for their age?', domain: 'daily_living' },
      { id: 's_network', text: 'How often does the family feel without support when things are hard?', domain: 'daily_living' },
      { id: 's_safety', text: 'How often are there worries about the child’s safety or wellbeing at home?', domain: 'behavioural', safetySensitive: true },
    ],
  },
  camhs: {
    id: 'camhs',
    label: 'CAMHS',
    shortLabel: 'CAMHS',
    purpose:
      'Understand emotional wellbeing, anxiety, mood, coping and safety so the right level of mental-health support can be matched early.',
    reads:
      'CAMHS reads the answers for emotional-wellbeing and risk signals, to triage the right tier of support before crisis.',
    token: 'lavender',
    domains: ['emotional_regulation', 'social_interaction', 'behavioural', 'communication'],
    questions: [
      { id: 'c_anxiety', text: 'How often does worry or anxiety stop the child doing things?', domain: 'emotional_regulation' },
      { id: 'c_mood', text: 'How often does the child seem low, flat or tearful?', domain: 'emotional_regulation' },
      { id: 'c_escalation', text: 'How often do emotions escalate quickly and take a long time to settle?', domain: 'emotional_regulation' },
      { id: 'c_withdrawal', text: 'How often does the child withdraw from friends or activities they used to enjoy?', domain: 'social_interaction' },
      { id: 'c_sleepappetite', text: 'How often have sleep or appetite changed alongside mood?', domain: 'behavioural' },
      { id: 'c_hopeless', text: 'How often does the child express hopelessness or talk about not wanting to be here?', domain: 'emotional_regulation', safetySensitive: true, helper: 'A high answer here is treated as a safeguarding priority.' },
    ],
  },
  parent: {
    id: 'parent',
    label: 'Parents & carers',
    shortLabel: 'Parents',
    purpose:
      'Share what everyday life is like at home — the strengths, the triggers and what helps — so professionals build support around the whole child.',
    reads:
      'The parent view reads the answers for everyday functional impact at home, giving professionals the home picture alongside school and clinic.',
    token: 'sky',
    domains: ['emotional_regulation', 'sensory', 'communication', 'social_interaction', 'daily_living'],
    questions: [
      { id: 'p_transitions', text: 'How often are transitions (leaving the house, stopping an activity) hard at home?', domain: 'emotional_regulation' },
      { id: 'p_sensory', text: 'How often do noise, textures, food or clothing cause distress at home?', domain: 'sensory' },
      { id: 'p_communication', text: 'How often does your child find it hard to tell you what they need?', domain: 'communication' },
      { id: 'p_friendships', text: 'How often does your child find playing or getting on with others hard?', domain: 'social_interaction' },
      { id: 'p_dailyliving', text: 'How often does your child need extra help with everyday tasks (dressing, eating, organising)?', domain: 'daily_living' },
      { id: 'p_afterschool', text: 'How often does your child struggle to cope after school (meltdowns, shutdown, exhaustion)?', domain: 'emotional_regulation' },
    ],
  },
}

export const LENS_ORDER: LensId[] = ['health', 'social_care', 'camhs', 'parent']

export function isLensId(value: string): value is LensId {
  return (LENS_ORDER as string[]).includes(value)
}

const FUNCTIONAL_IMPACT: Record<NpDomain, string> = {
  emotional_regulation: 'Affects how the child copes with demands and transitions, and how long they take to recover after distress.',
  sensory: 'Affects comfort, attention and participation in everyday environments.',
  communication: 'Affects how needs are expressed and understood, and access to learning and relationships.',
  social_interaction: 'Affects friendships, group participation and a sense of belonging.',
  learning_executive: 'Affects attention, organisation and completing everyday tasks.',
  behavioural: 'Affects participation and often signals an unmet need underneath the behaviour.',
  daily_living: 'Affects independence and everyday routines at home and at school.',
  strengths: 'Highlights what the child does well and what helps — build support around these, not just needs.',
}

// Recommended support framed to each lens's own purpose. Falls back to a
// domain-generic suggestion if a specific pairing is not defined.
const SUPPORT: Partial<Record<`${LensId}:${NpDomain}`, string>> = {
  'health:daily_living': 'Share sleep, eating and continence patterns with the GP or school nurse; consider a health-care plan and simple daily-living adjustments.',
  'health:sensory': 'A sensory-aware environment and OT advice can reduce physical distress; record pain or discomfort triggers for the paediatric team.',
  'health:emotional_regulation': 'Check whether discomfort or fatigue underlies distress; address the health need first and review regulation afterwards.',
  'health:behavioural': 'Rule physical-health contributors in or out before behavioural strategies; record timing against health events.',
  'social_care:daily_living': 'Early-help support around routines and self-care; practical family support and a Team Around the Family conversation.',
  'social_care:social_interaction': 'Family-relationship support and modelling; consider mentoring or group provision through early help.',
  'social_care:emotional_regulation': 'Predictable routines and stability; support the family through change and transitions at home.',
  'social_care:behavioural': 'Assess the unmet need behind the behaviour; strengthen the family support network and review safety.',
  'camhs:emotional_regulation': 'Match to the right tier of emotional-wellbeing support; low-intensity anxiety/mood work and coping-skill building.',
  'camhs:social_interaction': 'Support gradual re-engagement with peers and activities; treat withdrawal as an early indicator.',
  'camhs:behavioural': 'Monitor sleep and appetite changes alongside mood; review if changes persist.',
  'camhs:communication': 'Offer non-verbal ways to express distress so the child can signal when they are struggling.',
  'parent:emotional_regulation': 'Predictable transitions and a calm after-school wind-down; share what helps at home with school.',
  'parent:sensory': 'Reduce known sensory triggers at home and tell the team which ones matter most.',
  'parent:communication': 'Use your child’s preferred ways to communicate and agree consistent approaches with school.',
  'parent:social_interaction': 'Low-pressure play and friendship opportunities; celebrate small social wins.',
  'parent:daily_living': 'Break everyday tasks into small steps and build independence gradually.',
}

export type EvidenceStrength = 'low' | 'moderate' | 'high'
export type RiskBand = 'green' | 'amber' | 'red'
export type Escalation = 'monitor' | 'sen_support' | 'professional_review' | 'urgent_review'

export interface DomainInterpretation {
  domain: NpDomain
  label: string
  answeredCount: number
  contributing: number
  avg: number
  frequencyWord: string
  severityWord: string
  observedNeed: string
  functionalImpact: string
  recommendedSupport: string
  evidenceStrength: EvidenceStrength
  riskBand: RiskBand
  escalation: Escalation
  safety: boolean
}

export interface InterpretationResult {
  answered: number
  total: number
  concerns: DomainInterpretation[]
  goingWell: { domain: NpDomain; label: string }[]
  safetyAlert: boolean
  /** Highest escalation across all concern domains, for a headline. */
  headlineEscalation: Escalation | null
}

const FREQ_WORDS = ['not seen', 'occasional', 'intermittent', 'frequent', 'near-daily']

function frequencyWord(avg: number): string {
  if (avg >= 3.5) return FREQ_WORDS[4]
  if (avg >= 2.5) return FREQ_WORDS[3]
  if (avg >= 1.5) return FREQ_WORDS[2]
  if (avg >= 0.5) return FREQ_WORDS[1]
  return FREQ_WORDS[0]
}

function severityWord(avg: number): string {
  if (avg >= 2.75) return 'significant'
  if (avg >= 1.5) return 'moderate'
  return 'mild'
}

const ESCALATION_RANK: Record<Escalation, number> = {
  monitor: 0,
  sen_support: 1,
  professional_review: 2,
  urgent_review: 3,
}

/**
 * Interpret answered questions into functional patterns for this lens.
 * `answers` maps questionId -> 0..4. Missing keys are treated as unanswered
 * and never inferred.
 */
export function interpretResponses(
  lensId: LensId,
  answers: Record<string, number | undefined>,
): InterpretationResult {
  const lens = LENSES[lensId]
  const total = lens.questions.length
  const answered = lens.questions.filter((q) => typeof answers[q.id] === 'number').length

  const concerns: DomainInterpretation[] = []
  const goingWell: { domain: NpDomain; label: string }[] = []
  let safetyAlert = false

  for (const domain of lens.domains) {
    const domainQuestions = lens.questions.filter((q) => q.domain === domain)
    const answeredValues = domainQuestions
      .map((q) => ({ q, v: answers[q.id] }))
      .filter((x): x is { q: LensQuestion; v: number } => typeof x.v === 'number')

    // Zero-hallucination: no answered question in this domain → no interpretation.
    if (answeredValues.length === 0) continue

    const maxValue = Math.max(...answeredValues.map((x) => x.v))
    const label = DOMAIN_LABELS[domain] ?? domain

    if (maxValue === 0) {
      goingWell.push({ domain, label })
      continue
    }

    const sum = answeredValues.reduce((acc, x) => acc + x.v, 0)
    const avg = sum / answeredValues.length
    const contributing = answeredValues.filter((x) => x.v >= 2).length
    const domainSafety = answeredValues.some((x) => x.q.safetySensitive && x.v >= 3)
    if (domainSafety) safetyAlert = true

    const freq = frequencyWord(avg)
    const sev = severityWord(avg)

    let riskBand: RiskBand = avg >= 2.75 ? 'red' : avg >= 1.5 ? 'amber' : 'green'
    let evidenceStrength: EvidenceStrength =
      contributing >= 3 && avg >= 2.75 ? 'high' : contributing >= 2 && avg >= 1.5 ? 'moderate' : 'low'
    let escalation: Escalation =
      riskBand === 'red' && contributing >= 2
        ? 'professional_review'
        : riskBand === 'amber'
          ? 'sen_support'
          : 'monitor'

    if (domainSafety) {
      riskBand = 'red'
      escalation = 'urgent_review'
      evidenceStrength = evidenceStrength === 'low' ? 'moderate' : evidenceStrength
    }

    concerns.push({
      domain,
      label,
      answeredCount: answeredValues.length,
      contributing,
      avg,
      frequencyWord: freq,
      severityWord: sev,
      observedNeed: domainSafety
        ? `A safety-sensitive answer was recorded in ${label.toLowerCase()}. This is treated as a safeguarding priority, not a diagnosis.`
        : `Support needs around ${label.toLowerCase()} — reported as ${freq} with ${sev} functional impact across ${answeredValues.length} answered question${answeredValues.length === 1 ? '' : 's'}.`,
      functionalImpact: FUNCTIONAL_IMPACT[domain],
      recommendedSupport: SUPPORT[`${lensId}:${domain}`] ?? `Review ${label.toLowerCase()} support with the team and record what helps.`,
      evidenceStrength,
      riskBand,
      escalation,
      safety: domainSafety,
    })
  }

  // Order concerns by escalation, then severity.
  concerns.sort(
    (a, b) => ESCALATION_RANK[b.escalation] - ESCALATION_RANK[a.escalation] || b.avg - a.avg,
  )

  const headlineEscalation =
    concerns.length > 0
      ? concerns.reduce<Escalation>(
          (top, c) => (ESCALATION_RANK[c.escalation] > ESCALATION_RANK[top] ? c.escalation : top),
          'monitor',
        )
      : null

  return { answered, total, concerns, goingWell, safetyAlert, headlineEscalation }
}
