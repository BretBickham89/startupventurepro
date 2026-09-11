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
  IconCircleDot,
  IconSend,
  IconMailForward,
  IconMessage2,
} from '@tabler/icons-react'
import type { Investor } from '@/lib/supabase/types'
import { getMatchReasons } from '@/lib/investors/insights'
import MatchScoreRing from './MatchScoreRing'

export type PipelineStatus = 'not-contacted' | 'draft-ready' | 'sent' | 'replied'

const PIPELINE_CONFIG: Record<PipelineStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  'not-contacted': {
    label: 'Not Contacted',
    color: '#64748B',
    bg: '#F1F5F9',
    icon: <IconCircleDot size={12} />,
  },
  'draft-ready': {
    label: 'Draft Ready',
    color: '#2563EB',
    bg: '#EFF6FF',
    icon: <IconMailForward size={12} />,
  },
  sent: {
    label: 'Sent',
    color: '#B45309',
    bg: '#FFFBEB',
    icon: <IconSend size={12} />,
  },
  replied: {
    label: 'Replied',
    color: '#0F9D6E',
    bg: '#ECFDF5',
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

  const topReason = getMatchReasons(investor)[0]
  const pipeline = PIPELINE_CONFIG[pipelineStatus]

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderColor: isSelected ? '#2563EB' : undefined,
        borderWidth: isSelected ? '1.5px' : undefined,
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 20px rgba(15,23,42,0.10)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Header ────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.5 }}>
          <Checkbox
            checked={isSelected}
            onChange={onToggleSelect}
            size="small"
            sx={{ p: 0, mt: 0.25, color: '#CBD5E1', '&.Mui-checked': { color: '#2563EB' } }}
          />
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(investor.name)}&background=EFF6FF&color=2563EB&bold=true&size=96`}
            alt={investor.name}
            sx={{ width: 44, height: 44, borderRadius: '11px', border: '1px solid #E2E8F0', flexShrink: 0 }}
          >
            {investor.name.charAt(0)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem', lineHeight: 1.3 }}>
              {investor.name}
            </Typography>
            {investor.firm && (
              <Typography sx={{ color: '#64748B', fontSize: '0.78rem', lineHeight: 1.4 }}>
                {investor.firm}
              </Typography>
            )}
          </Box>

          <Tooltip title={`${investor.match_score}% overall match`}>
            <Box>
              <MatchScoreRing score={investor.match_score} size={44} />
            </Box>
          </Tooltip>
        </Box>

        {/* ── Type + pipeline status ───────────────────── */}
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.75} sx={{ mb: 1.5 }}>
          <Chip
            label={TYPE_LABELS[investor.investor_type] ?? investor.investor_type}
            size="small"
            sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600, bgcolor: '#F1F5F9', color: '#64748B', '& .MuiChip-label': { px: '7px' } }}
          />
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
              fontSize: '0.65rem',
              fontWeight: 600,
              bgcolor: pipeline.bg,
              color: pipeline.color,
              cursor: 'pointer',
              '& .MuiChip-label': { px: '7px' },
              '&:hover': { filter: 'brightness(0.96)' },
            }}
          />
          <Menu
            anchorEl={pipelineAnchor}
            open={Boolean(pipelineAnchor)}
            onClose={() => setPipelineAnchor(null)}
            slotProps={{ paper: { sx: { borderRadius: '10px', minWidth: 160, boxShadow: '0 8px 24px rgba(15,23,42,0.14)' } } }}
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
        </Stack>

        {/* ── Top match reason ─────────────────────────── */}
        {topReason && (
          <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'flex-start', mb: 1.5 }}>
            <IconSparkles size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
            <Typography sx={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.45 }}>
              {topReason}
            </Typography>
          </Box>
        )}

        {/* ── Meta row ─────────────────────────────── */}
        <Stack direction="row" flexWrap="wrap" gap={1.25} sx={{ mb: 1.25 }}>
          {investor.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <IconMapPin size={12} color="#94A3B8" />
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{investor.location}</Typography>
            </Box>
          )}
          {investmentRange && (
            <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>{investmentRange}</Typography>
          )}
          {investor.portfolio_count && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <IconBriefcase size={12} color="#94A3B8" />
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{investor.portfolio_count} cos</Typography>
            </Box>
          )}
        </Stack>

        {/* ── Focus Area Tags ───────────────────────── */}
        <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
          {investor.focus_areas.slice(0, 3).map((area) => (
            <Chip
              key={area}
              label={area}
              size="small"
              sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontSize: '0.66rem', height: 19, fontWeight: 500, '& .MuiChip-label': { px: '7px' } }}
            />
          ))}
          {investor.focus_areas.length > 3 && (
            <Chip
              label={`+${investor.focus_areas.length - 3}`}
              size="small"
              sx={{ bgcolor: '#F1F5F9', color: '#94A3B8', fontSize: '0.66rem', height: 19, '& .MuiChip-label': { px: '7px' } }}
            />
          )}
        </Stack>

        <Box sx={{ flex: 1 }} />
        <Divider sx={{ mb: 1.75 }} />

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
              py: 0.9,
              boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #059669 100%)',
                boxShadow: '0 6px 18px rgba(37,99,235,0.32)',
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
                py: 0.6,
                ...(isSaved
                  ? { borderColor: '#A7F3D0', color: '#0F9D6E', bgcolor: '#ECFDF5', '&:hover': { bgcolor: '#ECFDF5' }, cursor: 'default' }
                  : { borderColor: '#E2E8F0', color: '#64748B', '&:hover': { borderColor: '#2563EB', color: '#2563EB', bgcolor: '#EFF6FF' } }),
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
                py: 0.6,
                borderColor: '#E2E8F0',
                color: '#64748B',
                '&:hover': { borderColor: '#2563EB', color: '#2563EB', bgcolor: '#EFF6FF' },
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
