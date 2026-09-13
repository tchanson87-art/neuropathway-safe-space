import type { NpObservation } from './types'
import { DOMAIN_LABELS, SETTING_LABELS } from './types'

export const ENGINE_VERSION = 'np-engine-v0.2'

/**
 * Rolling aggregation window. The knowledge base defines a recurring need as
 * three or more occurrences within a 14-day window, so the engine measures
 * clustering inside this window rather than a raw lifetime count.
 */
export const WINDOW_DAYS = 14

/** Traffic-light risk band, mirroring the "needs-first" AI risk categorisation. */
export type RiskBand = 'green' | 'amber' | 'red'

/**
 * Recommended next step. Deliberately about the SEND support route, never a
 * clinical action. Urgent review is reserved for explicit safeguarding signals,
 * which this deterministic engine does not attempt to detect on its own.
 */
export type Escalation = 'monitor' | 'sen_support' | 'professional_review' | 'urgent_review'

export interface PatternCandidate {
  domain: string
  summary: string
  basis: string
  frequency: number
  occurrencesInWindow: number
  windowDays: number
  settings: string[]
  dateRangeStart: string | null
  dateRangeEnd: string | null
  confidence: 'low' | 'moderate' | 'high'
  riskBand: RiskBand
  escalation: Escalation
  sourceObservationIds: string[]
}

/**
 * Deterministic, explainable pattern detection.
 *
 * This is intentionally rules-based, not a black box: every candidate reports
 * exactly which observations produced it and uses cautious language. It never
 * diagnoses, never attributes intent, and never asserts causation. All output
 * is a candidate that requires authorised human review.
 */
export function detectPatterns(observations: NpObservation[]): PatternCandidate[] {
  const shared = observations.filter((o) => o.sharing === 'shared')
  const candidates: PatternCandidate[] = []

  // 1. Cross-setting sensory association (noise / crowding).
  const sensory = shared.filter(
    (o) =>
      o.domain === 'sensory' ||
      o.sensory_factors?.some((f) => ['noise', 'crowding', 'light'].includes(f)),
  )
  if (sensory.length >= 3) {
    const settings = uniqueSettings(sensory)
    const inWindow = maxInWindow(sensory, WINDOW_DAYS)
    const band = classify({ inWindow, settings: settings.length })
    candidates.push({
      domain: 'sensory',
      summary:
        'The available records suggest a repeated association between busy or noisy environments and reduced participation. This requires human review.',
      basis: `Derived from ${sensory.length} shared observations tagged with sensory factors across ${settings
        .map((s) => SETTING_LABELS[s] ?? s)
        .join(' and ')}. Up to ${inWindow} of these fell within a ${WINDOW_DAYS}-day window.`,
      frequency: sensory.length,
      occurrencesInWindow: inWindow,
      windowDays: WINDOW_DAYS,
      settings,
      ...dateRange(sensory),
      confidence: confidenceFor(band.riskBand),
      riskBand: band.riskBand,
      escalation: band.escalation,
      sourceObservationIds: sensory.map((o) => o.id),
    })
  }

  // 2. After-school collapse (school demand -> later home dysregulation).
  const afterSchool = shared.filter(
    (o) =>
      o.setting === 'home' &&
      o.domain === 'emotional_regulation' &&
      /after[- ]?school|collapse|withdrawn|meltdown/i.test(
        `${o.trigger ?? ''} ${o.behaviour ?? ''} ${o.activity ?? ''}`,
      ),
  )
  if (afterSchool.length >= 2) {
    const inWindow = maxInWindow(afterSchool, WINDOW_DAYS)
    const band = classify({ inWindow, settings: 1 })
    candidates.push({
      domain: 'emotional_regulation',
      summary:
        'A repeated association may be present between the end of the school day and later dysregulation at home. The evidence is currently limited; consider collecting more information across settings.',
      basis: `Derived from ${afterSchool.length} home observations describing distress or withdrawal shortly after school. Up to ${inWindow} fell within a ${WINDOW_DAYS}-day window.`,
      frequency: afterSchool.length,
      occurrencesInWindow: inWindow,
      windowDays: WINDOW_DAYS,
      settings: ['home'],
      ...dateRange(afterSchool),
      confidence: confidenceFor(band.riskBand),
      riskBand: band.riskBand,
      escalation: band.escalation,
      sourceObservationIds: afterSchool.map((o) => o.id),
    })
  }

  // 3. Consistently effective support strategy.
  const helped = shared.filter((o) => o.what_helped && o.what_helped.trim().length > 0)
  if (helped.length >= 3) {
    const inWindow = maxInWindow(helped, WINDOW_DAYS)
    candidates.push({
      domain: 'behavioural',
      summary:
        'A support strategy appears to have helped on several occasions. Human review can confirm whether this is worth formalising in a support plan.',
      basis: `Derived from ${helped.length} observations where a support response was recorded as helping.`,
      frequency: helped.length,
      occurrencesInWindow: inWindow,
      windowDays: WINDOW_DAYS,
      settings: uniqueSettings(helped),
      ...dateRange(helped),
      // A positive, protective pattern is never an escalation — always monitor/green.
      confidence: 'low',
      riskBand: 'green',
      escalation: 'monitor',
      sourceObservationIds: helped.map((o) => o.id),
    })
  }

  // 4. Increasing intensity over time within a domain.
  candidates.push(...escalationCandidates(shared))

  return candidates
}

