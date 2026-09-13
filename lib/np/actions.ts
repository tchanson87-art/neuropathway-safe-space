'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getViewer, audit, listObservations } from './data'
import { detectPatterns, ENGINE_VERSION } from './engine'

export interface ActionResult {
  ok: boolean
  error?: string
}

function str(form: FormData, key: string): string | null {
  const v = form.get(key)
  if (typeof v !== 'string' || v.trim() === '') return null
  return v.trim()
}

function arr(form: FormData, key: string): string[] {
  return form
    .getAll(key)
    .filter((v): v is string => typeof v === 'string' && v.trim() !== '')
}

export async function createObservation(childId: string, form: FormData): Promise<ActionResult> {
  const viewer = await getViewer()
  if (!viewer) return { ok: false, error: 'You must be signed in.' }
  const behaviour = str(form, 'behaviour')
  const setting = str(form, 'setting')
  if (!behaviour || !setting) return { ok: false, error: 'Setting and what happened are required.' }

  const supabase = await createClient()
  const intensityRaw = str(form, 'intensity')
  const durationRaw = str(form, 'duration_minutes')
  const { error } = await supabase.from('np_observations').insert({
    child_id: childId,
    observer_id: viewer.id,
    observer_role: viewer.role,
    setting,
    occurred_at: str(form, 'occurred_at') ?? new Date().toISOString(),
    activity: str(form, 'activity'),
    antecedent: str(form, 'antecedent'),
    behaviour,
    child_communicated: str(form, 'child_communicated'),
    trigger: str(form, 'trigger'),
    sensory_factors: arr(form, 'sensory_factors'),
    emotional_state: str(form, 'emotional_state'),
    duration_minutes: durationRaw ? Number(durationRaw) : null,
    intensity: intensityRaw ? Number(intensityRaw) : null,
    support_given: str(form, 'support_given'),
    what_helped: str(form, 'what_helped'),
    what_did_not_help: str(form, 'what_did_not_help'),
    impact_area: arr(form, 'impact_area'),
    child_view: str(form, 'child_view'),
    domain: str(form, 'domain'),
    sharing: str(form, 'sharing') === 'private' ? 'private' : 'shared',
  })
  if (error) return { ok: false, error: error.message }

  // Mirror into the evidence store so it joins the chronology.
  await supabase.from('np_evidence_items').insert({
    child_id: childId,
    author_id: viewer.id,
    author_role: viewer.role,
    record_type: 'observation',
    source: 'neuropathway',
    title: `${setting} observation`,
    body: behaviour,
    event_date: str(form, 'occurred_at') ?? new Date().toISOString(),
    sharing: str(form, 'sharing') === 'private' ? 'private' : 'shared',
  })

  await audit('observation.create', { childId, role: viewer.role, detail: setting })
  revalidatePath(`/pro/children/${childId}`)
  revalidatePath(`/pro/children/${childId}/observations`)
  return { ok: true }
}

/** Run the explainable engine and persist any NEW candidate patterns. */
export async function runEngine(childId: string): Promise<ActionResult> {
  const viewer = await getViewer()
  if (!viewer) return { ok: false, error: 'You must be signed in.' }
  const supabase = await createClient()

  const observations = await listObservations(childId)
  const candidates = detectPatterns(observations)

  // Avoid duplicating existing candidates for the same domain still awaiting review.
  const { data: existing } = await supabase
    .from('np_patterns')
    .select('domain, status')
    .eq('child_id', childId)
  const openDomains = new Set(
    (existing ?? [])
      .filter((p) => p.status === 'awaiting_review' || p.status === 'needs_evidence')
      .map((p) => p.domain),
  )

  const evidence = await supabase
    .from('np_evidence_items')
    .select('id, source_ref, source, sharing')
    .eq('child_id', childId)

  let created = 0
  for (const c of candidates) {
    if (openDomains.has(c.domain)) continue
    const { data: inserted, error } = await supabase
      .from('np_patterns')
      .insert({
        child_id: childId,
        domain: c.domain,
        summary: c.summary,
        basis: c.basis,
        frequency: c.frequency,
        occurrences_in_window: c.occurrencesInWindow,
        window_days: c.windowDays,
        settings: c.settings,
        date_range_start: c.dateRangeStart,
        date_range_end: c.dateRangeEnd,
        confidence: c.confidence,
        risk_band: c.riskBand,
        escalation: c.escalation,
        status: 'awaiting_review',
        is_ai_assisted: true,
        model_version: ENGINE_VERSION,
      })
      .select('id')
      .single()
    if (error || !inserted) continue
    created++

    // Link supporting evidence: any evidence item whose source_ref is one of the
    // source observations, plus consented shared Safe Space entries for sensory.
    const links = (evidence.data ?? [])
      .filter(
        (e) =>
          (e.source_ref && c.sourceObservationIds.includes(e.source_ref)) ||
          (c.domain === 'sensory' && e.source === 'safe_space' && e.sharing === 'shared'),
      )
      .map((e) => ({ pattern_id: inserted.id, evidence_id: e.id }))
    if (links.length > 0) {
      await supabase.from('np_pattern_evidence').insert(links)
    }
  }

  // Provenance: record that the deterministic engine ran, with its version.
  await supabase.from('ai_outputs').insert({
    surface: 'pro',
    output_type: 'pattern_engine',
    child_id: childId,
    engine_version: ENGINE_VERSION,
    safety_alert: false,
    summary: `${created} new candidate(s) from ${observations.length} observations`,
    meta: {
      candidates: candidates.length,
      bands: candidates.reduce<Record<string, number>>((acc, c) => {
        acc[c.riskBand] = (acc[c.riskBand] ?? 0) + 1
        return acc
      }, {}),
    },
  })

  await audit('pattern.generate', {
    childId,
    role: viewer.role,
    detail: `${created} new candidate(s) from ${observations.length} observations`,
  })
  revalidatePath(`/pro/children/${childId}/patterns`)
  revalidatePath(`/pro/children/${childId}`)
  return { ok: true }
}

