'use client'

import React from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Typography,
  Divider,
  Button,
} from '@mui/material'
import {
  IconBuildingBank,
  IconCalendarEvent,
  IconFileText,
  IconMail,
  IconCheck,
} from '@tabler/icons-react'
import DashboardCard from '@/components/shared/DashboardCard'

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

export default function RecentActivity() {
  return (
    <DashboardCard
      title="Recent Activity"
      subtitle="Your latest fundraising updates"
      action={
        <Button size="small" sx={{ color: '#5D87FF', fontSize: '0.75rem' }}>
          View All
        </Button>
      }
      noPadding
    >
      <List disablePadding>
        {ACTIVITIES.map((activity, index) => (
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
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>
                      {activity.title}
                    </Typography>
                    <Chip
                      label={STATUS_COLORS[activity.status].label}
                      size="small"
                      sx={{
                        bgcolor: STATUS_COLORS[activity.status].bg,
                        color: STATUS_COLORS[activity.status].color,
                        fontSize: '0.65rem',
                        height: 18,
                        fontWeight: 600,
                        '& .MuiChip-label': { px: '6px' },
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
            {index < ACTIVITIES.length - 1 && (
              <Divider sx={{ mx: 2.5, borderColor: '#e5eaef' }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </DashboardCard>
  )
}
