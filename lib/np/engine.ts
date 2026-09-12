import type { NpObservation } from './types'
import { DOMAIN_LABELS, SETTING_LABELS } from './types'

export const ENGINE_VERSION = 'np-engine-v0.1'

export interface PatternCandidate {
  domain: string
  summary: string
  basis: string
  frequency: number
  settings: string[]
  dateRangeStart: string | null
  dateRangeEnd: string | null
  confidence: 'low' | 'moderate' | 'high'
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
    candidates.push({
      domain: 'sensory',
      summary:
        'The available records suggest a repeated association between busy or noisy environments and reduced participation. This requires human review.',
      basis: `Derived from ${sensory.length} shared observations tagged with sensory factors across ${settings
        .map((s) => SETTING_LABELS[s] ?? s)
        .join(' and ')}.`,
      frequency: sensory.length,
      settings,
      ...dateRange(sensory),
      confidence: settings.length > 1 && sensory.length >= 4 ? 'moderate' : 'low',
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
    candidates.push({
      domain: 'emotional_regulation',
      summary:
        'A repeated association may be present between the end of the school day and later dysregulation at home. The evidence is currently limited; consider collecting more information across settings.',
      basis: `Derived from ${afterSchool.length} home observations describing distress or withdrawal shortly after school.`,
      frequency: afterSchool.length,
      settings: ['home'],
      ...dateRange(afterSchool),
      confidence: 'low',
      sourceObservationIds: afterSchool.map((o) => o.id),
    })
  }

  // 3. Consistently effective support strategy.
  const helped = shared.filter((o) => o.what_helped && o.what_helped.trim().length > 0)
  if (helped.length >= 3) {
    candidates.push({
      domain: 'behavioural',
      summary:
        'A support strategy appears to have helped on several occasions. Human review can confirm whether this is worth formalising in a support plan.',
      basis: `Derived from ${helped.length} observations where a support response was recorded as helping.`,
      frequency: helped.length,
      settings: uniqueSettings(helped),
      ...dateRange(helped),
      confidence: 'low',
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
      out.push({
        domain,
        summary: `The records suggest the intensity of ${(DOMAIN_LABELS[domain] ?? domain).toLowerCase()} responses may be increasing over time. This requires human review and may warrant collecting more evidence.`,
        basis: `Derived from ${sorted.length} observations in this domain, comparing earlier and more recent recorded intensity.`,
        frequency: sorted.length,
        settings: uniqueSettings(sorted),
        ...dateRange(sorted),
        confidence: 'low',
        sourceObservationIds: sorted.map((o) => o.id),
      })
    }
  }
  return out
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
