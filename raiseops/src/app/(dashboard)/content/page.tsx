'use client'

import React, { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
} from '@mui/material'
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconList,
  IconCalendar,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandFacebook,
} from '@tabler/icons-react'
import type { PostPlatform, PostStatus } from '@/lib/supabase/types'

interface ScheduledPost {
  id: string
  title: string
  content: string
  platform: PostPlatform
  date: string
  status: PostStatus
}

const PLATFORM_CONFIG: Record<PostPlatform, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  linkedin: { color: '#0077B5', bg: '#E3F2FD', icon: <IconBrandLinkedin size={12} />, label: 'LinkedIn' },
  twitter: { color: '#1DA1F2', bg: '#E8F7FF', icon: <IconBrandTwitter size={12} />, label: 'Twitter/X' },
  instagram: { color: '#E1306C', bg: '#FCE4EC', icon: <IconBrandInstagram size={12} />, label: 'Instagram' },
  facebook: { color: '#1877F2', bg: '#E8F0FE', icon: <IconBrandFacebook size={12} />, label: 'Facebook' },
}

function generateMockPosts(year: number, month: number): ScheduledPost[] {
  const posts: ScheduledPost[] = [
    { id: '1', title: 'Founder Story: Why We Started', content: 'Every great company starts with a problem worth solving...', platform: 'linkedin', date: `${year}-${String(month).padStart(2, '0')}-03`, status: 'published' },
    { id: '2', title: 'Product Launch Announcement', content: 'Excited to share that we just hit 1,000 active users!', platform: 'twitter', date: `${year}-${String(month).padStart(2, '0')}-05`, status: 'published' },
    { id: '3', title: 'Team Culture Post', content: 'Building a remote-first culture from day one...', platform: 'linkedin', date: `${year}-${String(month).padStart(2, '0')}-07`, status: 'published' },
    { id: '4', title: 'Funding Milestone Teaser', content: 'Big news coming soon. Stay tuned...', platform: 'instagram', date: `${year}-${String(month).padStart(2, '0')}-10`, status: 'published' },
    { id: '5', title: 'Investor Insights Thread', content: 'After 100+ investor conversations, here is what I learned...', platform: 'twitter', date: `${year}-${String(month).padStart(2, '0')}-12`, status: 'published' },
    { id: '6', title: 'Weekly Startup Metrics', content: 'MRR: $24K | Churn: 2.1% | NPS: 72', platform: 'linkedin', date: `${year}-${String(month).padStart(2, '0')}-14`, status: 'published' },
    { id: '7', title: 'Co-founder Spotlight', content: 'Meet our CTO and the tech behind our platform...', platform: 'linkedin', date: `${year}-${String(month).padStart(2, '0')}-17`, status: 'scheduled' },
    { id: '8', title: 'Customer Success Story', content: 'How @TechCorp cut their costs by 40% using our platform', platform: 'twitter', date: `${year}-${String(month).padStart(2, '0')}-19`, status: 'scheduled' },
    { id: '9', title: 'Market Analysis Post', content: 'The $2.4T opportunity we are going after...', platform: 'linkedin', date: `${year}-${String(month).padStart(2, '0')}-21`, status: 'scheduled' },
    { id: '10', title: 'Behind the Scenes', content: 'A day in the life of a Series A startup...', platform: 'instagram', date: `${year}-${String(month).padStart(2, '0')}-24`, status: 'draft' },
    { id: '11', title: 'Partnership Announcement', content: 'Thrilled to announce our strategic partnership with...', platform: 'linkedin', date: `${year}-${String(month).padStart(2, '0')}-26`, status: 'draft' },
    { id: '12', title: 'Monthly Roundup', content: '12 things that happened this month...', platform: 'facebook', date: `${year}-${String(month).padStart(2, '0')}-28`, status: 'draft' },
  ]
  return posts
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function ContentCalendarPage() {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)
  const [newPostOpen, setNewPostOpen] = useState(false)

  const year = currentDate.year()
  const month = currentDate.month() + 1
  const posts = generateMockPosts(year, month)

  const firstDayOfMonth = currentDate.startOf('month').day()
  const daysInMonth = currentDate.daysInMonth()

  const calendarCells: Array<number | null> = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Pad to complete last row
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null)
  }

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return posts.filter((p) => p.date === dateStr)
  }

  const isToday = (day: number) => {
    const today = dayjs()
    return today.year() === year && today.month() + 1 === month && today.date() === day
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
            Content Calendar
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Plan and schedule your founder content across all platforms
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<IconCalendar size={16} />}
            onClick={() => setViewMode('calendar')}
            sx={viewMode === 'calendar' ? { background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' } : {}}
          >
            Calendar
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<IconList size={16} />}
            onClick={() => setViewMode('list')}
            sx={viewMode === 'list' ? { background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' } : {}}
          >
            List
          </Button>
          <Button
            variant="contained"
            startIcon={<IconPlus size={18} />}
            onClick={() => setNewPostOpen(true)}
            sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)', boxShadow: '0 4px 12px rgba(93, 135, 255, 0.3)' }}
          >
            New Post
          </Button>
        </Box>
      </Box>

      {/* Month Navigation */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid #e5eaef', borderRadius: '12px', overflow: 'hidden' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            borderBottom: '1px solid #e5eaef',
            bgcolor: '#fff',
          }}
        >
          <IconButton
            size="small"
            onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
            sx={{ color: '#5A6A85', '&:hover': { color: '#5D87FF', bgcolor: '#ECF2FF' } }}
          >
            <IconChevronLeft size={20} />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547' }}>
            {currentDate.format('MMMM YYYY')}
          </Typography>

          <IconButton
            size="small"
            onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
            sx={{ color: '#5A6A85', '&:hover': { color: '#5D87FF', bgcolor: '#ECF2FF' } }}
          >
            <IconChevronRight size={20} />
          </IconButton>
        </Box>

        {viewMode === 'calendar' ? (
          <Box sx={{ bgcolor: '#fff' }}>
            {/* Day headers */}
            <Grid container sx={{ borderBottom: '1px solid #e5eaef' }}>
              {DAYS_OF_WEEK.map((day) => (
                <Grid size={12 / 7} key={day}>
                  <Box sx={{ py: 1.5, textAlign: 'center' }}>
                    <Typography
                      variant="caption"
                      sx={{ color: '#5A6A85', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}
                    >
                      {day}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Calendar grid */}
            {Array.from({ length: calendarCells.length / 7 }, (_, weekIndex) => (
              <Grid
                container
                key={weekIndex}
                sx={{ borderBottom: weekIndex < calendarCells.length / 7 - 1 ? '1px solid #e5eaef' : 'none' }}
              >
                {calendarCells.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, cellIndex) => {
                  const dayPosts = day ? getPostsForDay(day) : []
                  const today = day ? isToday(day) : false

                  return (
                    <Grid
                      size={12 / 7}
                      key={cellIndex}
                      sx={{ borderRight: cellIndex < 6 ? '1px solid #e5eaef' : 'none' }}
                    >
                      <Box
                        sx={{
                          minHeight: 100,
                          p: 1,
                          bgcolor: day ? '#fff' : '#F6F8FB',
                          '&:hover': day ? { bgcolor: '#F6F8FB' } : {},
                          transition: 'background 0.15s',
                        }}
                      >
                        {day && (
                          <>
                            <Box
                              sx={{
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                bgcolor: today ? '#5D87FF' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: today ? 700 : 400,
                                  color: today ? '#fff' : '#2A3547',
                                  fontSize: '0.8rem',
                                }}
                              >
                                {day}
                              </Typography>
                            </Box>

                            {/* Posts */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {dayPosts.slice(0, 2).map((post) => {
                                const config = PLATFORM_CONFIG[post.platform]
                                return (
                                  <Tooltip key={post.id} title={post.title}>
                                    <Box
                                      onClick={() => setSelectedPost(post)}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        bgcolor: config.bg,
                                        borderRadius: '4px',
                                        px: 0.75,
                                        py: 0.25,
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.85 },
                                      }}
                                    >
                                      <Box sx={{ color: config.color, display: 'flex' }}>
                                        {config.icon}
                                      </Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: config.color,
                                          fontSize: '0.65rem',
                                          fontWeight: 500,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          flex: 1,
                                        }}
                                      >
                                        {post.title}
                                      </Typography>
                                    </Box>
                                  </Tooltip>
                                )
                              })}
                              {dayPosts.length > 2 && (
                                <Typography variant="caption" sx={{ color: '#7C8FAC', fontSize: '0.65rem', pl: 0.5 }}>
                                  +{dayPosts.length - 2} more
                                </Typography>
                              )}
                            </Box>
                          </>
                        )}
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            ))}
          </Box>
        ) : (
          /* List View */
          <Box sx={{ bgcolor: '#fff' }}>
            {posts.map((post, index) => {
              const config = PLATFORM_CONFIG[post.platform]
              return (
                <Box
                  key={post.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 3,
                    py: 2,
                    borderBottom: index < posts.length - 1 ? '1px solid #e5eaef' : 'none',
                    '&:hover': { bgcolor: '#F6F8FB' },
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedPost(post)}
                >
                  <Box sx={{ width: 60, flexShrink: 0 }}>
                    <Typography variant="caption" sx={{ color: '#5A6A85', fontWeight: 600 }}>
                      {dayjs(post.date).format('MMM D')}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '8px',
                      bgcolor: config.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: config.color,
                      flexShrink: 0,
                    }}
                  >
                    {config.icon}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5A6A85', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {post.content}
                    </Typography>
                  </Box>

                  <Chip
                    label={post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    size="small"
                    sx={{
                      bgcolor:
                        post.status === 'published'
                          ? '#E6FFFA'
                          : post.status === 'scheduled'
                          ? '#ECF2FF'
                          : '#F2F6FA',
                      color:
                        post.status === 'published'
                          ? '#02b3a9'
                          : post.status === 'scheduled'
                          ? '#5D87FF'
                          : '#5A6A85',
                      fontSize: '0.7rem',
                      height: 22,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              )
            })}
          </Box>
        )}
      </Paper>

      {/* Post Detail Dialog */}
      <Dialog
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        {selectedPost && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>{selectedPost.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={PLATFORM_CONFIG[selectedPost.platform].label}
                  size="small"
                  sx={{
                    bgcolor: PLATFORM_CONFIG[selectedPost.platform].bg,
                    color: PLATFORM_CONFIG[selectedPost.platform].color,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={dayjs(selectedPost.date).format('MMMM D, YYYY')}
                  size="small"
                  sx={{ bgcolor: '#F2F6FA', color: '#5A6A85' }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#2A3547', lineHeight: 1.7 }}>
                {selectedPost.content}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setSelectedPost(null)} sx={{ color: '#5A6A85' }}>Close</Button>
              <Button variant="contained" sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' }}>
                Edit Post
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Post Dialog */}
      <Dialog
        open={newPostOpen}
        onClose={() => setNewPostOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Post</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Post Title" fullWidth size="small" />
            <TextField label="Content" fullWidth multiline rows={4} />
            <TextField label="Platform" select fullWidth size="small" defaultValue="linkedin">
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                <MenuItem key={key} value={key}>{config.label}</MenuItem>
              ))}
            </TextField>
            <TextField label="Schedule Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setNewPostOpen(false)} sx={{ color: '#5A6A85' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => setNewPostOpen(false)}
            sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' }}
          >
            Schedule Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
