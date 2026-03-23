'use client'

import React from 'react'
import Link from 'next/link'
import { Box, Typography } from '@mui/material'

interface LogoProps {
  collapsed?: boolean
  href?: string
  light?: boolean
}

export default function Logo({ collapsed = false, href = '/dashboard', light = true }: LogoProps) {
  return (
    <Box
      component={Link}
      href={href}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        textDecoration: 'none',
        '&:hover': { opacity: 0.9 },
      }}
    >
      {/* RaiseOps R lettermark — gradient R with upward arrow, matches brand logo */}
      <svg width="36" height="42" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ro-grad" x1="0" y1="44" x2="36" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        {/* Left vertical bar of R */}
        <rect x="0" y="0" width="8" height="44" rx="2" fill="url(#ro-grad)" />
        {/* Top horizontal bar of R */}
        <rect x="0" y="0" width="28" height="8" rx="2" fill="url(#ro-grad)" />
        {/* Middle horizontal bar of R */}
        <rect x="0" y="18" width="22" height="7" rx="2" fill="url(#ro-grad)" />
        {/* Bowl fill (right side, between top & middle bar) */}
        <rect x="20" y="0" width="8" height="26" rx="2" fill="url(#ro-grad)" />
        {/* Leg of R going diagonally down-right */}
        <path d="M18 25 L36 44" stroke="url(#ro-grad)" strokeWidth="8" strokeLinecap="round" />
        {/* Upward arrow — the iconic element from the logo */}
        <path d="M22 20 L34 4" stroke="url(#ro-grad)" strokeWidth="5" strokeLinecap="round" />
        <path d="M24 4 L34 4 L34 14" stroke="url(#ro-grad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {!collapsed && (
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: light ? '#FFFFFF' : '#1E293B',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            RaiseOps
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.62rem',
              color: '#10B981',
              lineHeight: 1.2,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            AI-Powered Capital Growth
          </Typography>
        </Box>
      )}
    </Box>
  )
}
