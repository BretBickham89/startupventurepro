'use client'

import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'

interface FitBarProps {
  label: string
  value: number
}

export default function FitBar({ label, value }: FitBarProps) {
  const color = value >= 85 ? '#0F9D6E' : value >= 70 ? '#2563EB' : '#B45309'
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ fontSize: '0.72rem', color: '#64748B', width: 92, flexShrink: 0 }}>{label}</Typography>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          flex: 1,
          height: 5,
          borderRadius: 3,
          bgcolor: '#F1F5F9',
          '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: color },
        }}
      />
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color, width: 30, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  )
}
