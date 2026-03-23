'use client'

import React, { useState, useEffect } from 'react'
import { Grid, Box, Typography, Button } from '@mui/material'
import { IconArrowRight } from '@tabler/icons-react'
import StatsGrid from '@/components/dashboard/StatsGrid'
import FundingChart from '@/components/dashboard/FundingChart'
import InvestorPipeline from '@/components/dashboard/InvestorPipeline'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const meta = user.user_metadata ?? {}
      const name = meta.full_name ?? meta.name ?? user.email?.split('@')[0] ?? ''
      setFirstName(name.split(' ')[0])
    }
    loadUser()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <Box>
      {/* Welcome header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
            {firstName ? `${greeting}, ${firstName} 👋` : `${greeting} 👋`}
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Here&apos;s what&apos;s happening with your fundraising today.
          </Typography>
        </Box>
        <Button
          variant="contained"
          endIcon={<IconArrowRight size={18} />}
          sx={{
            background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
            boxShadow: '0 4px 12px rgba(93, 135, 255, 0.3)',
          }}
          href="/investors"
        >
          Find Investors
        </Button>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ mb: 3 }}>
        <StatsGrid />
      </Box>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <FundingChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <InvestorPipeline />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  )
}
