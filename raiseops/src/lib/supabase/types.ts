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
