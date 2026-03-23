'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Box, Typography, Skeleton } from '@mui/material'
import DashboardCard from '@/components/shared/DashboardCard'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rectangular" height={280} sx={{ borderRadius: '8px' }} />
    </Box>
  ),
})

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

const SERIES = [
  {
    name: 'Investor Outreach',
    data: [12, 19, 15, 24, 31, 28],
  },
  {
    name: 'Meetings Scheduled',
    data: [3, 5, 4, 8, 10, 9],
  },
]

const chartOptions: ApexCharts.ApexOptions = {
  chart: {
    type: 'bar',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    toolbar: { show: false },
    animations: {
      enabled: true,
      speed: 800,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: MONTHS,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: '#5A6A85',
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#5A6A85',
        fontSize: '12px',
      },
    },
  },
  fill: { opacity: 1 },
  colors: ['#2563EB', '#10B981'],
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontSize: '12px',
    markers: {
      size: 8,
    },
  },
  grid: {
    borderColor: '#e5eaef',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  tooltip: {
    theme: 'light',
    style: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
  },
}

export default function FundingChart() {
  return (
    <DashboardCard
      title="Fundraising Pipeline"
      subtitle="Last 6 months activity"
      action={
        <Typography variant="caption" sx={{ color: '#5A6A85' }}>
          Oct 2025 – Mar 2026
        </Typography>
      }
    >
      <Box sx={{ mt: 1 }}>
        <ReactApexChart
          options={chartOptions}
          series={SERIES}
          type="bar"
          height={290}
        />
      </Box>
    </DashboardCard>
  )
}
