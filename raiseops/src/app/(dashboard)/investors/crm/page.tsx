'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
} from '@mui/material'
import { IconPlus } from '@tabler/icons-react'
import CRMTable from '@/components/investors/CRMTable'
import type { CRMStatus } from '@/lib/supabase/types'

const PIPELINE_STAGES = [
  { label: 'Prospects', count: 23, color: '#5D87FF', bg: '#ECF2FF' },
  { label: 'Contacted', count: 18, color: '#49BEFF', bg: '#E8F7FF' },
  { label: 'Meetings', count: 8, color: '#FFAE1F', bg: '#FEF5E5' },
  { label: 'Due Diligence', count: 4, color: '#7B61FF', bg: '#F0EDFF' },
  { label: 'Term Sheet', count: 2, color: '#13DEB9', bg: '#E6FFFA' },
]

type TabValue = 'all' | 'active' | 'closed' | 'passed'

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('all')

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
            Investor CRM
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Track every interaction and manage your fundraising pipeline
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<IconPlus size={18} />}
          sx={{
            background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
            boxShadow: '0 4px 12px rgba(93, 135, 255, 0.3)',
          }}
        >
          Add Investor
        </Button>
      </Box>

      {/* Pipeline Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {PIPELINE_STAGES.map((stage) => (
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={stage.label}>
            <Card
              sx={{
                borderTop: `3px solid ${stage.color}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                <Typography
                  sx={{ fontSize: '1.75rem', fontWeight: 700, color: stage.color, lineHeight: 1.2 }}
                >
                  {stage.count}
                </Typography>
                <Typography variant="caption" sx={{ color: '#5A6A85', display: 'block', mt: 0.25 }}>
                  {stage.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CRM Table Card */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e5eaef',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #e5eaef', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5 }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value as TabValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  minWidth: 80,
                },
                '& .Mui-selected': { fontWeight: 600, color: '#5D87FF' },
                '& .MuiTabs-indicator': { bgcolor: '#5D87FF' },
              }}
            >
              <Tab label="All" value="all" />
              <Tab label="Active" value="active" />
              <Tab label="Closed" value="closed" />
              <Tab label="Passed" value="passed" />
            </Tabs>
          </Box>
        </Box>

        {/* Table */}
        <CRMTable statusFilter={activeTab} />
      </Paper>
    </Box>
  )
}
