// ─── Enums / Literal Types ────────────────────────────────────────────────

export type FundingStage = 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth'
export type InvestorType = 'angel' | 'vc' | 'family-office' | 'corporate' | 'accelerator'
export type CRMStatus =
  | 'prospect'
  | 'contacted'
  | 'meeting-scheduled'
  | 'due-diligence'
  | 'term-sheet'
  | 'closed'
  | 'passed'
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'
export type PostPlatform = 'linkedin' | 'twitter' | 'instagram' | 'facebook'
export type InteractionType = 'intro' | 'call' | 'email' | 'update' | 'meeting' | 'note'
export type ContentAssetType = 'tweet' | 'linkedin' | 'email' | 'press' | 'brief_section'
export type ContentAssetStatus = 'draft' | 'approved' | 'scheduled' | 'published' | 'archived'

// ─── Core Tables ─────────────────────────────────────────────────────────

export interface Profile {
  id: string
  full_name: string | null
  company_name: string | null
  avatar_url: string | null
  industry: string | null
  funding_stage: FundingStage | null
  bio: string | null
  website: string | null
  linkedin_url: string | null
  twitter_handle: string | null
  created_at: string
  updated_at: string
}

export interface Investor {
  id: string
  name: string
  firm: string | null
  email: string | null
  linkedin_url: string | null
  avatar_url: string | null
  focus_areas: string[]
  funding_stages: FundingStage[]
  investment_range_min: number | null
  investment_range_max: number | null
  location: string | null
  portfolio_count: number | null
  match_score: number
  bio: string | null
  investor_type: InvestorType
  thesis_tags?: string[]
  prior_notes?: string | null
}

export interface InvestorRelation {
  id: string
  user_id: string
  investor_id: string
  status: CRMStatus
  notes: string | null
  last_contact_date: string | null
  next_follow_up: string | null
  potential_amount: number | null
  investor?: Investor
  created_at: string
  updated_at: string
}

export interface Interaction {
  id: string
  user_id: string
  investor_id: string | null
  type: InteractionType
  date: string
  notes: string | null
  linked_content_asset_id: string | null
  created_at: string
}

export interface ContentPost {
  id: string
  user_id: string
  title: string
  content: string | null
  platforms: PostPlatform[]
  scheduled_at: string | null
  published_at: string | null
  status: PostStatus
  tags: string[]
  created_at: string
  updated_at: string
}

export interface ContentAsset {
  id: string
  user_id: string
  type: ContentAssetType
  status: ContentAssetStatus
  content: string
  source_id: string | null
  source_type: string | null
  platform: PostPlatform | null
  tags: string[]
  performance_reach: number | null
  performance_likes: number | null
  performance_comments: number | null
  performance_shares: number | null
  created_at: string
  updated_at: string
}

export interface SocialCalendarEntry {
  id: string
  user_id: string
  content_asset_id: string | null
  channel: PostPlatform
  scheduled_at: string
  posted_at: string | null
  provider_post_id: string | null
  performance_reach: number | null
  performance_engagement: number | null
  status: PostStatus
  content?: ContentAsset
  created_at: string
}

export interface AiGeneration {
  id: string
  user_id: string
  feature: 'brief' | 'outreach' | 'social'
  template_version: string
  input_context: Record<string, unknown>
  output: Record<string, unknown>
  status: 'success' | 'error'
  error_message: string | null
  created_at: string
}

export interface Meeting {
  id: string
  user_id: string
  investor_id: string | null
  title: string
  description: string | null
  meeting_date: string | null
  meeting_type: 'video' | 'phone' | 'in_person'
  status: 'scheduled' | 'completed' | 'cancelled'
  notes: string | null
  investor?: Investor
}

// ─── Fundraising Brief (stored in ai_generations) ─────────────────────────

export interface StoredBrief {
  id: string
  company_name: string
  stage: string
  created_at: string
  brief: {
    executive_summary: string
    narrative: string
    investor_update: string
    pitch_email: string
    linkedin_post: string
    key_claims: string[]
    talking_points: string[]
    risks_and_mitigations: Array<{ risk: string; mitigation: string }>
  }
}
