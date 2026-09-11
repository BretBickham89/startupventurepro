'use client'

import React from 'react'
import Link from 'next/link'
import { Box, Container, Typography, Button } from '@mui/material'
import { IconArrowLeft } from '@tabler/icons-react'
import Logo from '@/components/layout/Logo'

interface MarketingPageShellProps {
  eyebrow?: string
  title: string
  subtitle?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg'
}

export default function MarketingPageShell({
  eyebrow,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}: MarketingPageShellProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <Box sx={{ borderBottom: '1px solid #e5eaef', py: 2.5 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo href="/" onLight />
          <Button
            component={Link}
            href="/"
            startIcon={<IconArrowLeft size={16} />}
            sx={{ color: '#5A6A85', textTransform: 'none' }}
          >
            Back to home
          </Button>
        </Container>
      </Box>

      <Container maxWidth={maxWidth} sx={{ py: { xs: 6, md: 9 } }}>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{ color: '#5D87FF', fontWeight: 700, letterSpacing: 1 }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#0D1B2A', mb: subtitle ? 1.5 : 4, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" sx={{ color: '#5A6A85', mb: 5, fontSize: '1.1rem', lineHeight: 1.7 }}>
            {subtitle}
          </Typography>
        )}
        {children}
      </Container>

      <Box sx={{ bgcolor: '#1a2236', color: 'rgba(255,255,255,0.5)', py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2">
            © {new Date().getFullYear()} Scalyn Inc. RaiseOps is a product of Scalyn. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
