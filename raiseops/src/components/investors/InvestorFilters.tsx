'use client'

import React, { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  Slider,
  Button,
  Divider,
  InputAdornment,
  Paper,
} from '@mui/material'
import { IconSearch, IconFilter, IconRefresh } from '@tabler/icons-react'
import type { FundingStage, InvestorType } from '@/lib/supabase/types'

const FUNDING_STAGES: { value: FundingStage; label: string }[] = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'series-c', label: 'Series C' },
]

const INDUSTRIES = ['FinTech', 'EdTech', 'HealthTech', 'SaaS', 'B2B', 'Consumer', 'DeepTech']

const INVESTOR_TYPES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'angel', label: 'Angel Investor' },
  { value: 'vc', label: 'Venture Capital' },
  { value: 'family-office', label: 'Family Office' },
  { value: 'corporate', label: 'Corporate VC' },
  { value: 'accelerator', label: 'Accelerator' },
]

export interface FilterState {
  search: string
  fundingStages: FundingStage[]
  industries: string[]
  investorType: string
  investmentRange: [number, number]
  minMatchScore: number
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  fundingStages: [],
  industries: [],
  investorType: 'all',
  investmentRange: [10000, 10000000],
  minMatchScore: 0,
}

interface InvestorFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

function formatAmount(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

export default function InvestorFilters({ onFilterChange }: InvestorFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const handleSearchChange = (value: string) => {
    const updated = { ...filters, search: value }
    setFilters(updated)
    onFilterChange(updated)
  }

  const handleStageToggle = (stage: FundingStage) => {
    const updated = {
      ...filters,
      fundingStages: filters.fundingStages.includes(stage)
        ? filters.fundingStages.filter((s) => s !== stage)
        : [...filters.fundingStages, stage],
    }
    setFilters(updated)
    onFilterChange(updated)
  }

  const handleIndustryToggle = (industry: string) => {
    const updated = {
      ...filters,
      industries: filters.industries.includes(industry)
        ? filters.industries.filter((i) => i !== industry)
        : [...filters.industries, industry],
    }
    setFilters(updated)
    onFilterChange(updated)
  }

  const handleApply = () => {
    onFilterChange(filters)
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    onFilterChange(DEFAULT_FILTERS)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        bgcolor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <IconFilter size={18} color="#2563EB" />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1E293B' }}>
          Filters
        </Typography>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search investors..."
        value={filters.search}
        onChange={(e) => handleSearchChange(e.target.value)}
        sx={{ mb: 2.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size={15} color="#94A3B8" />
            </InputAdornment>
          ),
        }}
      />

      <Divider sx={{ mb: 2 }} />

      {/* Funding Stage */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.65rem', display: 'block', mb: 1 }}>
          Funding Stage
        </Typography>
        <FormGroup>
          {FUNDING_STAGES.map((stage) => (
            <FormControlLabel
              key={stage.value}
              control={
                <Checkbox
                  checked={filters.fundingStages.includes(stage.value)}
                  onChange={() => handleStageToggle(stage.value)}
                  size="small"
                  color="primary"
                  sx={{ py: 0.5 }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8125rem' }}>
                  {stage.label}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Industry */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.65rem', display: 'block', mb: 1 }}>
          Industry Focus
        </Typography>
        <FormGroup>
          {INDUSTRIES.map((industry) => (
            <FormControlLabel
              key={industry}
              control={
                <Checkbox
                  checked={filters.industries.includes(industry)}
                  onChange={() => handleIndustryToggle(industry)}
                  size="small"
                  color="primary"
                  sx={{ py: 0.5 }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8125rem' }}>
                  {industry}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Investor Type */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.65rem', display: 'block', mb: 1 }}>
          Investor Type
        </Typography>
        <Select
          fullWidth
          size="small"
          value={filters.investorType}
          onChange={(e) => {
            const updated = { ...filters, investorType: e.target.value }
            setFilters(updated)
            onFilterChange(updated)
          }}
        >
          {INVESTOR_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              <Typography variant="body2">{type.label}</Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Investment Range */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
          Investment Range
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            {formatAmount(filters.investmentRange[0])}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            {formatAmount(filters.investmentRange[1])}
          </Typography>
        </Box>
        <Slider
          value={filters.investmentRange}
          onChange={(_, value) => {
            const updated = { ...filters, investmentRange: value as [number, number] }
            setFilters(updated)
          }}
          onChangeCommitted={(_, value) => {
            const updated = { ...filters, investmentRange: value as [number, number] }
            onFilterChange(updated)
          }}
          min={10000}
          max={10000000}
          step={50000}
          color="primary"
          sx={{ '& .MuiSlider-thumb': { width: 14, height: 14 } }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Match Score */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
          Min Match Score: {filters.minMatchScore}%
        </Typography>
        <Slider
          value={filters.minMatchScore}
          onChange={(_, value) => {
            const updated = { ...filters, minMatchScore: value as number }
            setFilters(updated)
          }}
          onChangeCommitted={(_, value) => {
            const updated = { ...filters, minMatchScore: value as number }
            onFilterChange(updated)
          }}
          min={0}
          max={100}
          step={5}
          color="primary"
          sx={{ '& .MuiSlider-thumb': { width: 14, height: 14 } }}
        />
      </Box>

      {/* Action Buttons */}
      <Button fullWidth variant="contained" color="primary" onClick={handleApply} sx={{ mb: 1 }}>
        Apply Filters
      </Button>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<IconRefresh size={16} />}
        onClick={handleReset}
        sx={{ borderColor: '#E2E8F0', color: '#64748B', '&:hover': { borderColor: '#2563EB', color: '#2563EB' } }}
      >
        Reset
      </Button>
    </Paper>
  )
}
