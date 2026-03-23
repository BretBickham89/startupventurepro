// TypeScript interfaces for AI-generated structured outputs

export interface FundraisingBrief {
  executive_summary: string
  narrative: string
  investor_update: string
  pitch_email: string
  linkedin_post: string
  key_claims: string[]
  talking_points: string[]
  risks_and_mitigations: Array<{ risk: string; mitigation: string }>
}

export interface OutreachDraft {
  subject: string
  email: string
  linkedin_note: string
  follow_up: string
}

export interface SocialPost {
  platform: 'linkedin' | 'twitter'
  content: string
  variant: 'short' | 'long'
  tone: 'technical' | 'founder' | 'growth'
  tags: string[]
}

export interface SocialBatch {
  theme: string
  posts: SocialPost[]
  suggested_schedule: string[]
}

export interface BriefInput {
  companyName: string
  stage: string
  roundType: string
  raiseAmount: string
  useOfFunds: string
  tractionPoints: string
  mrr: string
  growthRate: string
  customerCount: string
  risks: string
  founderBio: string
  targetInvestorTags: string
}

export interface OutreachInput {
  investorName: string
  investorFirm: string | null
  focusAreas: string[]
  stage: string
  companyName: string
  companyBio?: string
  purpose: 'intro' | 'meeting' | 'update' | 'followup'
  tone: 'formal' | 'founder-friendly' | 'concise'
}

export interface SocialIntake {
  milestones: string
  metrics: string
  eventDates?: string
  productNotes?: string
  channels: ('linkedin' | 'twitter')[]
  tone: 'technical' | 'founder' | 'growth'
  companyName: string
  postCount: number
}
