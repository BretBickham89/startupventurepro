'use client'

import React, { useMemo, useState } from 'react'
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  MenuItem,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material'
import { IconPlus, IconX } from '@tabler/icons-react'
import CRMTable, { CRM_DATA, STATUS_CONFIG, type CRMEntry } from '@/components/investors/CRMTable'
import type { CRMStatus } from '@/lib/supabase/types'

const STAGE_DEFS: { label: string; status: CRMStatus; color: string; bg: string }[] = [
  { label: 'Prospects', status: 'prospect', color: '#5D87FF', bg: '#ECF2FF' },
  { label: 'Contacted', status: 'contacted', color: '#49BEFF', bg: '#E8F7FF' },
  { label: 'Meetings', status: 'meeting-scheduled', color: '#FFAE1F', bg: '#FEF5E5' },
  { label: 'Due Diligence', status: 'due-diligence', color: '#7B61FF', bg: '#F0EDFF' },
  { label: 'Term Sheet', status: 'term-sheet', color: '#13DEB9', bg: '#E6FFFA' },
]

const AVATAR_COLORS = ['#5D87FF', '#49BEFF', '#13DEB9', '#FFAE1F', '#7B61FF', '#FA896B']

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
}

type TabValue = 'all' | 'active' | 'closed' | 'passed'

const EMPTY_FORM = {
  investor_name: '',
  investor_firm: '',
  status: 'prospect' as CRMStatus,
  potential_amount: '',
}

export default function CRMPage() {
  const [entries, setEntries] = useState<CRMEntry[]>(CRM_DATA)
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [stageFilter, setStageFilter] = useState<CRMStatus | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const stages = useMemo(
    () =>
      STAGE_DEFS.map((stage) => ({
        ...stage,
        count: entries.filter((e) => e.status === stage.status).length,
      })),
    [entries]
  )

  const handleStageClick = (status: CRMStatus) => {
    setStageFilter((prev) => (prev === status ? null : status))
  }

  const handleAddInvestor = () => {
    if (!form.investor_name.trim()) return
    const newEntry: CRMEntry = {
      id: `${Date.now()}`,
      investor_name: form.investor_name.trim(),
      investor_firm: form.investor_firm.trim() || null,
      status: form.status,
      potential_amount: form.potential_amount ? Number(form.potential_amount) : null,
      last_contact_date: null,
      next_follow_up: null,
      avatar: initialsOf(form.investor_name).toUpperCase() || '??',
      avatar_bg: AVATAR_COLORS[entries.length % AVATAR_COLORS.length],
    }
    setEntries((prev) => [newEntry, ...prev])
    setDialogOpen(false)
    setForm(EMPTY_FORM)
    setSnackbar({ open: true, message: `${newEntry.investor_name} added to your pipeline.` })
  }

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
          onClick={() => setDialogOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
            boxShadow: '0 4px 12px rgba(93, 135, 255, 0.3)',
          }}
        >
          Add Investor
        </Button>
      </Box>

      {/* Pipeline Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {stages.map((stage) => (
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={stage.label}>
            <Card
              onClick={() => handleStageClick(stage.status)}
              sx={{
                borderTop: `3px solid ${stage.color}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                outline: stageFilter === stage.status ? `2px solid ${stage.color}` : 'none',
                outlineOffset: '-1px',
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

      {stageFilter && (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`Filtered: ${STATUS_CONFIG[stageFilter].label}`}
            onDelete={() => setStageFilter(null)}
            deleteIcon={<IconX size={14} />}
            sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontWeight: 600 }}
          />
        </Box>
      )}

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
              onChange={(_, value) => {
                setActiveTab(value as TabValue)
                setStageFilter(null)
              }}
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
        <CRMTable data={entries} statusFilter={stageFilter ?? activeTab} />
      </Paper>

      {/* Add Investor Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#2A3547' }}>Add Investor</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Investor Name"
              fullWidth
              autoFocus
              value={form.investor_name}
              onChange={(e) => setForm({ ...form, investor_name: e.target.value })}
            />
            <TextField
              label="Firm"
              fullWidth
              value={form.investor_firm}
              onChange={(e) => setForm({ ...form, investor_firm: e.target.value })}
            />
            <TextField
              select
              label="Pipeline Stage"
              fullWidth
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as CRMStatus })}
            >
              {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                <MenuItem key={value} value={value}>
                  {config.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Potential Amount ($)"
              type="number"
              fullWidth
              value={form.potential_amount}
              onChange={(e) => setForm({ ...form, potential_amount: e.target.value })}
            />
            {form.investor_name && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: AVATAR_COLORS[entries.length % AVATAR_COLORS.length], width: 36, height: 36, fontSize: '0.75rem', fontWeight: 700 }}>
                  {initialsOf(form.investor_name).toUpperCase() || '??'}
                </Avatar>
                <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                  Preview
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#5A6A85' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddInvestor}
            disabled={!form.investor_name.trim()}
            sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' }}
          >
            Add Investor
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
