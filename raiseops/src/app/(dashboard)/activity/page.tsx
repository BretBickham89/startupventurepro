'use client'

import React, { useMemo, useState } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import {
  IconBuildingBank,
  IconCalendarEvent,
  IconFileText,
  IconMail,
  IconCheck,
} from '@tabler/icons-react'

interface Activity {
  id: string
  type: 'investor_contact' | 'meeting_scheduled' | 'post_published' | 'email_sent' | 'deal_closed'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'info' | 'warning' | 'error'
  avatar: string
  avatarBg: string
}

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'meeting_scheduled',
    title: 'Meeting Scheduled',
    description: 'Introductory call with Andreessen Horowitz confirmed for March 28',
    timestamp: '2 hours ago',
    status: 'success',
    avatar: 'AH',
    avatarBg: '#5D87FF',
  },
  {
    id: '2',
    type: 'investor_contact',
    title: 'New Investor Reached',
    description: 'Connected with Sarah Kim at Sequoia Capital via LinkedIn',
    timestamp: '4 hours ago',
    status: 'info',
    avatar: 'SK',
    avatarBg: '#49BEFF',
  },
  {
    id: '3',
    type: 'post_published',
    title: 'Post Published',
    description: '"The Future of AI in Healthcare" reached 2.4K impressions on LinkedIn',
    timestamp: '6 hours ago',
    status: 'info',
    avatar: 'Li',
    avatarBg: '#0077B5',
  },
  {
    id: '4',
    type: 'email_sent',
    title: 'Follow-up Sent',
    description: 'Sent deck and executive summary to Lightspeed Venture Partners',
    timestamp: '1 day ago',
    status: 'warning',
    avatar: 'LV',
    avatarBg: '#FFAE1F',
  },
  {
    id: '5',
    type: 'deal_closed',
    title: 'Due Diligence Started',
    description: 'Bessemer Venture Partners requested financial models and KPI dashboard',
    timestamp: '2 days ago',
    status: 'success',
    avatar: 'BV',
    avatarBg: '#13DEB9',
  },
  {
    id: '6',
    type: 'investor_contact',
    title: 'Profile Viewed',
    description: 'Your investor profile was viewed by 12 VCs this week',
    timestamp: '2 days ago',
    status: 'info',
    avatar: '12',
    avatarBg: '#7B61FF',
  },
  {
    id: '7',
    type: 'email_sent',
    title: 'Intro Email Sent',
    description: 'Reached out to Priya Mehta at First Round Capital',
    timestamp: '3 days ago',
    status: 'warning',
    avatar: 'PM',
    avatarBg: '#FA896B',
  },
  {
    id: '8',
    type: 'meeting_scheduled',
    title: 'Meeting Scheduled',
    description: 'Pitch call with Jennifer Walsh booked for April 2',
    timestamp: '3 days ago',
    status: 'success',
    avatar: 'JW',
    avatarBg: '#49BEFF',
  },
  {
    id: '9',
    type: 'deal_closed',
    title: 'Term Sheet Received',
    description: 'Aisha Okonkwo at Bessemer Venture Partners sent a term sheet',
    timestamp: '4 days ago',
    status: 'success',
    avatar: 'AO',
    avatarBg: '#13DEB9',
  },
  {
    id: '10',
    type: 'post_published',
    title: 'Post Published',
    description: '"Our $2M Seed Round Journey" reached 5.1K impressions on X',
    timestamp: '5 days ago',
    status: 'info',
    avatar: 'X',
    avatarBg: '#000000',
  },
  {
    id: '11',
    type: 'investor_contact',
    title: 'New Investor Reached',
    description: 'Connected with David Nakamura at Lightspeed Venture Partners',
    timestamp: '6 days ago',
    status: 'info',
    avatar: 'DN',
    avatarBg: '#FFAE1F',
  },
  {
    id: '12',
    type: 'email_sent',
    title: 'Follow-up Sent',
    description: 'Sent updated cap table to Marcus Thompson at Andreessen Horowitz',
    timestamp: '1 week ago',
    status: 'warning',
    avatar: 'MT',
    avatarBg: '#7B61FF',
  },
]

const STATUS_COLORS = {
  success: { bg: '#E6FFFA', color: '#02b3a9', label: 'Success' },
  info: { bg: '#E8F7FF', color: '#23afdb', label: 'Active' },
  warning: { bg: '#FEF5E5', color: '#ae8e59', label: 'Pending' },
  error: { bg: '#FDEDE8', color: '#f3704d', label: 'Failed' },
}

const TYPE_ICONS = {
  investor_contact: <IconBuildingBank size={14} />,
  meeting_scheduled: <IconCalendarEvent size={14} />,
  post_published: <IconFileText size={14} />,
  email_sent: <IconMail size={14} />,
  deal_closed: <IconCheck size={14} />,
}

const TYPE_LABELS: Record<Activity['type'], string> = {
  investor_contact: 'Investor Contact',
  meeting_scheduled: 'Meetings',
  post_published: 'Posts',
  email_sent: 'Emails',
  deal_closed: 'Deals',
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<Activity['type'] | 'all'>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? ACTIVITIES : ACTIVITIES.filter((a) => a.type === filter)),
    [filter]
  )

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
          Activity
        </Typography>
        <Typography variant="body2" sx={{ color: '#5A6A85' }}>
          Every update across your fundraise, in one timeline
        </Typography>
      </Box>

      <Box sx={{ mb: 2.5, overflowX: 'auto' }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, value) => value && setFilter(value)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              px: 2,
              fontSize: '0.8125rem',
              color: '#5A6A85',
              border: '1px solid #e5eaef',
            },
            '& .Mui-selected': {
              bgcolor: '#ECF2FF !important',
              color: '#5D87FF !important',
              fontWeight: 600,
            },
          }}
        >
          <ToggleButton value="all">All</ToggleButton>
          {(Object.keys(TYPE_LABELS) as Activity['type'][]).map((type) => (
            <ToggleButton key={type} value={type}>
              {TYPE_LABELS[type]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5eaef',
          overflow: 'hidden',
        }}
      >
        <List disablePadding>
          {filtered.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem sx={{ px: 2.5, py: 1.75, alignItems: 'flex-start' }}>
                <ListItemAvatar sx={{ mt: 0.25 }}>
                  <Avatar
                    sx={{
                      bgcolor: activity.avatarBg,
                      width: 36,
                      height: 36,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {activity.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  slotProps={{
                    primary: { component: 'div' },
                    secondary: { component: 'div' },
                  }}
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>
                        {activity.title}
                      </Typography>
                      <Chip
                        icon={TYPE_ICONS[activity.type]}
                        label={STATUS_COLORS[activity.status].label}
                        size="small"
                        sx={{
                          bgcolor: STATUS_COLORS[activity.status].bg,
                          color: STATUS_COLORS[activity.status].color,
                          fontSize: '0.65rem',
                          height: 20,
                          fontWeight: 600,
                          '& .MuiChip-label': { px: '6px' },
                          '& .MuiChip-icon': { color: STATUS_COLORS[activity.status].color, ml: '6px' },
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: '#5A6A85', fontSize: '0.8125rem', mt: 0.25, lineHeight: 1.5 }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                        {activity.timestamp}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < filtered.length - 1 && <Divider sx={{ mx: 2.5, borderColor: '#e5eaef' }} />}
            </React.Fragment>
          ))}
          {filtered.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#7C8FAC' }}>
                No activity in this category yet.
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    </Box>
  )
}
