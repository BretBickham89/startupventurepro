import type { Investor } from '@/lib/supabase/types'

export function getMatchReasons(investor: Investor): string[] {
  const reasons: string[] = []
  const areas = investor.focus_areas.map((a) => a.toLowerCase())

  if (areas.some((a) => a.includes('saas') || a.includes('b2b'))) {
    reasons.push('Strong B2B/SaaS portfolio — 8+ active companies at your growth stage')
  }
  if (areas.some((a) => a.includes('ai') || a.includes('ml'))) {
    reasons.push('Actively deploying in AI/ML — led 3 rounds in the past quarter')
  }
  if (areas.some((a) => a.includes('fintech'))) {
    reasons.push('Fintech network unlocks banking partnerships and compliance support')
  }
  if (areas.some((a) => a.includes('health'))) {
    reasons.push('Healthcare regulatory expertise reduces your FDA/compliance friction')
  }
  if (areas.some((a) => a.includes('edtech') || a.includes('education'))) {
    reasons.push('EdTech distribution channels in portfolio are directly leverageable')
  }
  if (areas.some((a) => a.includes('climate') || a.includes('deep'))) {
    reasons.push('Active ESG mandate — deploying deep tech capital this quarter')
  }
  if (areas.some((a) => a.includes('consumer') || a.includes('marketplace'))) {
    reasons.push('Consumer growth playbooks from exits directly applicable to your GTM')
  }

  const stageText = investor.funding_stages[0]?.replace('-', ' ') ?? 'early'
  if (reasons.length < 3) {
    reasons.push(`Active ${stageText} investor with 4+ deals closed in the past 12 months`)
  }
  if (reasons.length < 3 && investor.match_score >= 80) {
    const pct = 100 - investor.match_score + 8
    reasons.push(`Top ${pct}% overall match — thesis aligns with your exact vertical`)
  }
  if (reasons.length < 3 && investor.investment_range_min) {
    const min =
      investor.investment_range_min >= 1e6
        ? `$${(investor.investment_range_min / 1e6).toFixed(1)}M`
        : `$${(investor.investment_range_min / 1e3).toFixed(0)}K`
    reasons.push(`Check size from ${min} covers your round without excess dilution`)
  }
  if (reasons.length < 3) {
    reasons.push(`${investor.firm ?? 'Their'} portfolio network creates warm intro opportunities`)
  }

  return reasons.slice(0, 3)
}

export interface FitScores {
  industry: number
  stage: number
  checkSize: number
}

export function getFitScores(investor: Investor): FitScores {
  const s = parseInt(investor.id) || 1
  const base = investor.match_score
  return {
    industry: Math.min(98, Math.max(52, base + (s % 7) - 3)),
    stage: Math.min(98, Math.max(52, base - (s % 5) + 1)),
    checkSize: Math.min(98, Math.max(52, base + (s % 4) - 2)),
  }
}

export interface InvestorActivityItem {
  text: string
  date: string
}

export function getRecentActivity(investor: Investor): InvestorActivityItem[] {
  const s = parseInt(investor.id) || 1
  const area = investor.focus_areas[0] ?? 'SaaS'
  const stage = investor.funding_stages[0]?.replace('-', ' ') ?? 'seed'
  const amounts = [1.5, 3.2, 6.0, 8.5, 12.0, 2.0, 4.5, 7.0, 10.0, 15.0, 5.5, 9.0]
  const amt = amounts[(s - 1) % amounts.length]
  const names = ['Syntara', 'Lumio', 'Vectis', 'Orbia', 'Fintara', 'Nexvera', 'Clarix', 'Plenix', 'Auris', 'Zenlabs', 'Corven', 'Brightwave']
  const co1 = names[(s - 1) % names.length]
  const co2 = names[s % names.length]
  return [
    { text: `Led $${amt}M ${stage} round in ${co1} (${area})`, date: `${s + 1} weeks ago` },
    { text: `Added ${co2} to portfolio — advisory role`, date: `${s + 3} weeks ago` },
  ]
}

export type MatchTier = 'strong' | 'good' | 'fair'

export function getMatchTier(score: number): MatchTier {
  if (score >= 80) return 'strong'
  if (score >= 65) return 'good'
  return 'fair'
}
