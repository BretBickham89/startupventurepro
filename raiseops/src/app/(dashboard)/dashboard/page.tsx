import React from 'react'
import { Grid, Box, Typography, Button } from '@mui/material'
import { IconArrowRight } from '@tabler/icons-react'
import StatsGrid from '@/components/dashboard/StatsGrid'
import FundingChart from '@/components/dashboard/FundingChart'
import InvestorPipeline from '@/components/dashboard/InvestorPipeline'
import RecentActivity from '@/components/dashboard/RecentActivity'

export const metadata = {
  title: 'Dashboard',
}

export default function DashboardPage() {
  return (
    <Box>
      {/* Welcome header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
            Good morning, Jane 👋
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