export async function reviewPattern(
  patternId: string,
  childId: string,
  form: FormData,
): Promise<ActionResult> {
  const viewer = await getViewer()
  if (!viewer) return { ok: false, error: 'You must be signed in.' }
  const decision = str(form, 'decision')
  if (!decision || !['accepted', 'rejected', 'amended', 'needs_evidence'].includes(decision)) {
    return { ok: false, error: 'Please choose a decision.' }
  }
  const supabase = await createClient()
  const amended = str(form, 'amended_summary')

  const { error } = await supabase.from('np_pattern_reviews').insert({
    pattern_id: patternId,
    reviewer_id: viewer.id,
    decision,
    reasoning: str(form, 'reasoning'),
    amended_summary: amended,
  })
  if (error) return { ok: false, error: error.message }

  const patternUpdate: Record<string, unknown> = { status: decision }
  if (decision === 'amended' && amended) patternUpdate.summary = amended
  await supabase.from('np_patterns').update(patternUpdate).eq('id', patternId)

  await audit('pattern.review', { childId, role: viewer.role, detail: `${decision} (${patternId})` })
  revalidatePath(`/pro/children/${childId}/patterns`)
  revalidatePath(`/pro/children/${childId}`)
  return { ok: true }
}

export async function createSupportPlan(childId: string, form: FormData): Promise<ActionResult> {
  const viewer = await getViewer()
  if (!viewer) return { ok: false, error: 'You must be signed in.' }
  const need = str(form, 'identified_need')
  const outcome = str(form, 'desired_outcome')
  if (!need || !outcome) return { ok: false, error: 'Need and desired outcome are required.' }

  const supabase = await createClient()
  const { error } = await supabase.from('np_support_plans').insert({
    child_id: childId,
    identified_need: need,
    supporting_pattern_id: str(form, 'supporting_pattern_id'),
    child_strengths: str(form, 'child_strengths'),
    child_view: str(form, 'child_view'),
    desired_outcome: outcome,
    responsible_person: str(form, 'responsible_person'),
    created_by: viewer.id,
    status: 'active',
  })
  if (error) return { ok: false, error: error.message }
  await audit('support_plan.create', { childId, role: viewer.role, detail: need })
  revalidatePath(`/pro/children/${childId}/plans`)
  revalidatePath(`/pro/children/${childId}`)
  return { ok: true }
}

export async function saveEhcpSections(
  childId: string,
  draftId: string,
  sections: Record<string, string>,
): Promise<ActionResult> {
  const viewer = await getViewer()
  if (!viewer) return { ok: false, error: 'You must be signed in.' }
  const supabase = await createClient()
  const { error } = await supabase
    .from('np_ehcp_drafts')
    .update({ sections, updated_at: new Date().toISOString() })
    .eq('id', draftId)
  if (error) return { ok: false, error: error.message }
  await audit('ehcp.edit', { childId, role: viewer.role, detail: `draft ${draftId}` })
  revalidatePath(`/pro/children/${childId}/ehcp`)
  return { ok: true }
}
