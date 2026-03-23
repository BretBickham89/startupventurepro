'use client'

import React from 'react'
import Image from 'next/image'
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
} from '@mui/material'
import { IconMapPin, IconBriefcase, IconPlus, IconCheck } from '@tabler/icons-react'
import type { Investor } from '@/lib/supabase/types'

interface InvestorCardProps {
  investor: Investor
  onSaveToCRM?: (investor: Investor) => void
  onViewProfile?: (investor: Investor) => void
  isSaved?: boolean
}

function MatchScore({ score }: { score: number }) {
  const color = score >= 80 ? '#13DEB9' : score >= 60 ? '#FFAE1F' : '#FA896B'
  const bg = score >= 80 ? '#E6FFFA' : score >= 60 ? '#FEF5E5' : '#FDEDE8'

  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        bgcolor: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${color}`,
        flexShrink: 0,
      }}
    >
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color, lineHeight: 1 }}>
        {score}
      </Typography>
      <Typography sx={{ fontSize: '0.55rem', color, lineHeight: 1 }}>fit</Typography>
    </Box>
  )
}

const TYPE_LABELS: Record<string, string> = {
  angel: 'Angel',
  vc: 'VC',
  'family-office': 'Family Office',
  corporate: 'Corporate',
  accelerator: 'Accelerator',
}

export default function InvestorCard({ investor, onSaveToCRM, onViewProfile, isSaved = false }: InvestorCardProps) {
  const formatAmount = (amount: number | null) => {
    if (!amount) return null
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount}`
  }

  const investmentRange =
    investor.investment_range_min && investor.investment_range_max
      ? `${formatAmount(investor.investment_range_min)} – ${formatAmount(investor.investment_range_max)}`
      : investor.investment_range_min
      ? `From ${formatAmount(investor.investment_range_min)}`
      : null

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            src={investor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(investor.name)}&background=ECF2FF&color=5D87FF&bold=true`}
            alt={investor.name}
            sx={{ width: 48, height: 48, borderRadius: '12px', border: '2px solid #e5eaef' }}
          >
            {investor.name.charAt(0)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: '#2A3547', fontSize: '0.9375rem', lineHeight: 1.3 }}
            >
              {investor.name}
            </Typography>
            {investor.firm && (
              <Typography variant="body2" sx={{ color: '#5A6A85', fontSize: '0.8125rem' }}>
                {investor.firm}
              </Typography>
            )}
          </Box>

          <MatchScore score={investor.match_score} />
        </Box>

        {/* Meta info */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          {investor.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconMapPin size={13} color="#7C8FAC" />
              <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                {investor.location}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconBriefcase size={13} color="#7C8FAC" />
            <Typography variant="caption" sx={{ color: '#5A6A85' }}>
              {TYPE_LABELS[investor.investor_type] || investor.investor_type}
            </Typography>
          </Box>
        </Stack>

        {/* Focus Areas */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {investor.focus_areas.slice(0, 3).map((area) => (
              <Chip
                key={area}
                label={area}
                size="small"
                sx={{
                  bgcolor: '#ECF2FF',
                  color: '#5D87FF',
                  fontSize: '0.7rem',
                  height: 22,
                  fontWeight: 500,
                  '& .MuiChip-label': { px: '8px' },
                }}
              />
            ))}
            {investor.focus_areas.length > 3 && (
              <Chip
                label={`+${investor.focus_areas.length - 3}`}
                size="small"
                sx={{
                  bgcolor: '#F6F8FB',
                  color: '#5A6A85',
                  fontSize: '0.7rem',
                  height: 22,
                  '& .MuiChip-label': { px: '8px' },
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Investment range + portfolio */}
        {(investmentRange || investor.portfolio_count) && (
          <Box
            sx={{
              bgcolor: '#F6F8FB',
              borderRadius: '8px',
              p: 1.5,
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {investmentRange && (
              <Box>
                <Typography variant="caption" sx={{ color: '#7C8FAC', display: 'block' }}>
                  Check Size
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547', fontSize: '0.8125rem' }}>
                  {investmentRange}
                </Typography>
              </Box>
            )}
            {investor.portfolio_count && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#7C8FAC', display: 'block' }}>
                  Portfolio
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547', fontSize: '0.8125rem' }}>
                  {investor.portfolio_count} companies
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Funding stages */}
        <Box sx={{ mb: 2, flex: 1 }}>
          <Stack direction="row" flexWrap="wrap" gap={0.5}>
            {investor.funding_stages.map((stage) => (
              <Chip
                key={stage}
                label={stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' ')}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: '#e5eaef',
                  color: '#5A6A85',
                  fontSize: '0.65rem',
                  height: 20,
                  '& .MuiChip-label': { px: '6px' },
                }}
              />
            ))}
          </Stack>
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#e5eaef' }} />

        {/* Actions */}
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={isSaved ? <IconCheck size={14} /> : <IconPlus size={14} />}
            onClick={() => !isSaved && onSaveToCRM?.(investor)}
            sx={{
              flex: 1,
              fontSize: '0.75rem',
              py: 0.75,
              ...(isSaved
                ? { borderColor: '#13DEB9', color: '#13DEB9', bgcolor: '#E6FFFA', '&:hover': { bgcolor: '#E6FFFA' }, cursor: 'default' }
                : { borderColor: '#5D87FF', color: '#5D87FF', '&:hover': { bgcolor: '#ECF2FF' } }),
            }}
          >
            {isSaved ? 'Saved' : 'Save to CRM'}
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => onViewProfile?.(investor)}
            sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
              fontSize: '0.75rem',
              py: 0.75,
            }}
          >
            View Profile
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
