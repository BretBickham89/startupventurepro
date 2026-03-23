import React from 'react'
import { Box, Typography } from '@mui/material'

interface PageContainerProps {
  title?: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  maxWidth?: string | number
}

export default function PageContainer({
  title,
  description,
  action,
  children,
  maxWidth = '100%',
}: PageContainerProps) {
  return (
    <Box sx={{ maxWidth, width: '100%' }}>
      {(title || action) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                {description}
              </Typography>
            )}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>
      )}
      {children}
    </Box>
  )
}
