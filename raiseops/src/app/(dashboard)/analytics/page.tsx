'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Skeleton,
  LinearProgress,
} from '@mui/material'
import {
  IconEye,
  IconHeart,
  IconMessage,
  IconShare,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconTrendingUp,
  IconUsers,
  IconPlus,
  IconChartBar,
} from '@tabler/icons-react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height={260} sx={{ borderRadius: '8px', m: 2 }} />,
})

// ─── Mock Data ────────────────────────────────────────────────────────────

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

const contentPerfSeries = [
  { name: 'LinkedIn', data: [4200, 6800, 5300, 9100, 14200, 12000] },
  { name: 'Twitter/X', data: [1100, 1800, 2200, 2900, 4800, 3600] },
]

const engagementTrendSeries = [
  { name: 'Engagement Rate %', data: [2.1, 3.4, 3.1, 4.0, 4.8, 4.2] },
]

const investorInteractionSeries = [
  { name: 'Interactions', data: [3, 5, 4, 8, 11, 9] },
]

interface InvestorRow {
  id: string
  name: string
  firm: string
  lastInteraction: string
  type: string
  linkedPost: string
  status: string
}

const INVESTOR_INTERACTIONS: InvestorRow[] = [
  { id: '1', name: 'Sarah Kim', firm: 'Sequoia Capital', lastInteraction: 'Mar 18, 2026', type: 'Meeting', linkedPost: 'Seed Announcement', status: 'Active' },
  { id: '2', name: 'Aisha Okonkwo', firm: 'Bessemer VP', lastInteraction: 'Mar 15, 2026', type: 'Email Reply', linkedPost: 'Metrics Update', status: 'Warm' },
  { id: '3', name: 'James Okafor', firm: 'YC Alumni Angels', lastInteraction: 'Mar 12, 2026', type: 'LinkedIn DM', linkedPost: 'AI Healthcare Post', status: 'Active' },
  { id: '4', name: 'Priya Mehta', firm: 'First Round', lastInteraction: 'Mar 7, 2026', type: 'Intro Call', linkedPost: 'Founder Story', status: 'Warm' },
  { id: '5', name: 'Christina Park', firm: 'GV', lastInteraction: 'Feb 28, 2026', type: 'Email', linkedPost: 'Product Launch', status: 'Cold' },
]

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  Active: { bg: '#E6FFFA', color: '#02b3a9' },
  Warm: { bg: '#FEF5E5', color: '#FFAE1F' },
  Cold: { bg: '#F2F6FA', color: '#5A6A85' },
}

// ─── Chart Options ───────────────────────────────────────────────────────

const barOptions: ApexCharts.ApexOptions = {
  chart: { type: 'bar', fontFamily: '"Plus Jakarta Sans", sans-serif', toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
  plotOptions: { bar: { horizontal: false, columnWidth: '48%', borderRadius: 4, borderRadiusApplication: 'end' } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: MONTHS,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#5A6A85', fontSize: '12px' } },
  },
  yaxis: { labels: { style: { colors: '#5A6A85', fontSize: '12px' } } },
  colors: ['#2563EB', '#10B981'],
  grid: { borderColor: '#e5eaef', strokeDashArray: 4 },
  legend: { position: 'top', horizontalAlign: 'right', fontSize: '12px' },
  tooltip: { theme: 'light' },
}

const lineOptions: ApexCharts.ApexOptions = {
  chart: { type: 'line', fontFamily: '"Plus Jakarta Sans", sans-serif', toolbar: { show: false }, animations: { enabled: true } },
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 5, colors: ['#2563EB'], strokeColors: '#fff', strokeWidth: 2 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: MONTHS,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#5A6A85', fontSize: '12px' } },
  },
  yaxis: {
    min: 0,
    max: 7,
    tickAmount: 7,
    labels: {
      formatter: (v) => `${v}%`,
      style: { colors: '#5A6A85', fontSize: '12px' },
    },
  },
  colors: ['#2563EB'],
  grid: { borderColor: '#e5eaef', strokeDashArray: 4 },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light', type: 'vertical', shadeIntensity: 0.3,
      gradientToColors: ['#10B981'], opacityFrom: 0.15, opacityTo: 0.01,
    },
  },
  tooltip: { theme: 'light', y: { formatter: (v) => `${v}%` } },
}

