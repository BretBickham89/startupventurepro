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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stack,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Snackbar,
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
  IconSparkles,
  IconRocket,
  IconCalendar,
} from '@tabler/icons-react'
import type { SocialPost, SocialBatch } from '@/lib/ai/schemas'

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

interface AIIntakeForm {
  milestones: string
  metrics: string
  eventDates: string
  productNotes: string
  channels: { linkedin: boolean; twitter: boolean }
  tone: 'technical' | 'founder' | 'growth'
  postCount: number
}

const DEFAULT_INTAKE: AIIntakeForm = {
  milestones: '',
  metrics: '',
  eventDates: '',
  productNotes: '',
  channels: { linkedin: true, twitter: false },
  tone: 'founder',
  postCount: 6,
}

function AIContentDialog({
  open,
  onClose,
  companyName,
  onAddPosts,
}: {
  open: boolean
  onClose: () => void
  companyName: string
  onAddPosts: (posts: Post[]) => void
}) {
  const [intake, setIntake] = useState<AIIntakeForm>(DEFAULT_INTAKE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [batch, setBatch] = useState<SocialBatch | null>(null)
  const [approved, setApproved] = useState<Set<number>>(new Set())

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    setBatch(null)
    setApproved(new Set())

    const channels: ('linkedin' | 'twitter')[] = []
    if (intake.channels.linkedin) channels.push('linkedin')
    if (intake.channels.twitter) channels.push('twitter')
    if (channels.length === 0) {
      setError('Select at least one channel.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/ai/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestones: intake.milestones,
          metrics: intake.metrics,
          eventDates: intake.eventDates,
          productNotes: intake.productNotes,
          channels,
          tone: intake.tone,
          companyName: companyName || 'our startup',
          postCount: intake.postCount,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to generate content.')
      } else {
        setBatch(data.batch)
        // Pre-approve all
        setApproved(new Set(data.batch.posts.map((_: SocialPost, i: number) => i)))
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleApprove = (i: number) => {
    setApproved((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const handleSchedule = () => {
    if (!batch) return
    const newPosts: Post[] = batch.posts
      .filter((_, i) => approved.has(i))
      .map((p, i) => {
        const platformConfig = PLATFORMS.find((pl) => pl.id === p.platform)
        const schedDate = batch.suggested_schedule[i]
        const date = schedDate
          ? new Date(schedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Draft'
        return {
          id: `ai-${Date.now()}-${i}`,
          platform: p.platform === 'linkedin' ? 'LinkedIn' : 'Twitter / X',
          platformIcon: p.platform === 'linkedin'
            ? <IconBrandLinkedin size={16} />
            : <IconBrandTwitter size={16} />,
          platformColor: platformConfig?.color ?? '#5D87FF',
          content: p.content,
          date,
          status: 'scheduled' as const,
        }
      })
    onAddPosts(newPosts)
    onClose()
    setIntake(DEFAULT_INTAKE)
    setBatch(null)
  }

  const canGenerate = (intake.milestones.trim() || intake.metrics.trim()) && !loading

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: '14px' } }}
    >
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconSparkles size={18} color="#fff" />
        </Box>
        AI Content Generator
      </DialogTitle>
      <DialogContent>
        {!batch ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Typography variant="body2" sx={{ color: '#5A6A85' }}>
              Describe your milestones and metrics — AI will generate a batch of ready-to-post content.
            </Typography>

            <TextField
              label="Milestones & Events"
              fullWidth
              multiline
              rows={3}
              placeholder="Closed seed round, launched V2, signed 3 enterprise customers, spoke at TechCrunch..."
              value={intake.milestones}
              onChange={(e) => setIntake({ ...intake, milestones: e.target.value })}
            />

            <TextField
              label="Key Metrics"
              fullWidth
              multiline
              rows={2}
              placeholder="MRR $24K (+18% MoM), 1,243 paying customers, NPS 72, churn 2.1%..."
              value={intake.metrics}
              onChange={(e) => setIntake({ ...intake, metrics: e.target.value })}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Upcoming Dates (optional)"
                  fullWidth
                  size="small"
                  placeholder="Demo Day: Apr 5, Product Hunt launch: Apr 10"
                  value={intake.eventDates}
                  onChange={(e) => setIntake({ ...intake, eventDates: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Product Notes (optional)"
                  fullWidth
                  size="small"
                  placeholder="New AI feature, integration with Salesforce..."
                  value={intake.productNotes}
                  onChange={(e) => setIntake({ ...intake, productNotes: e.target.value })}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField
                  label="Tone"
                  select
                  fullWidth
                  size="small"
                  value={intake.tone}
                  onChange={(e) => setIntake({ ...intake, tone: e.target.value as AIIntakeForm['tone'] })}
                >
                  <MenuItem value="founder">Founder (authentic, story-driven)</MenuItem>
                  <MenuItem value="growth">Growth (metrics-focused)</MenuItem>
                  <MenuItem value="technical">Technical (deep-dive)</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="# of Posts"
                  select
                  fullWidth
                  size="small"
                  value={intake.postCount}
                  onChange={(e) => setIntake({ ...intake, postCount: Number(e.target.value) })}
                >
                  {[3, 5, 6, 8, 10].map((n) => <MenuItem key={n} value={n}>{n} posts</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={intake.channels.linkedin} onChange={(e) => setIntake({ ...intake, channels: { ...intake.channels, linkedin: e.target.checked } })} />}
                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><IconBrandLinkedin size={15} color="#0077B5" /><Typography variant="caption" sx={{ fontWeight: 600 }}>LinkedIn</Typography></Box>}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={intake.channels.twitter} onChange={(e) => setIntake({ ...intake, channels: { ...intake.channels, twitter: e.target.checked } })} />}
                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><IconBrandTwitter size={15} color="#1DA1F2" /><Typography variant="caption" sx={{ fontWeight: 600 }}>Twitter</Typography></Box>}
                  />
                </Box>
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ borderRadius: '8px', fontSize: '0.8125rem' }}>
                {error}
              </Alert>
            )}
          </Box>
        ) : (
          <Box sx={{ pt: 1 }}>
            <Box sx={{ p: 1.5, bgcolor: '#E6FFFA', borderRadius: '8px', border: '1px solid #13DEB940', mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#02b3a9', fontWeight: 600 }}>
                Theme: {batch.theme}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#5A6A85', mb: 2 }}>
              Review and approve posts to add to your calendar. Deselect any you don&apos;t want.
            </Typography>
            <Stack spacing={1.5}>
              {batch.posts.map((post, i) => {
                const isApproved = approved.has(i)
                const Icon = post.platform === 'linkedin' ? IconBrandLinkedin : IconBrandTwitter
                const color = post.platform === 'linkedin' ? '#0077B5' : '#1DA1F2'
                const schedDate = batch.suggested_schedule[i]
                const dateStr = schedDate
                  ? new Date(schedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : '—'
                return (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: '10px',
                      border: '1.5px solid',
                      borderColor: isApproved ? '#2563EB40' : '#e5eaef',
                      bgcolor: isApproved ? 'rgba(37,99,235,0.03)' : '#FAFBFD',
                      opacity: isApproved ? 1 : 0.6,
                      transition: 'all 0.15s',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Checkbox
                        size="small"
                        checked={isApproved}
                        onChange={() => toggleApprove(i)}
                        sx={{ p: 0, mt: 0.25, color: '#DDE3EE', '&.Mui-checked': { color: '#2563EB' } }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                          <Icon size={14} color={color} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color, textTransform: 'capitalize' }}>
                            {post.platform}
                          </Typography>
                          <Chip label={post.tone} size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#F2F6FA', color: '#7C8FAC', '& .MuiChip-label': { px: '5px' } }} />
                          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <IconCalendar size={12} color="#7C8FAC" />
                            <Typography variant="caption" sx={{ color: '#7C8FAC' }}>{dateStr}</Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#2A3547', lineHeight: 1.65, fontSize: '0.8125rem' }}>
                          {post.content}
                        </Typography>
                        {post.tags?.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
                            {post.tags.map((tag) => (
                              <Typography key={tag} variant="caption" sx={{ color: '#5D87FF', fontSize: '0.7rem' }}>
                                #{tag}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={() => { onClose(); setBatch(null); setIntake(DEFAULT_INTAKE) }} sx={{ color: '#5A6A85' }}>
          Cancel
        </Button>
        {!batch ? (
          <Button
            variant="contained"
            disabled={!canGenerate}
            onClick={handleGenerate}
            startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <IconRocket size={16} />}
            sx={{ background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)', fontWeight: 700, px: 3 }}
          >
            {loading ? 'Generating…' : `Generate ${intake.postCount} Posts`}
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={() => { setBatch(null); setError('') }} sx={{ borderColor: '#DDE3EE', color: '#5A6A85' }}>
              ← Regenerate
            </Button>
            <Button
              variant="contained"
              disabled={approved.size === 0}
              onClick={handleSchedule}
              startIcon={<IconCalendar size={16} />}
              sx={{ background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)', fontWeight: 700, px: 3 }}
            >
              Schedule {approved.size} Post{approved.size !== 1 ? 's' : ''}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default function SocialMediaPage() {
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set(['linkedin']))
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null)
  const [createPostOpen, setCreatePostOpen] = useState(false)
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false)
  const [viewingPost, setViewingPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState({ platform: 'linkedin', content: '', scheduleDate: '' })
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const allPosts = [...userPosts, ...RECENT_POSTS]

  const handleAddAIPosts = (posts: Post[]) => {
    setUserPosts((prev) => [...posts, ...prev])
    setSnackbar({ open: true, message: `${posts.length} AI-generated post${posts.length !== 1 ? 's' : ''} added to your schedule!` })
  }

  const handleConnect = (platform: Platform) => {
    const isConnected = connectedPlatforms.has(platform.id)
    if (isConnected) {
      setConnectedPlatforms((prev) => {
        const next = new Set(prev)
        next.delete(platform.id)
        return next
      })
    } else {
      setConnectingPlatform(platform)
    }
  }

  const confirmConnect = (platformId: string) => {
    setConnectedPlatforms((prev) => new Set([...prev, platformId]))
    setConnectingPlatform(null)
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
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            startIcon={<IconSparkles size={16} />}
            onClick={() => setAiGeneratorOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              fontWeight: 700,
            }}
          >
            AI Generate
          </Button>
          <Button
            variant="outlined"
            startIcon={<IconPlus size={16} />}
            onClick={() => setCreatePostOpen(true)}
            sx={{ borderColor: '#5D87FF', color: '#5D87FF', '&:hover': { bgcolor: '#ECF2FF' } }}
          >
            Create Post
          </Button>
        </Stack>
      </Box>

      {/* AI Content Generator Banner */}
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(16,185,129,0.06) 100%)',
          border: '1px solid rgba(37,99,235,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconSparkles size={22} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#2A3547', fontSize: '0.9375rem' }}>
              AI Social Content Cycle
            </Typography>
            <Typography variant="body2" sx={{ color: '#5A6A85' }}>
              Turn your milestones and metrics into a full week of investor-attracting posts
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<IconRocket size={16} />}
          onClick={() => setAiGeneratorOpen(true)}
          sx={{ background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)', fontWeight: 700, borderRadius: '10px', px: 3, flexShrink: 0 }}
        >
          Generate Content Batch
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
                        onClick={() => handleConnect(platform)}
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
              <Chip
                label={`${allPosts.length} posts`}
                size="small"
                sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontWeight: 600 }}
              />
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
                  {allPosts.map((post) => {
                    const statusConfig = STATUS_CONFIG[post.status]
                    return (
                      <TableRow key={post.id} onClick={() => setViewingPost(post)} sx={{ '&:hover': { bgcolor: '#F6F8FB' }, cursor: 'pointer' }}>
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

      {/* Connect Platform Dialog */}
      <Dialog
        open={Boolean(connectingPlatform)}
        onClose={() => setConnectingPlatform(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        {connectingPlatform && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>Connect {connectingPlatform.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: connectingPlatform.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: connectingPlatform.color }}>
                  {connectingPlatform.icon}
                </Box>
                <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                  Connect your {connectingPlatform.name} account to track engagement and schedule posts directly from RaiseOps.
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#7C8FAC', display: 'block', bgcolor: '#F6F8FB', p: 1.5, borderRadius: '8px' }}>
                Full OAuth integration coming soon. For now, connecting will link your profile for analytics tracking.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setConnectingPlatform(null)} sx={{ color: '#5A6A85' }}>Cancel</Button>
              <Button
                variant="contained"
                onClick={() => confirmConnect(connectingPlatform.id)}
                sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' }}
              >
                Connect {connectingPlatform.name}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog
        open={createPostOpen}
        onClose={() => { setCreatePostOpen(false); setNewPost({ platform: 'linkedin', content: '', scheduleDate: '' }) }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create Post</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Platform"
              select
              fullWidth
              size="small"
              value={newPost.platform}
              onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
            >
              {PLATFORMS.filter((p) => connectedPlatforms.has(p.id)).map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
              {PLATFORMS.filter((p) => connectedPlatforms.has(p.id)).length === 0 && (
                <MenuItem disabled value="">Connect a platform first</MenuItem>
              )}
            </TextField>
            <TextField
              label="Post Content"
              fullWidth
              multiline
              rows={5}
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Write your post here..."
              helperText={`${newPost.content.length} characters`}
            />
            <TextField
              label="Schedule Date (optional)"
              type="date"
              fullWidth
              size="small"
              value={newPost.scheduleDate}
              onChange={(e) => setNewPost({ ...newPost, scheduleDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setCreatePostOpen(false); setNewPost({ platform: 'linkedin', content: '', scheduleDate: '' }) }} sx={{ color: '#5A6A85' }}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            disabled={!newPost.content}
            onClick={() => {
              const platform = PLATFORMS.find((p) => p.id === newPost.platform)
              const post: Post = {
                id: `user-${Date.now()}`,
                platform: platform?.name ?? newPost.platform,
                platformIcon: platform?.icon,
                platformColor: platform?.color ?? '#5D87FF',
                content: newPost.content,
                date: newPost.scheduleDate ? new Date(newPost.scheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft',
                status: 'draft',
              }
              setUserPosts((prev) => [post, ...prev])
              setCreatePostOpen(false)
              setNewPost({ platform: 'linkedin', content: '', scheduleDate: '' })
            }}
            sx={{ borderColor: '#5D87FF', color: '#5D87FF' }}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            disabled={!newPost.content || !newPost.scheduleDate}
            onClick={() => {
              const platform = PLATFORMS.find((p) => p.id === newPost.platform)
              const post: Post = {
                id: `user-${Date.now()}`,
                platform: platform?.name ?? newPost.platform,
                platformIcon: platform?.icon,
                platformColor: platform?.color ?? '#5D87FF',
                content: newPost.content,
                date: new Date(newPost.scheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'scheduled',
              }
              setUserPosts((prev) => [post, ...prev])
              setCreatePostOpen(false)
              setNewPost({ platform: 'linkedin', content: '', scheduleDate: '' })
            }}
            sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' }}
          >
            Schedule Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Content Generator Dialog */}
      <AIContentDialog
        open={aiGeneratorOpen}
        onClose={() => setAiGeneratorOpen(false)}
        companyName="RaiseOps"
        onAddPosts={handleAddAIPosts}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />

      {/* Post Detail Dialog */}
      <Dialog
        open={Boolean(viewingPost)}
        onClose={() => setViewingPost(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        {viewingPost && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: viewingPost.platformColor }}>
                  {viewingPost.platformIcon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{viewingPost.platform}</Typography>
                  <Typography variant="caption" sx={{ color: '#5A6A85', fontWeight: 400 }}>{viewingPost.date}</Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    label={STATUS_CONFIG[viewingPost.status].label}
                    size="small"
                    sx={{ bgcolor: STATUS_CONFIG[viewingPost.status].bg, color: STATUS_CONFIG[viewingPost.status].color, fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ color: '#2A3547', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {viewingPost.content}
              </Typography>
              {viewingPost.status === 'published' && viewingPost.reach ? (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" sx={{ color: '#7C8FAC', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                    Engagement
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box>
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#2A3547' }}>{viewingPost.reach?.toLocaleString()}</Typography>
                      <Typography variant="caption" sx={{ color: '#5A6A85' }}>Reach</Typography>
                    </Box>
                    {viewingPost.likes !== undefined && (
                      <Box>
                        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#FA896B' }}>{viewingPost.likes}</Typography>
                        <Typography variant="caption" sx={{ color: '#5A6A85' }}>Likes</Typography>
                      </Box>
                    )}
                    {viewingPost.comments !== undefined && (
                      <Box>
                        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#5D87FF' }}>{viewingPost.comments}</Typography>
                        <Typography variant="caption" sx={{ color: '#5A6A85' }}>Comments</Typography>
                      </Box>
                    )}
                    {viewingPost.shares !== undefined && (
                      <Box>
                        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#13DEB9' }}>{viewingPost.shares}</Typography>
                        <Typography variant="caption" sx={{ color: '#5A6A85' }}>Shares</Typography>
                      </Box>
                    )}
                  </Box>
                </>
              ) : null}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setViewingPost(null)} sx={{ color: '#5A6A85' }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
