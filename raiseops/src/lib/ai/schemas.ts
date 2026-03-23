// Zod schemas for all AI-generated structured outputs.
// These are the source of truth — shared by API routes (server) and used for
// runtime validation of every AI response before it touches the database.

import { z } from 'zod'

// ─── Fundraising Brief ─────────────────────────────────────────────────────

export const FundraisingBriefSchema = z.object({
  executive_summary: z.string().min(1, 'executive_summary is required'),
  narrative: z.string().min(1, 'narrative is required'),
  investor_update: z.string().min(1, 'investor_update is required'),
  pitch_email: z.string().min(1, 'pitch_email is required'),
  linkedin_post: z.string().min(1, 'linkedin_post is required'),
  key_claims: z.array(z.string()).min(1, 'key_claims must have at least 1 entry'),
  talking_points: z.array(z.string()).min(1, 'talking_points must have at least 1 entry'),
  risks_and_mitigations: z.array(
    z.object({
      risk: z.string().min(1),
      mitigation: z.string().min(1),
    })
  ),
})

export type FundraisingBrief = z.infer<typeof FundraisingBriefSchema>

// ─── Investor Outreach ────────────────────────────────────────────────────

export const OutreachDraftSchema = z.object({
  subject: z.string().min(1, 'subject is required').max(200),
  email: z.string().min(1, 'email is required'),
  linkedin_note: z.string().max(500),
  follow_up: z.string().min(1, 'follow_up is required'),
})

export type OutreachDraft = z.infer<typeof OutreachDraftSchema>

// ─── Social Post ─────────────────────────────────────────────────────────

export const SocialPostSchema = z.object({
  platform: z.enum(['linkedin', 'twitter']),
  content: z.string().min(1, 'content is required').max(3000),
  variant: z.enum(['short', 'long']),
  tone: z.enum(['technical', 'founder', 'growth']),
  tags: z.array(z.string()).default([]),
})

export type SocialPost = z.infer<typeof SocialPostSchema>

export const SocialBatchSchema = z.object({
  theme: z.string().min(1),
  posts: z.array(SocialPostSchema).min(1, 'At least 1 post is required'),
  suggested_schedule: z.array(z.string()).default([]),
})

export type SocialBatch = z.infer<typeof SocialBatchSchema>

// ─── Request body schemas (input validation) ────────────────────────────

export const BriefInputSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  stage: z.enum(['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth']),
  roundType: z.string().min(1).max(60),
  raiseAmount: z.string().max(30).optional().default(''),
  useOfFunds: z.string().max(2000).optional().default(''),
  tractionPoints: z.string().max(2000).optional().default(''),
  mrr: z.string().max(30).optional().default(''),
  growthRate: z.string().max(30).optional().default(''),
  customerCount: z.string().max(30).optional().default(''),
  risks: z.string().max(1000).optional().default(''),
  founderBio: z.string().max(1000).optional().default(''),
  targetInvestorTags: z.string().max(300).optional().default(''),
})
  .refine((d) => d.useOfFunds || d.tractionPoints, {
    message: 'Provide either useOfFunds or tractionPoints.',
  })

export type BriefInput = z.infer<typeof BriefInputSchema>

export const OutreachInputSchema = z.object({
  investorName: z.string().min(1).max(100),
  investorFirm: z.string().max(100).nullable().optional(),
  focusAreas: z.array(z.string().max(50)).max(20).default([]),
  stage: z.string().max(30).optional().default('seed'),
  companyName: z.string().min(1).max(100),
  companyBio: z.string().max(500).optional(),
  purpose: z.enum(['intro', 'meeting', 'update', 'followup']).optional().default('intro'),
  tone: z.enum(['formal', 'founder-friendly', 'concise']).optional().default('founder-friendly'),
})

export type OutreachInput = z.infer<typeof OutreachInputSchema>

export const SocialIntakeSchema = z.object({
  companyName: z.string().min(1).max(100),
  milestones: z.string().max(2000).optional().default(''),
  metrics: z.string().max(1000).optional().default(''),
  eventDates: z.string().max(300).optional(),
  productNotes: z.string().max(1000).optional(),
  channels: z.array(z.enum(['linkedin', 'twitter'])).min(1, 'Select at least one channel').default(['linkedin']),
  tone: z.enum(['technical', 'founder', 'growth']).optional().default('founder'),
  postCount: z.number().int().min(3).max(12).default(6),
})
  .refine((d) => d.milestones || d.metrics, {
    message: 'Provide at least one milestone or metric.',
  })

export type SocialIntake = z.infer<typeof SocialIntakeSchema>
