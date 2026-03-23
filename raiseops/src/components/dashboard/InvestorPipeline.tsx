'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Box, Typography, Stack, Skeleton } from '@mui/material'
import DashboardCard from '@/components/shared/DashboardCard'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Skeleton variant="circular" width={200} height={200} />
    </Box>
  ),
})

const PIPELINE_DATA = [
  { stage: 'Prospect', count: 23, color: '#2563EB' },
  { stage: 'Contacted', count: 18, color: '#10B981' },
  { stage: 'Meeting Scheduled', count: 8, color: '#FFAE1F' },
  { stage: 'Due Diligence', count: 4, color: '#7B61FF' },
  { stage: 'Term Sheet', count: 2, color: '#13DEB9' },
]

const TOTAL = PIPELINE_DATA.reduce((sum, d) => sum + d.count, 0)

const chartOptions: ApexCharts.ApexOptions = {
  chart: {
    type: 'donut',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    toolbar: { show: false },
  },
  labels: PIPELINE_DATA.map((d) => d.stage),
  colors: PIPELINE_DATA.map((d) => d.color),
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '13px',
            fontWeight: 500,
            color: '#5A6A85',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          },
          value: {
            show: true,
            fontSize: '24px',
            fontWeight: 700,
            color: '#0D1B2A',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          },
          total: {
            show: true,
            label: 'Total',
            fontSize: '12px',
            fontWeight: 500,
            color: '#5A6A85',
            formatter: () => String(TOTAL),
          },
        },
      },
    },
  },
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    style: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
  },
}

export default function InvestorPipeline() {
  return (
    <DashboardCard
      title="Investor Pipeline"
      subtitle="Current CRM stage breakdown"
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
        <ReactApexChart
          options={chartOptions}
          series={PIPELINE_DATA.map((d) => d.count)}
          type="donut"
          height={220}
          width={220}
        />
      </Box>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {PIPELINE_DATA.map((item) => (
          <Box
            key={item.stage}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: item.color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                {item.stage}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#0D1B2A', fontWeight: 600 }}>
                {item.count}
              </Typography>
              <Typography variant="caption" sx={{ color: '#7C8FAC', width: 36, textAlign: 'right' }}>
                {Math.round((item.count / TOTAL) * 100)}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </DashboardCard>
  )
}
