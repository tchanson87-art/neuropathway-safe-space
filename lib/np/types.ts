// NeuroPathway professional platform — shared types.
// These mirror the additive np_* tables in the shared Supabase project.

export type NpRelationship =
  | 'parent'
  | 'teacher'
  | 'senco'
  | 'health'
  | 'social_care'
  | 'practitioner'
  | 'evaluator'
  | 'safeguarding'
  | 'org_admin'

export type NpDomain =
  | 'emotional_regulation'
  | 'sensory'
  | 'communication'
  | 'social_interaction'
  | 'learning_executive'
  | 'behavioural'
  | 'daily_living'

export const DOMAIN_LABELS: Record<string, string> = {
  emotional_regulation: 'Emotional regulation',
  sensory: 'Sensory processing',
  communication: 'Communication',
  social_interaction: 'Social interaction',
  learning_executive: 'Learning & executive function',
  behavioural: 'Behavioural patterns',
  daily_living: 'Daily living',
}

export const SETTING_LABELS: Record<string, string> = {
  home: 'Home',
  school: 'School',
  clinic: 'Clinic',
  community: 'Community',
}

export interface NpChild {
  id: string
  preferred_name: string
  pronouns: string | null
  age_band: string | null
  education_setting: string | null
  year_group: string | null
  strengths: string[]
  interests: string[]
  known_needs: string[]
  communication_prefs: string[]
  sensory_prefs: string[]
  reasonable_adjustments: string[]
  important_health: string | null
  safe_space_link_code: string | null
  is_demo: boolean
  status: string
  created_at: string
}

export interface NpObservation {
  id: string
  child_id: string
  observer_role: string | null
  setting: string
  occurred_at: string
  activity: string | null
  antecedent: string | null
  behaviour: string
  child_communicated: string | null
  trigger: string | null
  sensory_factors: string[]
  emotional_state: string | null
  physical_factors: string | null
  duration_minutes: number | null
  intensity: number | null
  support_given: string | null
  what_helped: string | null
  what_did_not_help: string | null
  recovery_minutes: number | null
  impact_area: string[]
  child_view: string | null
  domain: string | null
  sharing: 'private' | 'shared'
  created_at: string
}

export interface NpEvidenceItem {
  id: string
  child_id: string
  author_role: string | null
  record_type: string
  source: string
  title: string
  body: string | null
  event_date: string | null
  source_ref: string | null
  sharing: 'private' | 'shared'
  review_status: 'unreviewed' | 'reviewed' | 'disputed'
  is_ai_assisted: boolean
  created_at: string
}

export interface NpPattern {
  id: string
  child_id: string
  domain: string
  summary: string
  basis: string
  frequency: number
  settings: string[]
  date_range_start: string | null
  date_range_end: string | null
  confidence: 'low' | 'moderate' | 'high'
  risk_band: 'green' | 'amber' | 'red'
  escalation: 'monitor' | 'sen_support' | 'professional_review' | 'urgent_review'
  occurrences_in_window: number | null
  window_days: number | null
  status: 'awaiting_review' | 'accepted' | 'rejected' | 'needs_evidence' | 'amended'
  is_ai_assisted: boolean
  model_version: string | null
  created_at: string
}

export const RISK_BAND_LABELS: Record<string, string> = {
  green: 'Green — monitor',
  amber: 'Amber — emerging need',
  red: 'Red — needs professional review',
}

export const ESCALATION_LABELS: Record<string, string> = {
  monitor: 'Monitor',
  sen_support: 'SEN Support',
  professional_review: 'Professional Review',
  urgent_review: 'Urgent Review',
}

export interface NpSupportPlan {
  id: string
  child_id: string
  identified_need: string
  supporting_pattern_id: string | null
  child_strengths: string | null
  child_view: string | null
  desired_outcome: string
  responsible_person: string | null
  status: 'active' | 'review_due' | 'completed' | 'stopped'
  created_at: string
}

export interface NpIntervention {
  id: string
  plan_id: string
  description: string
  setting: string | null
  frequency: string | null
  start_date: string | null
  review_date: string | null
  baseline: string | null
  measure: string | null
  created_at: string
}

export interface NpEhcpDraft {
  id: string
  child_id: string
  title: string
  sections: Record<string, string>
  status: 'draft' | 'in_review' | 'final'
  version: number
  updated_at: string
}

export interface NpSafeguardingEvent {
  id: string
  child_id: string
  urgency: 'monitor' | 'review' | 'urgent'
  summary: string
  source: string | null
  status: 'open' | 'in_review' | 'resolved'
  created_at: string
}
