import React from 'react'
import { Box, Typography } from '@mui/material'

interface LegalSectionProps {
  heading: string
  children: React.ReactNode
}

export default function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2A3547', mb: 1 }}>
        {heading}
      </Typography>
      <Typography variant="body2" sx={{ color: '#5A6A85', lineHeight: 1.8 }}>
        {children}
      </Typography>
    </Box>
  )
}
