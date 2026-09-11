'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { getMatchTier, type MatchTier } from '@/lib/investors/insights'

const TIER_COLOR: Record<MatchTier, string> = {
  strong: '#0F9D6E',
  good: '#2563EB',
  fair: '#B45309',
}

interface MatchScoreRingProps {
  score: number
  size?: number
}

export default function MatchScoreRing({ score, size = 46 }: MatchScoreRingProps) {
  const tier = getMatchTier(score)
  const color = TIER_COLOR[tier]
  const track = '#E7EBF2'
  const angle = Math.max(0, Math.min(100, score)) * 3.6

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `conic-gradient(${color} ${angle}deg, ${track} ${angle}deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: size - 7,
          height: size - 7,
          borderRadius: '50%',
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontSize: size >= 50 ? '1rem' : '0.8125rem', fontWeight: 700, color: '#1E293B', lineHeight: 1 }}>
          {score}
        </Typography>
        <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2, mt: '2px' }}>
          MATCH
        </Typography>
      </Box>
    </Box>
  )
}