const investorBarOptions: ApexCharts.ApexOptions = {
  chart: { type: 'bar', fontFamily: '"Plus Jakarta Sans", sans-serif', toolbar: { show: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 4, borderRadiusApplication: 'end' } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: MONTHS,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#5A6A85', fontSize: '12px' } },
  },
  yaxis: { labels: { style: { colors: '#5A6A85', fontSize: '12px' } } },
  colors: ['#7B61FF'],
  grid: { borderColor: '#e5eaef', strokeDashArray: 4 },
  tooltip: { theme: 'light' },
}

// ─── Manual Entry Dialog ─────────────────────────────────────────────────

interface ManualEntry {
  platform: string
  postTitle: string
  reach: string
  likes: string
  comments: string
  shares: string
}

function ManualEntryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [entry, setEntry] = useState<ManualEntry>({
    platform: 'linkedin',
    postTitle: '',
    reach: '',
    likes: '',
    comments: '',
    shares: '',
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Add Post Performance</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Platform"
            select
            fullWidth
            size="small"
            value={entry.platform}
            onChange={(e) => setEntry({ ...entry, platform: e.target.value })}
          >
            <MenuItem value="linkedin">LinkedIn</MenuItem>
            <MenuItem value="twitter">Twitter/X</MenuItem>
          </TextField>
          <TextField
            label="Post Title / Topic"
            fullWidth
            size="small"
            value={entry.postTitle}
            onChange={(e) => setEntry({ ...entry, postTitle: e.target.value })}
          />
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6 }}>
              <TextField label="Reach" fullWidth size="small" type="number" value={entry.reach} onChange={(e) => setEntry({ ...entry, reach: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField label="Likes" fullWidth size="small" type="number" value={entry.likes} onChange={(e) => setEntry({ ...entry, likes: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField label="Comments" fullWidth size="small" type="number" value={entry.comments} onChange={(e) => setEntry({ ...entry, comments: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField label="Shares" fullWidth size="small" type="number" value={entry.shares} onChange={(e) => setEntry({ ...entry, shares: e.target.value })} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#5A6A85' }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' }}
        >
          Save Entry
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ─── Page Component ──────────────────────────────────────────────────────

const STATS = [
  { label: 'Total Reach', value: '36.1K', change: '+28% vs last month', icon: <IconEye size={20} />, color: '#5D87FF', bg: '#ECF2FF' },
  { label: 'Avg Engagement', value: '4.2%', change: '+0.8pp vs last month', icon: <IconHeart size={20} />, color: '#13DEB9', bg: '#E6FFFA' },
  { label: 'Total Posts', value: '28', change: '+8 this month', icon: <IconMessage size={20} />, color: '#FFAE1F', bg: '#FEF5E5' },
  { label: 'Investor Interactions', value: '12', change: '+4 correlated to posts', icon: <IconUsers size={20} />, color: '#7B61FF', bg: '#F2EDFF' },
]

const CHANNEL_BREAKDOWN = [
  { channel: 'LinkedIn', posts: 22, reach: 31200, engagementRate: '4.8%', icon: <IconBrandLinkedin size={16} />, color: '#0077B5' },
  { channel: 'Twitter/X', posts: 6, reach: 4900, engagementRate: '2.1%', icon: <IconBrandTwitter size={16} />, color: '#1DA1F2' },
]

export default function AnalyticsPage() {
  const [manualEntryOpen, setManualEntryOpen] = useState(false)

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547' }}>
              Analytics
            </Typography>
            <Chip
              label="Content + Investors"
              size="small"
              sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontWeight: 700, fontSize: '0.65rem', height: 22 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Track content performance, engagement trends, and investor interaction correlation
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<IconPlus size={16} />}
          onClick={() => setManualEntryOpen(true)}
          sx={{ borderColor: '#5D87FF', color: '#5D87FF', '&:hover': { bgcolor: '#ECF2FF' } }}
        >
          Add Performance Data
        </Button>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {STATS.map((stat) => (
          <Grid size={{ xs: 6, lg: 3 }} key={stat.label}>
            <Card sx={{ transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' } }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{ bgcolor: '#E6FFFA', color: '#02b3a9', fontSize: '0.6rem', height: 18, fontWeight: 600, '& .MuiChip-label': { px: '5px' } }}
                  />
                </Box>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#2A3547', lineHeight: 1.2 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Content Performance */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2.5 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#2A3547', fontSize: '0.9375rem' }}>Content Reach by Channel</Typography>
                <Typography variant="caption" sx={{ color: '#5A6A85' }}>Impressions over last 6 months</Typography>
              </Box>
              <Box sx={{ color: '#5D87FF' }}><IconChartBar size={20} /></Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <ReactApexChart options={barOptions} series={contentPerfSeries} type="bar" height={260} />
            </Box>
          </Card>
        </Grid>

        {/* Channel Breakdown */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, color: '#2A3547', mb: 2, fontSize: '0.9375rem' }}>
                Channel Breakdown
              </Typography>
              <Stack spacing={2.5}>
                {CHANNEL_BREAKDOWN.map((ch) => (
                  <Box key={ch.channel}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: ch.color }}>{ch.icon}</Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>{ch.channel}</Typography>
                      </Box>
                      <Chip label={ch.engagementRate} size="small" sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontSize: '0.7rem', height: 20, fontWeight: 700, '& .MuiChip-label': { px: '6px' } }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography variant="caption" sx={{ color: '#5A6A85' }}>{ch.posts} posts</Typography>
                      <Typography variant="caption" sx={{ color: '#5A6A85', fontWeight: 600 }}>{ch.reach.toLocaleString()} reach</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={ch.channel === 'LinkedIn' ? 86 : 14}
                      sx={{ height: 6, borderRadius: 4, bgcolor: '#F2F6FA', '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: ch.color } }}
                    />
                  </Box>
                ))}
              </Stack>

              <Box sx={{ mt: 3, p: 2, bgcolor: '#F6F8FB', borderRadius: '10px' }}>
                <Typography variant="caption" sx={{ color: '#5A6A85', fontWeight: 600, display: 'block', mb: 1 }}>
                  Total Engagement
                </Typography>
                {[
                  { label: 'Likes', value: 1322, color: '#FA896B' },
                  { label: 'Comments', value: 191, color: '#5D87FF' },
                  { label: 'Shares', value: 296, color: '#13DEB9' },
                ].map((m) => (
                  <Box key={m.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#5A6A85' }}>{m.label}</Typography>
                    <Typography variant="caption" sx={{ color: m.color, fontWeight: 700 }}>{m.value.toLocaleString()}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Engagement Trend + Investor Correlation */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2.5 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#2A3547', fontSize: '0.9375rem' }}>Engagement Rate Trend</Typography>
                <Typography variant="caption" sx={{ color: '#5A6A85' }}>% across all published posts</Typography>
              </Box>
              <Box sx={{ color: '#10B981' }}><IconTrendingUp size={20} /></Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <ReactApexChart options={lineOptions} series={engagementTrendSeries} type="area" height={220} />
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2.5 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#2A3547', fontSize: '0.9375rem' }}>Investor Interactions</Typography>
                <Typography variant="caption" sx={{ color: '#5A6A85' }}>Meetings, replies, DMs correlated to content</Typography>
              </Box>
              <Box sx={{ color: '#7B61FF' }}><IconUsers size={20} /></Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <ReactApexChart options={investorBarOptions} series={investorInteractionSeries} type="bar" height={220} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Investor Engagement Table */}
      <Card>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid #e5eaef' }}>
          <Typography sx={{ fontWeight: 700, color: '#2A3547', fontSize: '0.9375rem' }}>
            Investor Engagement Log
          </Typography>
          <Typography variant="caption" sx={{ color: '#5A6A85' }}>
            Interactions correlated to published content
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { bgcolor: '#F6F8FB', fontWeight: 600, fontSize: '0.78rem', color: '#5A6A85' } }}>
                <TableCell>Investor</TableCell>
                <TableCell>Last Interaction</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Linked Post</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {INVESTOR_INTERACTIONS.map((row) => {
                const s = STATUS_COLOR[row.status] ?? STATUS_COLOR.Cold
                return (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#F6F8FB' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>{row.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#7C8FAC' }}>{row.firm}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#5A6A85' }}>{row.lastInteraction}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.type} size="small" sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontSize: '0.7rem', height: 20, fontWeight: 600, '& .MuiChip-label': { px: '7px' } }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#5A6A85' }}>{row.linkedPost}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.status} size="small" sx={{ bgcolor: s.bg, color: s.color, fontSize: '0.7rem', height: 20, fontWeight: 600, '& .MuiChip-label': { px: '7px' } }} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <ManualEntryDialog open={manualEntryOpen} onClose={() => setManualEntryOpen(false)} />
    </Box>
  )
}
