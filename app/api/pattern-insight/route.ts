import { generateObject } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

const MODEL = 'openai/gpt-4.1-mini'
const PROMPT_VERSION = 'safe-space-insight-v1'

const InsightSchema = z.object({
  safetyAlert: z
    .boolean()
    .describe(
      'True ONLY if the evidence contains a clear sign of self-harm, suicide risk, abuse, neglect or immediate danger.',
    ),
  summary: z
    .string()
    .describe('A warm, plain-language summary of what has been noticed, addressed to the child.'),
  strengths: z.array(z.string()).describe('Genuine strengths or good moments evidenced in the data.'),
  observedNeeds: z
    .array(z.string())
    .describe('Observed needs described functionally, never as labels or diagnoses.'),
  patterns: z
    .array(z.string())
    .describe('Patterns across time, place or triggers, only where the evidence supports them.'),
  gentleSuggestion: z
    .string()
    .describe('One kind, optional suggestion the child could try or share with a trusted adult.'),
  evidenceStrength: z.enum(['Low', 'Moderate', 'High']),
})

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 })
  }

  const [{ data: checkins }, { data: journal }] = await Promise.all([
    supabase
      .from('safespace_checkins')
      .select('created_at, emotions, intensity, place, before_context, triggers, sensory, helped, need, note')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('safespace_journal')
      .select('created_at, title, body, category')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const totalEntries = (checkins?.length ?? 0) + (journal?.length ?? 0)
  if (totalEntries < 2) {
    return Response.json({
      insufficient: true,
      message:
        'There are only a couple of entries so far. Keep checking in when you feel like it — after a few more, this space can gently reflect back what it notices.',
    })
  }

  const evidence = JSON.stringify({ checkIns: checkins ?? [], journal: journal ?? [] })

  const system = [
    'You are NeuroPathway AI, supporting early identification of unmet neurodevelopmental needs in a child.',
    'Core principle: Prevention Is the Cure. Be calm, compassionate, professional and evidence-based.',
    'RULES you must never break:',
    '1. NEVER diagnose or suggest diagnoses (e.g. ADHD, autism). Only qualified clinicians diagnose. Focus on observed needs and functional impact.',
    '2. NEEDS FIRST, NOT LABELS. Describe struggles, triggers, supports and impact.',
    '3. ZERO HALLUCINATION. Only use the data provided. Never invent dates, incidents, behaviours or scores. If evidence is thin, say so and keep evidenceStrength Low.',
    '4. ZERO BIAS. Never assume anything based on age, sex, race or background.',
    '5. SAFEGUARDING FIRST. If self-harm, suicide risk, abuse, neglect or immediate danger appears, set safetyAlert true.',
    'You are writing directly TO the child, so keep language gentle, warm and simple. Never exaggerate or minimise concerns.',
  ].join('\n')

  try {
    const { object } = await generateObject({
      model: MODEL,
      schema: InsightSchema,
      system,
      prompt: `Here is the child's own fictional/private data (check-ins and journal entries) as JSON. Reflect only on what is actually present.\n\n${evidence}`,
    })

    // Provenance: log every AI output with its model + prompt version so the
    // reflection is fully traceable and auditable later.
    const { data: aiOutput } = await supabase
      .from('ai_outputs')
      .insert({
        surface: 'safe_space',
        output_type: 'insight',
        user_id: user.id,
        model: MODEL,
        prompt_version: PROMPT_VERSION,
        evidence_strength: object.evidenceStrength,
        safety_alert: object.safetyAlert,
        summary: object.summary,
        meta: { entries: totalEntries },
      })
      .select('id')
      .single()

    // Safety pre-screen result — one row per screen, flagged or not.
    await supabase.from('safety_screen_results').insert({
      ai_output_id: aiOutput?.id ?? null,
      user_id: user.id,
      flagged: object.safetyAlert,
      categories: object.safetyAlert ? ['self_harm_or_immediate_danger'] : [],
      detail: object.safetyAlert
        ? 'Automated pre-screen flagged a possible safeguarding signal in the child\u2019s entries.'
        : null,
    })

    // If a safeguarding signal appears, raise an adult-review record and audit it.
    // This turns the flag into an actionable record rather than a transient boolean.
    if (object.safetyAlert) {
      await supabase.from('safespace_safety_alerts').insert({
        user_id: user.id,
        ai_output_id: aiOutput?.id ?? null,
        status: 'open',
        summary:
          'A safeguarding pre-screen flagged a possible sign of self-harm, distress or danger in recent entries. A trusted adult should review this promptly.',
        source: 'safe_space_ai',
      })
      await supabase.from('np_audit_logs').insert({
        actor_id: user.id,
        actor_role: 'child',
        action: 'safety.alert.raised',
        detail: `Safe Space AI pre-screen raised a safeguarding review (ai_output ${aiOutput?.id ?? 'unknown'}).`,
      })
    }

    return Response.json(object)
  } catch (err) {
    console.log('[v0] pattern-insight error:', (err as Error).message)
    return Response.json(
      { error: 'The reflection could not be generated right now. Please try again in a moment.' },
      { status: 500 },
    )
  }
}
