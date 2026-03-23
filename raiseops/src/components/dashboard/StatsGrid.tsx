'use client'

import React from 'react'
import { Grid, Card, CardContent, Box, Typography, Chip } from '@mui/material'
import {
  IconBuildingBank,
  IconCoin,
  IconFileText,
  IconCalendarEvent,
  IconArrowUpRight,
  IconArrowDownRight,
} from '@tabler/icons-react'

interface StatCard {
  title: string
  value: string
  subtitle: string
  trend: string
  trendPositive: boolean
  icon: React.ReactNode
  color: string
  bg: string
  iconBg: string
}

const STATS: StatCard[] = [
  {
    title: 'Investors Contacted',
    value: '47',
    subtitle: 'Total in pipeline',
    trend: '+12% this month',
    trendPositive: true,
    icon: <IconBuildingBank size={22} />,
    color: '#2563EB',
    bg: '#ECF2FF',
    iconBg: '#ECF2FF',
  },
  {
    title: 'Funding Progress',
    value: '$2.5M',
    subtitle: 'of $5M target (50%)',
    trend: '+$320K this week',
    trendPositive: true,
    icon: <IconCoin size={22} />,
    color: '#13DEB9',
    bg: '#E6FFFA',
    iconBg: '#E6FFFA',
  },
  {
    title: 'Posts Published',
    value: '28',
    subtitle: 'Across all platforms',
    trend: '+8 this week',
    trendPositive: true,
    icon: <IconFileText size={22} />,
    color: '#7B61FF',
    bg: '#F0EDFF',
    iconBg: '#F0EDFF',
  },
  {
    title: 'Investor Meetings',
    value: '12',
    subtitle: '3 upcoming scheduled',
    trend: '-2 from last month',
    trendPositive: false,
    icon: <IconCalendarEvent size={22} />,
    color: '#FFAE1F',
    bg: '#FEF5E5',
    iconBg: '#FEF5E5',
  },
]

export default function StatsGrid() {
  return (
    <Grid container spacing={2.5}>
      {STATS.map((stat) => (
        <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={stat.title}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid #e5eaef',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0px 6px 16px rgba(0,0,0,0.1)',
              },
            }}
          >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: stat.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Chip
                  size="small"
                  label={stat.trend}
                  icon={
                    stat.trendPositive ? (
                      <IconArrowUpRight size={12} />
                    ) : (
                      <IconArrowDownRight size={12} />
                    )
                  }
                  sx={{
                    bgcolor: stat.trendPositive ? '#E6FFFA' : '#FDEDE8',
                    color: stat.trendPositive ? '#02b3a9' : '#f3704d',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    height: 22,
                    '& .MuiChip-icon': {
                      color: stat.trendPositive ? '#02b3a9' : '#f3704d',
                      ml: '4px',
                    },
                    '& .MuiChip-label': { px: '8px' },
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#0D1B2A',
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: '#0D1B2A', fontWeight: 500, mb: 0.25 }}>
                {stat.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                {stat.subtitle}
              </Typography>

              {/* Progress bar for funding */}
              {stat.title === 'Funding Progress' && (
                <Box sx={{ mt: 1.5 }}>
                  <Box sx={{ bgcolor: '#F6F8FB', borderRadius: 4, height: 6 }}>
                    <Box
                      sx={{
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #13DEB9 0%, #02b3a9 100%)',
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
