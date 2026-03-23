'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  Avatar,
  Stack,
  Divider,
  Checkbox,
  Menu,
  MenuItem,
  LinearProgress,
  Tooltip,
} from '@mui/material'
import {
  IconMapPin,
  IconBriefcase,
  IconCheck,
  IconPlus,
  IconChevronDown,
  IconSparkles,
  IconRocket,
  IconActivity,
  IconCircleDot,
  IconSend,
  IconMailForward,
  IconMessage2,
} from '@tabler/icons-react'
import type { Investor } from '@/lib/supabase/types'

export type PipelineStatus = 'not-contacted' | 'draft-ready' | 'sent' | 'replied'

const PIPELINE_CONFIG: Record<PipelineStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  'not-contacted': {
    label: 'Not Contacted',
    color: '#7C8FAC',
    bg: '#F6F8FB',
    icon: <IconCircleDot size={12} />,
  },
  'draft-ready': {
    label: 'Draft Ready',
    color: '#5D87FF',
    bg: '#ECF2FF',
    icon: <IconMailForward size={12} />,
  },
  sent: {
    label: 'Sent',
    color: '#FFAE1F',
    bg: '#FEF5E5',
    icon: <IconSend size={12} />,
  },
  replied: {
    label: 'Replied',
    color: '#13DEB9',
    bg: '#E6FFFA',
    icon: <IconMessage2 size={12} />,
  },
}

const PIPELINE_ORDER: PipelineStatus[] = ['not-contacted', 'draft-ready', 'sent', 'replied']

const TYPE_LABELS: Record<string, string> = {
  angel: 'Angel',
  vc: 'VC',
  'family-office': 'Family Office',
  corporate: 'Corporate VC',
  accelerator: 'Accelerator',
}

function getAIReasons(investor: Investor): string[] {
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

function getFitScores(investor: Investor) {
  const s = parseInt(investor.id) || 1
  const base = investor.match_score
  return {
    industry: Math.min(98, Math.max(52, base + (s % 7) - 3)),
    stage: Math.min(98, Math.max(52, base - (s % 5) + 1)),
    checkSize: Math.min(98, Math.max(52, base + (s % 4) - 2)),
  }
}

function getRecentActivity(investor: Investor): Array<{ text: string; date: string }> {
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

interface FitBarProps {
  label: string
  value: number
}

function FitBar({ label, value }: FitBarProps) {
  const color = value >= 85 ? '#13DEB9' : value >= 70 ? '#5D87FF' : '#FFAE1F'
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ fontSize: '0.68rem', color: '#7C8FAC', width: 76, flexShrink: 0 }}>{label}</Typography>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          flex: 1,
          height: 5,
          borderRadius: 3,
          bgcolor: '#EEF2F7',
          '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: color },
        }}
      />
      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color, width: 28, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  )
}

interface InvestorCardProps {
  investor: Investor
  pipelineStatus: PipelineStatus
  isSelected: boolean
  isSaved?: boolean
  onGenerateIntro: () => void
  onPipelineStatusChange: (status: PipelineStatus) => void
  onToggleSelect: () => void
  onSaveToCRM?: () => void
  onViewProfile?: () => void
}

