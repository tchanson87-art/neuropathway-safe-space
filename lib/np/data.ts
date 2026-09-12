import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type {
  NpChild,
  NpObservation,
  NpEvidenceItem,
  NpPattern,
  NpSupportPlan,
  NpIntervention,
  NpEhcpDraft,
  NpSafeguardingEvent,
} from './types'

export interface NpViewer {
  id: string
  role: string
  name: string
  organization: string | null
}

/** Current authenticated professional, with their profile role. Null if not signed in. */
export async function getViewer(): Promise<NpViewer | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name, last_name, school_or_organization')
    .eq('id', user.id)
    .maybeSingle()

  const name =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user.email ||
    'Practitioner'

  return {
    id: user.id,
    role: profile?.role ?? 'practitioner',
    name,
    organization: profile?.school_or_organization ?? null,
  }
}

/** Record an audit entry. Best-effort — never blocks the main action. */
export async function audit(
  action: string,
  opts: { childId?: string; detail?: string; role?: string } = {},
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('np_audit_logs').insert({
      child_id: opts.childId ?? null,
      actor_id: user.id,
      actor_role: opts.role ?? null,
      action,
      detail: opts.detail ?? null,
    })
  } catch {
    // auditing must not break the user action
  }
}

export async function listChildren(): Promise<NpChild[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_children')
    .select('*')
    .eq('status', 'active')
    .order('preferred_name')
  return (data as NpChild[]) ?? []
}

export async function getChild(id: string): Promise<NpChild | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('np_children').select('*').eq('id', id).maybeSingle()
  return (data as NpChild) ?? null
}

export async function listObservations(childId: string): Promise<NpObservation[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_observations')
    .select('*')
    .eq('child_id', childId)
    .order('occurred_at', { ascending: false })
  return (data as NpObservation[]) ?? []
}

export async function listEvidence(childId: string): Promise<NpEvidenceItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_evidence_items')
    .select('*')
    .eq('child_id', childId)
    .order('event_date', { ascending: false, nullsFirst: false })
  return (data as NpEvidenceItem[]) ?? []
}

export async function listPatterns(childId: string): Promise<NpPattern[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_patterns')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
  return (data as NpPattern[]) ?? []
}

export async function getPatternEvidence(patternId: string): Promise<NpEvidenceItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_pattern_evidence')
    .select('evidence:np_evidence_items(*)')
    .eq('pattern_id', patternId)
  const rows = (data ?? []) as unknown as { evidence: NpEvidenceItem | NpEvidenceItem[] | null }[]
  return rows
    .flatMap((r) => (Array.isArray(r.evidence) ? r.evidence : r.evidence ? [r.evidence] : []))
    .filter(Boolean) as NpEvidenceItem[]
}

export async function listSupportPlans(childId: string): Promise<NpSupportPlan[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_support_plans')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
  return (data as NpSupportPlan[]) ?? []
}

export async function listInterventions(planId: string): Promise<NpIntervention[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_interventions')
    .select('*')
    .eq('plan_id', planId)
    .order('created_at', { ascending: false })
  return (data as NpIntervention[]) ?? []
}

export async function getEhcpDraft(childId: string): Promise<NpEhcpDraft | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_ehcp_drafts')
    .select('*')
    .eq('child_id', childId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data as NpEhcpDraft) ?? null
}

export async function listSafeguarding(childId: string): Promise<NpSafeguardingEvent[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_safeguarding_events')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
  return (data as NpSafeguardingEvent[]) ?? []
}

/** Safeguarding events across every child the viewer is an authorised safeguarding reviewer for. */
export async function listAllSafeguarding(): Promise<
  (NpSafeguardingEvent & { child_name: string })[]
> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('np_safeguarding_events')
    .select('*, child:np_children(preferred_name)')
    .order('created_at', { ascending: false })
  const rows = (data ?? []) as unknown as (NpSafeguardingEvent & {
    child?: { preferred_name: string } | { preferred_name: string }[] | null
  })[]
  return rows.map((r) => {
    const child = Array.isArray(r.child) ? r.child[0] : r.child
    return { ...r, child_name: child?.preferred_name ?? 'Unknown' }
  })
}

/** Privacy-preserving pilot aggregates. No identifiable child-level data. */
export async function getPilotMetrics() {
  const supabase = await createClient()
  const [children, obs, quest, plans, interventions, evidence, patterns] = await Promise.all([
    supabase.from('np_children').select('id', { count: 'exact', head: true }),
    supabase.from('np_observations').select('id, setting', { count: 'exact' }),
    supabase.from('np_questionnaire_responses').select('id', { count: 'exact', head: true }),
    supabase.from('np_support_plans').select('id', { count: 'exact', head: true }),
    supabase.from('np_intervention_reviews').select('id', { count: 'exact', head: true }),
    supabase.from('np_evidence_items').select('id, source'),
    supabase.from('np_patterns').select('id, status'),
  ])
  const settings = new Set((obs.data ?? []).map((o) => o.setting))
  const safeSpace = (evidence.data ?? []).filter((e) => e.source === 'safe_space').length
  const reviewed = (patterns.data ?? []).filter((p) => p.status !== 'awaiting_review').length
  return {
    children: children.count ?? 0,
    observations: obs.count ?? 0,
    questionnaires: quest.count ?? 0,
    supportPlans: plans.count ?? 0,
    interventionReviews: interventions.count ?? 0,
    crossSetting: settings.size,
    safeSpaceShared: safeSpace,
    patternsReviewed: reviewed,
    evidenceItems: (evidence.data ?? []).length,
  }
}

/** Dashboard aggregate across all children the viewer can access. */
export async function getDashboardSummary() {
  const supabase = await createClient()
  const [children, patterns, plans, evidence] = await Promise.all([
    supabase.from('np_children').select('id, preferred_name, is_demo, age_band').eq('status', 'active'),
    supabase.from('np_patterns').select('id, child_id, status'),
    supabase.from('np_support_plans').select('id, status'),
    supabase.from('np_evidence_items').select('id, source, created_at'),
  ])
  const awaitingReview = (patterns.data ?? []).filter((p) => p.status === 'awaiting_review').length
  const activePlans = (plans.data ?? []).filter((p) => p.status === 'active').length
  const safeSpaceShared = (evidence.data ?? []).filter((e) => e.source === 'safe_space').length
  return {
    children: (children.data ?? []) as { id: string; preferred_name: string; is_demo: boolean; age_band: string | null }[],
    awaitingReview,
    activePlans,
    safeSpaceShared,
    evidenceCount: (evidence.data ?? []).length,
  }
}
