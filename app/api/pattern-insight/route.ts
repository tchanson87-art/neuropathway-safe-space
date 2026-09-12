import { generateObject } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

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
      model: 'openai/gpt-4.1-mini',
      schema: InsightSchema,
      system,
      prompt: `Here is the child's own fictional/private data (check-ins and journal entries) as JSON. Reflect only on what is actually present.\n\n${evidence}`,
    })

    return Response.json(object)
  } catch (err) {
    console.log('[v0] pattern-insight error:', (err as Error).message)
    return Response.json(
      { error: 'The reflection could not be generated right now. Please try again in a moment.' },
      { status: 500 },
    )
  }
}
