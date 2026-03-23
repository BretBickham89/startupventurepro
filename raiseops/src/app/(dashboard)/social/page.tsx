'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Stack,
  LinearProgress,
} from '@mui/material'
import {
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandFacebook,
  IconPlus,
  IconCheck,
  IconLink,
  IconEye,
  IconHeart,
  IconMessage,
  IconShare,
} from '@tabler/icons-react'

interface Platform {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  bg: string
  connected: boolean
  followers?: number
  engagement?: string
}

interface Post {
  id: string
  platform: string
  platformIcon: React.ReactNode
  platformColor: string
  content: string
  date: string
  status: 'published' | 'scheduled' | 'draft'
  likes?: number
  comments?: number
  shares?: number
  reach?: number
}

const PLATFORMS: Platform[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <IconBrandLinkedin size={24} />,
    color: '#0077B5',
    bg: '#E3F2FD',
    connected: true,
    followers: 3842,
    engagement: '4.2%',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: <IconBrandTwitter size={24} />,
    color: '#1DA1F2',
    bg: '#E8F7FF',
    connected: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <IconBrandInstagram size={24} />,
    color: '#E1306C',
    bg: '#FCE4EC',
    connected: false,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <IconBrandFacebook size={24} />,
    color: '#1877F2',
    bg: '#E8F0FE',
    connected: false,
  },
]

const RECENT_POSTS: Post[] = [
  {
    id: '1',
    platform: 'LinkedIn',
    platformIcon: <IconBrandLinkedin size={16} />,
    platformColor: '#0077B5',
    content: 'The Future of AI in Healthcare: After 6 months of building in the trenches, here are the 5 biggest lessons learned about enterprise sales in health systems...',
    date: 'Mar 20, 2026',
    status: 'published',
    likes: 247,
    comments: 38,
    shares: 52,
    reach: 6840,
  },
  {
    id: '2',
    platform: 'LinkedIn',
    platformIcon: <IconBrandLinkedin size={16} />,
    platformColor: '#0077B5',
    content: 'Excited to announce we just closed our seed round! 🎉 12 months ago we were just an idea on a whiteboard. Today we have 1,243 paying customers...',
    date: 'Mar 17, 2026',
    status: 'published',
    likes: 892,
    comments: 124,
    shares: 203,
    reach: 24300,
  },
  {
    id: '3',
    platform: 'LinkedIn',
    platformIcon: <IconBrandLinkedin size={16} />,
    platformColor: '#0077B5',
    content: 'Building in public: Monthly metrics update for March. MRR: $24K (+18% MoM) | Churn: 2.1% | NPS: 72 | Team: 8 people...',
    date: 'Mar 15, 2026',
    status: 'published',
    likes: 183,
    comments: 29,
    shares: 41,
    reach: 4920,
  },
  {
    id: '4',
    platform: 'LinkedIn',
    platformIcon: <IconBrandLinkedin size={16} />,
    platformColor: '#0077B5',
    content: 'Co-founder spotlight: Meet Sarah, our CTO. She left a $380K Google job to build this with me. Here\'s why she made that bet...',
    date: 'Mar 28, 2026',
    status: 'scheduled',
    reach: 0,
  },
  {
    id: '5',
    platform: 'LinkedIn',
    platformIcon: <IconBrandLinkedin size={16} />,
    platformColor: '#0077B5',
    content: 'The $2.4 trillion market we are going after — and why incumbents can\'t move fast enough to stop us. Thread coming soon.',
    date: 'Apr 1, 2026',
    status: 'draft',
    reach: 0,
  },
]

const ANALYTICS_SUMMARY = [
  { label: 'Total Reach', value: '36.1K', change: '+28%', positive: true, icon: <IconEye size={20} /> },
  { label: 'Engagement Rate', value: '4.2%', change: '+0.8%', positive: true, icon: <IconHeart size={20} /> },
  { label: 'Followers (LinkedIn)', value: '3,842', change: '+284', positive: true, icon: <IconBrandLinkedin size={20} /> },
  { label: 'Total Posts', value: '28', change: '+8 this month', positive: true, icon: <IconMessage size={20} /> },
]

const STATUS_CONFIG = {
  published: { bg: '#E6FFFA', color: '#02b3a9', label: 'Published' },
  scheduled: { bg: '#ECF2FF', color: '#5D87FF', label: 'Scheduled' },
  draft: { bg: '#F2F6FA', color: '#5A6A85', label: 'Draft' },
}

