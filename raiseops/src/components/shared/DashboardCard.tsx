import React from 'react'
import { Card, CardContent, Box, Typography, Divider } from '@mui/material'

interface DashboardCardProps {
  title?: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  noPadding?: boolean
  sx?: object
}

export default function DashboardCard({
  title,
  subtitle,
  action,
  children,
  noPadding = false,
  sx = {},
}: DashboardCardProps) {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
        border: '1px solid #e5eaef',
        overflow: 'hidden',
        height: '100%',
        ...sx,
      }}
    >
      {(title || action) && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.5,
              py: 2,
            }}
          >
            <Box>
              {title && (
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', fontSize: '1rem' }}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action && <Box>{action}</Box>}
          </Box>
          <Divider sx={{ borderColor: '#e5eaef' }} />
        </>
      )}
      {noPadding ? (
        children
      ) : (
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>{children}</CardContent>
      )}
    </Card>
  )
}