function escalationCandidates(shared: NpObservation[]): PatternCandidate[] {
  const byDomain = new Map<string, NpObservation[]>()
  for (const o of shared) {
    if (!o.domain || o.intensity == null) continue
    const arr = byDomain.get(o.domain) ?? []
    arr.push(o)
    byDomain.set(o.domain, arr)
  }
  const out: PatternCandidate[] = []
  for (const [domain, obs] of byDomain) {
    if (obs.length < 4) continue
    const sorted = [...obs].sort(
      (a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime(),
    )
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2))
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2))
    const avg = (xs: NpObservation[]) =>
      xs.reduce((s, o) => s + (o.intensity ?? 0), 0) / (xs.length || 1)
    if (avg(secondHalf) > avg(firstHalf) + 0.5) {
      const settings = uniqueSettings(sorted)
      const inWindow = maxInWindow(sorted, WINDOW_DAYS)
      const band = classify({ inWindow, settings: settings.length, escalating: true })
      out.push({
        domain,
        summary: `The records suggest the intensity of ${(DOMAIN_LABELS[domain] ?? domain).toLowerCase()} responses may be increasing over time. This requires human review and may warrant collecting more evidence.`,
        basis: `Derived from ${sorted.length} observations in this domain, comparing earlier and more recent recorded intensity. Up to ${inWindow} occurred within a ${WINDOW_DAYS}-day window.`,
        frequency: sorted.length,
        occurrencesInWindow: inWindow,
        windowDays: WINDOW_DAYS,
        settings,
        ...dateRange(sorted),
        confidence: confidenceFor(band.riskBand),
        riskBand: band.riskBand,
        escalation: band.escalation,
        sourceObservationIds: sorted.map((o) => o.id),
      })
    }
  }
  return out
}

/**
 * Map objective signals to a traffic-light band. Cautious by design: a band
 * only rises to amber once the 14-day recurrence threshold is met, and to red
 * only when a rising trend also spans more than one setting.
 */
function classify(opts: {
  inWindow: number
  settings: number
  escalating?: boolean
}): { riskBand: RiskBand; escalation: Escalation } {
  const recurrent = opts.inWindow >= 3
  if (recurrent && opts.escalating && opts.settings > 1) {
    return { riskBand: 'red', escalation: 'professional_review' }
  }
  if (recurrent) {
    return { riskBand: 'amber', escalation: 'sen_support' }
  }
  return { riskBand: 'green', escalation: 'monitor' }
}

function confidenceFor(band: RiskBand): 'low' | 'moderate' | 'high' {
  if (band === 'red') return 'high'
  if (band === 'amber') return 'moderate'
  return 'low'
}

/** Largest number of observations that fall inside any rolling window of `days`. */
function maxInWindow(obs: NpObservation[], days: number): number {
  if (obs.length === 0) return 0
  const times = obs
    .map((o) => new Date(o.occurred_at).getTime())
    .sort((a, b) => a - b)
  const windowMs = days * 24 * 60 * 60 * 1000
  let best = 1
  let start = 0
  for (let end = 0; end < times.length; end++) {
    while (times[end] - times[start] > windowMs) start++
    best = Math.max(best, end - start + 1)
  }
  return best
}

function uniqueSettings(obs: NpObservation[]): string[] {
  return Array.from(new Set(obs.map((o) => o.setting))).sort()
}

function dateRange(obs: NpObservation[]): { dateRangeStart: string | null; dateRangeEnd: string | null } {
  if (obs.length === 0) return { dateRangeStart: null, dateRangeEnd: null }
  const times = obs.map((o) => new Date(o.occurred_at).getTime())
  return {
    dateRangeStart: new Date(Math.min(...times)).toISOString(),
    dateRangeEnd: new Date(Math.max(...times)).toISOString(),
  }
}