export default function SocialMediaPage() {
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set(['linkedin']))

  const handleConnect = (platformId: string) => {
    setConnectedPlatforms((prev) => {
      const next = new Set(prev)
      if (next.has(platformId)) {
        next.delete(platformId)
      } else {
        next.add(platformId)
      }
      return next
    })
  }

  return (
    <Box>
      {/* Header */}
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
            Social Media
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Manage your founder brand and attract inbound investor interest
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
          Create Post
        </Button>
      </Box>

      {/* Analytics Summary */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {ANALYTICS_SUMMARY.map((stat) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
            <Card
              sx={{
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#ECF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5D87FF' }}>
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{ bgcolor: '#E6FFFA', color: '#02b3a9', fontSize: '0.65rem', height: 20, fontWeight: 600, '& .MuiChip-label': { px: '6px' } }}
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

      <Grid container spacing={2.5}>
        {/* Connected Platforms */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', mb: 2, fontSize: '1rem' }}>
                Connected Platforms
              </Typography>

              <Stack spacing={2}>
                {PLATFORMS.map((platform) => {
                  const isConnected = connectedPlatforms.has(platform.id)
                  return (
                    <Box
                      key={platform.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: isConnected ? platform.color + '40' : '#e5eaef',
                        bgcolor: isConnected ? platform.bg : '#F6F8FB',
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          bgcolor: isConnected ? platform.bg : '#F2F6FA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isConnected ? platform.color : '#7C8FAC',
                        }}
                      >
                        {platform.icon}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>
                          {platform.name}
                        </Typography>
                        {isConnected && platform.followers && (
                          <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                            {platform.followers.toLocaleString()} followers · {platform.engagement} engagement
                          </Typography>
                        )}
                        {!isConnected && (
                          <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                            Not connected
                          </Typography>
                        )}
                      </Box>

                      <Button
                        size="small"
                        variant={isConnected ? 'contained' : 'outlined'}
                        startIcon={isConnected ? <IconCheck size={14} /> : <IconLink size={14} />}
                        onClick={() => handleConnect(platform.id)}
                        sx={{
                          fontSize: '0.7rem',
                          py: 0.5,
                          px: 1.5,
                          flexShrink: 0,
                          ...(isConnected
                            ? { bgcolor: '#E6FFFA', color: '#02b3a9', border: 'none', '&:hover': { bgcolor: '#ccfff8' } }
                            : { borderColor: '#5D87FF', color: '#5D87FF', '&:hover': { bgcolor: '#ECF2FF' } }),
                        }}
                      >
                        {isConnected ? 'Connected' : 'Connect'}
                      </Button>
                    </Box>
                  )
                })}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Engagement Breakdown */}
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547', mb: 1.5 }}>
                LinkedIn Engagement
              </Typography>

              {[
                { label: 'Views', value: 36100, max: 50000, color: '#5D87FF' },
                { label: 'Likes', value: 1322, max: 2000, color: '#13DEB9' },
                { label: 'Comments', value: 191, max: 400, color: '#FFAE1F' },
                { label: 'Shares', value: 296, max: 500, color: '#7B61FF' },
              ].map((metric) => (
                <Box key={metric.label} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2A3547', fontWeight: 600 }}>
                      {metric.value.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(metric.value / metric.max) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 4,
                      bgcolor: '#F2F6FA',
                      '& .MuiLinearProgress-bar': { bgcolor: metric.color, borderRadius: 4 },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Posts Table */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2.5,
                py: 2,
                borderBottom: '1px solid #e5eaef',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', fontSize: '1rem' }}>
                Recent Posts
              </Typography>
              <Button size="small" sx={{ color: '#5D87FF', fontSize: '0.75rem' }}>
                View All
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { bgcolor: '#F6F8FB' } }}>
                    <TableCell>Post</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Engagement</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RECENT_POSTS.map((post) => {
                    const statusConfig = STATUS_CONFIG[post.status]
                    return (
                      <TableRow key={post.id} sx={{ '&:hover': { bgcolor: '#F6F8FB' } }}>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '8px',
                                bgcolor: '#E3F2FD',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: post.platformColor,
                                flexShrink: 0,
                                mt: 0.25,
                              }}
                            >
                              {post.platformIcon}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#2A3547',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                fontSize: '0.8125rem',
                              }}
                            >
                              {post.content}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: '#5A6A85', whiteSpace: 'nowrap' }}>
                            {post.date}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusConfig.label}
                            size="small"
                            sx={{
                              bgcolor: statusConfig.bg,
                              color: statusConfig.color,
                              fontSize: '0.7rem',
                              height: 22,
                              fontWeight: 600,
                              '& .MuiChip-label': { px: '8px' },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {post.status === 'published' && post.reach ? (
                            <Box>
                              <Typography variant="caption" sx={{ color: '#5A6A85', display: 'block' }}>
                                {post.reach.toLocaleString()} reach
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {post.likes !== undefined && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                    <IconHeart size={11} color="#FA896B" />
                                    <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.7rem' }}>
                                      {post.likes}
                                    </Typography>
                                  </Box>
                                )}
                                {post.comments !== undefined && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                    <IconMessage size={11} color="#5D87FF" />
                                    <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.7rem' }}>
                                      {post.comments}
                                    </Typography>
                                  </Box>
                                )}
                                {post.shares !== undefined && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                    <IconShare size={11} color="#13DEB9" />
                                    <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.7rem' }}>
                                      {post.shares}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          ) : (
                            <Typography variant="caption" sx={{ color: '#7C8FAC' }}>—</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
