// Policy content for the NeuroPathway Safe Space prototype.
// Wording is grounded in the NeuroPathway governance documents (business plan,
// pilot proposal and NHS/SEND compliance pack). This is demonstration content
// for a prototype and is not a substitute for a signed legal agreement.

import type { LucideIcon } from 'lucide-react'
import { ShieldCheck, Lock, Scale } from 'lucide-react'

export type PolicySection = {
  heading: string
  points: string[]
}

export type Policy = {
  slug: string
  title: string
  icon: LucideIcon
  summary: string
  updated: string
  intro: string
  sections: PolicySection[]
}

export const POLICIES: Policy[] = [
  {
    slug: 'privacy',
    title: 'Privacy & Data Protection',
    icon: Lock,
    summary: 'What we collect, how it is protected, and the control you keep.',
    updated: 'Prototype — August 2026',
    intro:
      'Your Safe Space is built around one idea: the young person is in control of their own words. We collect as little as possible, protect it carefully, and never share a private entry without a clear, recorded reason.',
    sections: [
      {
        heading: 'What we collect',
        points: [
          'Only what you choose to add: check-ins, journal entries, goals, and your “What Helps Me” profile.',
          'Feelings, notes and drawings are treated as special category data and given the highest level of protection.',
          'We practise data minimisation — we do not ask for information the tool does not need.',
        ],
      },
      {
        heading: 'Who can see your information',
        points: [
          'Private entries are visible only to you. No adult can read them in real time.',
          'You decide, entry by entry, whether to share with a named person in your Safe Circle.',
          'Every time a trusted adult opens something you shared, it is written to an access log you can see.',
          'Access is need-to-know and role-based, following the Caldicott Principles.',
        ],
      },
      {
        heading: 'How it is protected',
        points: [
          'Privacy by design: security is built in from the start, not added later.',
          'Encryption of sensitive data, secure sign-in, and controlled export only.',
          'Handled in line with UK GDPR and the Data Protection Act 2018.',
          'A Data Protection Impact Assessment (DPIA) is completed before any real data is collected.',
        ],
      },
      {
        heading: 'Your rights and control',
        points: [
          'You can change who sees an entry at any time, or delete it whenever you want.',
          'You can ask for a copy of your information or ask for it to be removed.',
          'Clear data retention rules mean information is not kept longer than needed.',
          'For older children with capacity, independent consent is supported under the Gillick competence framework.',
        ],
      },
    ],
  },
  {
    slug: 'safeguarding',
    title: 'Safeguarding',
    icon: ShieldCheck,
    summary: 'How concerns reach a real person — never an algorithm.',
    updated: 'Prototype — August 2026',
    intro:
      'Safeguarding is non-negotiable. No algorithm ever stands between a child’s disclosure and a human response. Safe Space is a support tool, not an emergency service.',
    sections: [
      {
        heading: 'A separate, human-led route',
        points: [
          'Safeguarding disclosures run on a separate, parallel protocol from pattern tracking.',
          'A safeguarding response is never decided or mediated by AI.',
          'Requests for help are acknowledged, and you can see when a real person has received them.',
        ],
      },
      {
        heading: 'If someone is in danger',
        points: [
          'If you or someone else is in immediate danger, call 999 or tell a trusted adult straight away.',
          'Safe Space does not provide emergency or crisis assistance.',
          'Urgent help lines are always one tap away on the Support page.',
        ],
      },
      {
        heading: 'How concerns are handled',
        points: [
          'Trained staff follow Working Together to Safeguard Children (2023) and KCSIE guidance.',
          'Concerns are shared only with the right people, and actions are recorded.',
          'LADO and local safeguarding procedures are followed where relevant.',
        ],
      },
      {
        heading: 'Recognising need early',
        points: [
          'Everyday observations are organised into evidence to help adults notice needs sooner.',
          'The aim is prevention — support that begins when patterns first appear, before crisis.',
          'Nothing here diagnoses a child; it describes needs, patterns and functional impact only.',
        ],
      },
    ],
  },
  {
    slug: 'governance',
    title: 'Governance & Compliance',
    icon: Scale,
    summary: 'The standards, laws and human oversight the platform is built on.',
    updated: 'Prototype — August 2026',
    intro:
      'NeuroPathway is designed to be education-ready and NHS-ready, with responsible AI, clear accountability and legal compliance built into the architecture rather than retrofitted.',
    sections: [
      {
        heading: 'Responsible AI',
        points: [
          'AI helps organise observations and summarise patterns. It does not diagnose.',
          'Every consequential decision is made by a qualified professional — the human is always the final arbiter.',
          'Higher-need flags generate a plain-language explanation so adults can see exactly what informed them (explainable AI).',
          'This meets UK GDPR Article 22 on automated decision-making by keeping meaningful human oversight.',
        ],
      },
      {
        heading: 'Fairness and bias safeguards',
        points: [
          'The system is built to zero-bias principles: it does not assume based on age, sex, race or background.',
          'Independent adversarial audits test for training-data, socioeconomic and cultural-communication bias.',
          'Findings are published in an Algorithmic Impact Assessment.',
        ],
      },
      {
        heading: 'Legal and clinical standards',
        points: [
          'Grounded in the Children and Families Act 2014 and the SEND Code of Practice (2015).',
          'Follows UK GDPR, the Data Protection Act 2018 and the Caldicott Principles (2020).',
          'NHS DTAC-aligned, with DCB0129 / DCB0160 clinical-safety planning where relevant.',
          'Accessibility is designed to WCAG 2.1 AA.',
        ],
      },
      {
        heading: 'Accountability and audit',
        points: [
          'Role-based access with a full audit trail of who viewed what and when.',
          'Multi-agency collaboration keeps education, health, home and social care working from the same picture.',
          'Pattern flags are held as “awaiting human review” until a named professional signs them off.',
        ],
      },
    ],
  },
]

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES.find((p) => p.slug === slug)
}
