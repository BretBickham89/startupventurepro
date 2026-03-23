'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import { IconMail, IconCalendar, IconNotes, IconDots } from '@tabler/icons-react'
import type { CRMStatus } from '@/lib/supabase/types'

interface CRMEntry {
  id: string
  investor_name: string
  investor_firm: string | null
  status: CRMStatus
  potential_amount: number | null
  last_contact_date: string | null
  next_follow_up: string | null
  avatar: string
  avatar_bg: string
}

const CRM_DATA: CRMEntry[] = [
  {
    id: '1',
    investor_name: 'Sarah Kim',
    investor_firm: 'Sequoia Capital',
    status: 'meeting-scheduled',
    potential_amount: 2000000,
    last_contact_date: 'Mar 20, 2026',
    next_follow_up: 'Mar 28, 2026',
    avatar: 'SK',
    avatar_bg: '#5D87FF',
  },
  {
    id: '2',
    investor_name: 'Marcus Thompson',
    investor_firm: 'Andreessen Horowitz',
    status: 'due-diligence',
    potential_amount: 5000000,
    last_contact_date: 'Mar 18, 2026',
    next_follow_up: 'Mar 25, 2026',
    avatar: 'MT',
    avatar_bg: '#7B61FF',
  },
  {
    id: '3',
    investor_name: 'Aisha Okonkwo',
    investor_firm: 'Bessemer Venture Partners',
    status: 'term-sheet',
    potential_amount: 3000000,
    last_contact_date: 'Mar 22, 2026',
    next_follow_up: 'Mar 24, 2026',
    avatar: 'AO',
    avatar_bg: '#13DEB9',
  },
  {
    id: '4',
    investor_name: 'Jennifer Walsh',
    investor_firm: null,
    status: 'contacted',
    potential_amount: 250000,
    last_contact_date: 'Mar 15, 2026',
    next_follow_up: 'Apr 1, 2026',
    avatar: 'JW',
    avatar_bg: '#49BEFF',
  },
  {
    id: '5',
    investor_name: 'David Nakamura',
    investor_firm: 'Lightspeed Venture Partners',
    status: 'prospect',
    potential_amount: 1500000,
    last_contact_date: null,
    next_follow_up: 'Mar 30, 2026',
    avatar: 'DN',
    avatar_bg: '#FFAE1F',
  },
  {
    id: '6',
    investor_name: 'Priya Mehta',
    investor_firm: 'First Round Capital',
    status: 'contacted',
    potential_amount: 500000,
    last_contact_date: 'Mar 17, 2026',
    next_follow_up: 'Mar 27, 2026',
    avatar: 'PM',
    avatar_bg: '#FA896B',
  },
  {
    id: '7',
    investor_name: 'James Okafor',
    investor_firm: 'YC Alumni Angels',
    status: 'closed',
    potential_amount: 50000,
    last_contact_date: 'Mar 10, 2026',
    next_follow_up: null,
    avatar: 'JO',
    avatar_bg: '#13DEB9',
  },
  {
    id: '8',
    investor_name: 'Tom Bradley',
    investor_firm: null,
    status: 'passed',
    potential_amount: 100000,
    last_contact_date: 'Feb 28, 2026',
    next_follow_up: null,
    avatar: 'TB',
    avatar_bg: '#7C8FAC',
  },
]

const STATUS_CONFIG: Record<
  CRMStatus,
  { label: string; bg: string; color: string }
> = {
  prospect: { label: 'Prospect', bg: '#F2F6FA', color: '#5A6A85' },
  contacted: { label: 'Contacted', bg: '#E8F7FF', color: '#23afdb' },
  'meeting-scheduled': { label: 'Meeting', bg: '#FEF5E5', color: '#ae8e59' },
  'due-diligence': { label: 'Due Diligence', bg: '#F0EDFF', color: '#7B61FF' },
  'term-sheet': { label: 'Term Sheet', bg: '#E6FFFA', color: '#02b3a9' },
  closed: { label: 'Closed Won', bg: '#E6FFFA', color: '#02b3a9' },
  passed: { label: 'Passed', bg: '#FDEDE8', color: '#f3704d' },
}

function formatAmount(amount: number | null): string {
  if (!amount) return '—'
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount}`
}

interface CRMTableProps {
  statusFilter?: CRMStatus | 'all'
}

export default function CRMTable({ statusFilter = 'all' }: CRMTableProps) {
  const [data] = useState(CRM_DATA)

  const filtered =
    statusFilter === 'all'
      ? data
      : data.filter((row) => {
          if (statusFilter === 'active') {
            return !['closed', 'passed'].includes(row.status)
          }
          return row.status === statusFilter
        })

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ '& th': { bgcolor: '#F6F8FB' } }}>
            <TableCell>Investor</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Potential Amount</TableCell>
            <TableCell>Last Contact</TableCell>
            <TableCell>Next Follow-up</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((row) => {
            const statusConfig = STATUS_CONFIG[row.status]
            return (
              <TableRow
                key={row.id}
                sx={{ '&:hover': { bgcolor: '#F6F8FB' }, transition: 'background 0.15s' }}
              >
                {/* Investor */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: row.avatar_bg,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '10px',
                      }}
                    >
                      {row.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>
                        {row.investor_name}
                      </Typography>
                      {row.investor_firm && (
                        <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                          {row.investor_firm}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={statusConfig.label}
                    size="small"
                    sx={{
                      bgcolor: statusConfig.bg,
                      color: statusConfig.color,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                      '& .MuiChip-label': { px: '8px' },
                    }}
                  />
                </TableCell>

                {/* Potential Amount */}
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#2A3547', fontWeight: 500 }}>
                    {formatAmount(row.potential_amount)}
                  </Typography>
                </TableCell>

                {/* Last Contact */}
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                    {row.last_contact_date || '—'}
                  </Typography>
                </TableCell>

                {/* Next Follow-up */}
                <TableCell>
                  {row.next_follow_up ? (
                    <Chip
                      label={row.next_follow_up}
                      size="small"
                      sx={{
                        bgcolor: '#ECF2FF',
                        color: '#5D87FF',
                        fontSize: '0.7rem',
                        height: 22,
                        '& .MuiChip-label': { px: '8px' },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#7C8FAC' }}>
                      —
                    </Typography>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    <Tooltip title="Send Email">
                      <IconButton size="small" sx={{ color: '#5A6A85', '&:hover': { color: '#5D87FF', bgcolor: '#ECF2FF' } }}>
                        <IconMail size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Schedule Meeting">
                      <IconButton size="small" sx={{ color: '#5A6A85', '&:hover': { color: '#FFAE1F', bgcolor: '#FEF5E5' } }}>
                        <IconCalendar size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add Notes">
                      <IconButton size="small" sx={{ color: '#5A6A85', '&:hover': { color: '#7B61FF', bgcolor: '#F0EDFF' } }}>
                        <IconNotes size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