export default function InvestorCard({
  investor,
  pipelineStatus,
  isSelected,
  isSaved = false,
  onGenerateIntro,
  onPipelineStatusChange,
  onToggleSelect,
  onSaveToCRM,
  onViewProfile,
}: InvestorCardProps) {
  const [pipelineAnchor, setPipelineAnchor] = useState<null | HTMLElement>(null)

  const formatAmount = (amount: number | null) => {
    if (!amount) return null
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`
    return `$${amount}`
  }

  const investmentRange =
    investor.investment_range_min && investor.investment_range_max
      ? `${formatAmount(investor.investment_range_min)} – ${formatAmount(investor.investment_range_max)}`
      : investor.investment_range_min
      ? `From ${formatAmount(investor.investment_range_min)}`
      : null

  const aiReasons = getAIReasons(investor)
  const fitScores = getFitScores(investor)
  const recentActivity = getRecentActivity(investor)
  const pipeline = PIPELINE_CONFIG[pipelineStatus]
  const score = investor.match_score
  const scoreColor = score >= 80 ? '#13DEB9' : score >= 65 ? '#5D87FF' : '#FFAE1F'
  const scoreBg = score >= 80 ? '#E6FFFA' : score >= 65 ? '#ECF2FF' : '#FEF5E5'

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: isSelected ? '1.5px solid #5D87FF' : '1px solid #e5eaef',
        transition: 'all 0.22s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(93,135,255,0.13)',
        },
      }}
    >
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Header ────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <Checkbox
            checked={isSelected}
            onChange={onToggleSelect}
            size="small"
            sx={{ p: 0, mt: 0.25, color: '#DDE3EE', '&.Mui-checked': { color: '#5D87FF' } }}
          />
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(investor.name)}&background=ECF2FF&color=5D87FF&bold=true&size=96`}
            alt={investor.name}
            sx={{ width: 52, height: 52, borderRadius: '13px', border: '2px solid #e5eaef', flexShrink: 0 }}
          >
            {investor.name.charAt(0)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, color: '#2A3547', fontSize: '0.9375rem', lineHeight: 1.3 }}>
              {investor.name}
            </Typography>
            {investor.firm && (
              <Typography sx={{ color: '#5A6A85', fontSize: '0.8rem', lineHeight: 1.4 }}>
                {investor.firm}
              </Typography>
            )}
            <Chip
              label={TYPE_LABELS[investor.investor_type] ?? investor.investor_type}
              size="small"
              sx={{ mt: 0.5, height: 18, fontSize: '0.65rem', fontWeight: 600, bgcolor: '#F6F8FB', color: '#7C8FAC', '& .MuiChip-label': { px: '6px' } }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.75, flexShrink: 0 }}>
            <Tooltip title="Overall AI Match Score">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: scoreBg,
                  border: `2.5px solid ${scoreColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}</Typography>
                <Typography sx={{ fontSize: '0.55rem', color: scoreColor, lineHeight: 1, opacity: 0.8 }}>fit</Typography>
              </Box>
            </Tooltip>

            {/* Pipeline status badge */}
            <Chip
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  {pipeline.icon}
                  <span>{pipeline.label}</span>
                  <IconChevronDown size={10} />
                </Box>
              }
              size="small"
              onClick={(e) => setPipelineAnchor(e.currentTarget)}
              sx={{
                height: 20,
                fontSize: '0.6rem',
                fontWeight: 600,
                bgcolor: pipeline.bg,
                color: pipeline.color,
                cursor: 'pointer',
                '& .MuiChip-label': { px: '6px' },
                '&:hover': { filter: 'brightness(0.95)' },
              }}
            />
            <Menu
              anchorEl={pipelineAnchor}
              open={Boolean(pipelineAnchor)}
              onClose={() => setPipelineAnchor(null)}
              PaperProps={{ sx: { borderRadius: '10px', minWidth: 160, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}
            >
              {PIPELINE_ORDER.map((status) => {
                const cfg = PIPELINE_CONFIG[status]
                return (
                  <MenuItem
                    key={status}
                    selected={pipelineStatus === status}
                    onClick={() => {
                      onPipelineStatusChange(status)
                      setPipelineAnchor(null)
                    }}
                    sx={{ fontSize: '0.8rem', gap: 1, py: 0.75 }}
                  >
                    <Box sx={{ color: cfg.color, display: 'flex' }}>{cfg.icon}</Box>
                    {cfg.label}
                  </MenuItem>
                )
              })}
            </Menu>
          </Box>
        </Box>

        {/* ── AI Insight ────────────────────────────── */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(93,135,255,0.06) 0%, rgba(19,222,185,0.06) 100%)',
            border: '1px solid rgba(93,135,255,0.15)',
            borderRadius: '10px',
            p: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <IconSparkles size={14} color="#5D87FF" />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#5D87FF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Why this investor?
            </Typography>
          </Box>
          <Stack spacing={0.6}>
            {aiReasons.map((reason, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 0.75, alignItems: 'flex-start' }}>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#13DEB9', mt: '5px', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#2A3547', lineHeight: 1.5 }}>{reason}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* ── Match Breakdown ───────────────────────── */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#7C8FAC', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.75 }}>
            Match Breakdown
          </Typography>
          <Stack spacing={0.8}>
            <FitBar label="Industry Fit" value={fitScores.industry} />
            <FitBar label="Stage Fit" value={fitScores.stage} />
            <FitBar label="Check Size Fit" value={fitScores.checkSize} />
          </Stack>
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#f0f3f7' }} />

        {/* ── Meta row ─────────────────────────────── */}
        <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 1.75 }}>
          {investor.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconMapPin size={13} color="#7C8FAC" />
              <Typography sx={{ fontSize: '0.75rem', color: '#5A6A85' }}>{investor.location}</Typography>
            </Box>
          )}
          {investmentRange && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#5A6A85', fontWeight: 600 }}>{investmentRange}</Typography>
            </Box>
          )}
          {investor.portfolio_count && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconBriefcase size={13} color="#7C8FAC" />
              <Typography sx={{ fontSize: '0.75rem', color: '#5A6A85' }}>{investor.portfolio_count} cos</Typography>
            </Box>
          )}
        </Stack>

        {/* ── Focus Area Tags ───────────────────────── */}
        <Stack direction="row" flexWrap="wrap" gap={0.6} sx={{ mb: 2 }}>
          {investor.focus_areas.slice(0, 3).map((area) => (
            <Chip
              key={area}
              label={area}
              size="small"
              sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontSize: '0.68rem', height: 20, fontWeight: 500, '& .MuiChip-label': { px: '7px' } }}
            />
          ))}
          {investor.focus_areas.length > 3 && (
            <Chip
              label={`+${investor.focus_areas.length - 3}`}
              size="small"
              sx={{ bgcolor: '#F6F8FB', color: '#7C8FAC', fontSize: '0.68rem', height: 20, '& .MuiChip-label': { px: '7px' } }}
            />
          )}
        </Stack>

        {/* ── Recent Activity ───────────────────────── */}
        <Box
          sx={{
            bgcolor: '#FAFBFD',
            borderRadius: '8px',
            p: 1.25,
            mb: 2,
            border: '1px solid #f0f3f7',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.75 }}>
            <IconActivity size={13} color="#7C8FAC" />
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#7C8FAC', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recent Activity
            </Typography>
          </Box>
          <Stack spacing={0.6}>
            {recentActivity.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                <Typography sx={{ fontSize: '0.73rem', color: '#2A3547', lineHeight: 1.4, flex: 1 }}>{item.text}</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#7C8FAC', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.date}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }} />
        <Divider sx={{ mb: 2, borderColor: '#f0f3f7' }} />

        {/* ── Actions ──────────────────────────────── */}
        <Stack spacing={1}>
          {/* Primary CTA */}
          <Button
            variant="contained"
            startIcon={<IconRocket size={15} />}
            onClick={onGenerateIntro}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              py: 1,
              borderRadius: '9px',
              letterSpacing: '0.01em',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #059669 100%)',
                boxShadow: '0 6px 20px rgba(37,99,235,0.4)',
              },
            }}
          >
            Generate Intro
          </Button>

          {/* Secondary actions */}
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={isSaved ? <IconCheck size={13} /> : <IconPlus size={13} />}
              onClick={() => !isSaved && onSaveToCRM?.()}
              sx={{
                flex: 1,
                fontSize: '0.72rem',
                py: 0.7,
                borderRadius: '8px',
                ...(isSaved
                  ? { borderColor: '#13DEB9', color: '#13DEB9', bgcolor: '#E6FFFA', '&:hover': { bgcolor: '#E6FFFA' }, cursor: 'default' }
                  : { borderColor: '#DDE3EE', color: '#5A6A85', '&:hover': { borderColor: '#5D87FF', color: '#5D87FF', bgcolor: '#ECF2FF' } }),
              }}
            >
              {isSaved ? 'In CRM' : 'Save to CRM'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={onViewProfile}
              sx={{
                flex: 1,
                fontSize: '0.72rem',
                py: 0.7,
                borderRadius: '8px',
                borderColor: '#DDE3EE',
                color: '#5A6A85',
                '&:hover': { borderColor: '#5D87FF', color: '#5D87FF', bgcolor: '#ECF2FF' },
              }}
            >
              View Profile
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
