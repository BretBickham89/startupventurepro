'use client'

import React, { useState, useMemo } from 'react'
import {
  Box,
  Grid,
  Typography,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
} from '@mui/material'
import { IconBuildingBank } from '@tabler/icons-react'
import InvestorCard from '@/components/investors/InvestorCard'
import InvestorFilters, { type FilterState } from '@/components/investors/InvestorFilters'
import type { Investor } from '@/lib/supabase/types'

const MOCK_INVESTORS: Investor[] = [
  {
    id: '1',
    name: 'Sarah Kim',
    firm: 'Sequoia Capital',
    email: 'sarah.kim@sequoia.com',
    linkedin_url: 'https://linkedin.com/in/sarahkim',
    avatar_url: null,
    focus_areas: ['SaaS', 'FinTech', 'AI/ML'],
    funding_stages: ['seed', 'series-a', 'series-b'],
    investment_range_min: 500000,
    investment_range_max: 5000000,
    location: 'Menlo Park, CA',
    portfolio_count: 47,
    match_score: 94,
    bio: 'Partner at Sequoia focused on enterprise SaaS and fintech startups.',
    investor_type: 'vc',
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    firm: 'Andreessen Horowitz',
    email: 'mthompson@a16z.com',
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['HealthTech', 'AI/ML', 'DeepTech'],
    funding_stages: ['series-a', 'series-b', 'series-c'],
    investment_range_min: 2000000,
    investment_range_max: 20000000,
    location: 'San Francisco, CA',
    portfolio_count: 62,
    match_score: 88,
    bio: 'General Partner at a16z Bio focused on digital health and life sciences.',
    investor_type: 'vc',
  },
  {
    id: '3',
    name: 'Jennifer Walsh',
    firm: null,
    email: 'jen@jenwalsh.vc',
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['EdTech', 'Consumer', 'SaaS'],
    funding_stages: ['pre-seed', 'seed'],
    investment_range_min: 50000,
    investment_range_max: 500000,
    location: 'New York, NY',
    portfolio_count: 28,
    match_score: 82,
    bio: 'Angel investor and former EdTech founder. Investing in early-stage consumer and education technology.',
    investor_type: 'angel',
  },
  {
    id: '4',
    name: 'David Nakamura',
    firm: 'Lightspeed Venture Partners',
    email: null,
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['B2B', 'SaaS', 'FinTech'],
    funding_stages: ['seed', 'series-a'],
    investment_range_min: 1000000,
    investment_range_max: 8000000,
    location: 'Palo Alto, CA',
    portfolio_count: 34,
    match_score: 79,
    bio: 'Partner at Lightspeed focused on enterprise software and B2B marketplaces.',
    investor_type: 'vc',
  },
  {
    id: '5',
    name: 'Aisha Okonkwo',
    firm: 'Bessemer Venture Partners',
    email: null,
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['FinTech', 'HealthTech', 'DeepTech'],
    funding_stages: ['series-a', 'series-b'],
    investment_range_min: 3000000,
    investment_range_max: 15000000,
    location: 'New York, NY',
    portfolio_count: 41,
    match_score: 91,
    bio: 'Partner at BVP with a focus on transformative fintech and health technology companies.',
    investor_type: 'vc',
  },
  {
    id: '6',
    name: 'Roberto Fernandez',
    firm: 'Techstars',
    email: 'roberto@techstars.com',
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['SaaS', 'B2B', 'Consumer'],
    funding_stages: ['pre-seed', 'seed'],
    investment_range_min: 100000,
    investment_range_max: 200000,
    location: 'Austin, TX',
    portfolio_count: 120,
    match_score: 73,
    bio: 'Managing Director at Techstars Austin. Supporting early-stage founders with capital and community.',
    investor_type: 'accelerator',
  },
  {
    id: '7',
    name: 'Christina Park',
    firm: 'GV (Google Ventures)',
    email: null,
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['AI/ML', 'HealthTech', 'SaaS'],
    funding_stages: ['series-a', 'series-b'],
    investment_range_min: 5000000,
    investment_range_max: 30000000,
    location: 'Mountain View, CA',
    portfolio_count: 55,
    match_score: 85,
    bio: 'Investment Partner at GV focused on applied AI and digital health.',
    investor_type: 'corporate',
  },
  {
    id: '8',
    name: 'Michael Brennan',
    firm: 'Brennan Family Office',
    email: 'michael@brennanfo.com',
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['FinTech', 'Real Estate Tech', 'B2B'],
    funding_stages: ['seed', 'series-a'],
    investment_range_min: 250000,
    investment_range_max: 2000000,
    location: 'Chicago, IL',
    portfolio_count: 19,
    match_score: 68,
    bio: 'Family office investor with a background in financial services. Focus on fintech and real estate technology.',
    investor_type: 'family-office',
  },
  {
    id: '9',
    name: 'Priya Mehta',
    firm: 'First Round Capital',
    email: null,
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['Consumer', 'Marketplace', 'SaaS'],
    funding_stages: ['pre-seed', 'seed'],
    investment_range_min: 250000,
    investment_range_max: 1500000,
    location: 'San Francisco, CA',
    portfolio_count: 38,
    match_score: 87,
    bio: 'Partner at First Round Capital. Excited about consumer internet, marketplace businesses, and developer tools.',
    investor_type: 'vc',
  },
  {
    id: '10',
    name: 'Tom Bradley',
    firm: null,
    email: 'tom@tombradley.vc',
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['DeepTech', 'Climate Tech', 'AI/ML'],
    funding_stages: ['pre-seed', 'seed'],
    investment_range_min: 25000,
    investment_range_max: 200000,
    location: 'Boston, MA',
    portfolio_count: 22,
    match_score: 62,
    bio: 'Angel investor and MIT professor focused on deep tech and climate technology startups.',
    investor_type: 'angel',
  },
  {
    id: '11',
    name: 'Elena Vasquez',
    firm: 'Accel Partners',
    email: null,
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['SaaS', 'EdTech', 'FinTech'],
    funding_stages: ['series-a', 'series-b', 'series-c'],
    investment_range_min: 5000000,
    investment_range_max: 50000000,
    location: 'Palo Alto, CA',
    portfolio_count: 78,
    match_score: 76,
    bio: 'Partner at Accel. Former founder with 15+ years in enterprise software and education technology.',
    investor_type: 'vc',
  },
  {
    id: '12',
    name: 'James Okafor',
    firm: 'YC Alumni Angels',
    email: 'james@ycalumni.vc',
    linkedin_url: null,
    avatar_url: null,
    focus_areas: ['SaaS', 'B2B', 'AI/ML'],
    funding_stages: ['pre-seed', 'seed'],
    investment_range_min: 10000,
    investment_range_max: 100000,
    location: 'San Francisco, CA',
    portfolio_count: 31,
    match_score: 90,
    bio: 'YC alum (W19) and angel investor. Focused on early-stage B2B SaaS and AI tools for developers.',
    investor_type: 'angel',
  },
]

type SortOption = 'match_score' | 'name' | 'portfolio_count'

export default function InvestorsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    fundingStages: [],
    industries: [],
    investorType: 'all',
    investmentRange: [10000, 10000000],
    minMatchScore: 0,
  })
  const [sortBy, setSortBy] = useState<SortOption>('match_score')
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' })

  const filteredInvestors = useMemo(() => {
    let result = [...MOCK_INVESTORS]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (inv) =>
          inv.name.toLowerCase().includes(search) ||
          (inv.firm && inv.firm.toLowerCase().includes(search)) ||
          inv.focus_areas.some((a) => a.toLowerCase().includes(search))
      )
    }

    if (filters.fundingStages.length > 0) {
      result = result.filter((inv) =>
        filters.fundingStages.some((stage) => inv.funding_stages.includes(stage))
      )
    }

    if (filters.industries.length > 0) {
      result = result.filter((inv) =>
        filters.industries.some((ind) => inv.focus_areas.includes(ind))
      )
    }

    if (filters.investorType !== 'all') {
      result = result.filter((inv) => inv.investor_type === filters.investorType)
    }

    if (filters.minMatchScore > 0) {
      result = result.filter((inv) => inv.match_score >= filters.minMatchScore)
    }

    result.sort((a, b) => {
      if (sortBy === 'match_score') return b.match_score - a.match_score
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'portfolio_count') return (b.portfolio_count ?? 0) - (a.portfolio_count ?? 0)
      return 0
    })

    return result
  }, [filters, sortBy])

  const handleSaveToCRM = (investor: Investor) => {
    setSnackbar({ open: true, message: `${investor.name} added to your CRM pipeline!` })
  }

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
            Investor Discovery
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Find and connect with the right investors for your startup
          </Typography>
        </Box>
      </Box>

      {/* Stats bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          p: 2,
          bgcolor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5eaef',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconBuildingBank size={18} color="#5D87FF" />
            <Typography variant="body2" sx={{ color: '#5A6A85' }}>
              <strong style={{ color: '#2A3547' }}>2,847</strong> total investors
            </Typography>
          </Box>
          <Chip
            label={`Showing ${filteredInvestors.length} results`}
            size="small"
            sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontWeight: 600 }}
          />
          {filters.fundingStages.length > 0 && (
            <Chip
              label={`${filters.fundingStages.length} stage filter(s)`}
              size="small"
              sx={{ bgcolor: '#E8F7FF', color: '#23afdb', fontWeight: 500 }}
            />
          )}
        </Box>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <MenuItem value="match_score">Match Score (Best first)</MenuItem>
            <MenuItem value="name">Name (A-Z)</MenuItem>
            <MenuItem value="portfolio_count">Portfolio Size</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Layout: filters + grid */}
      <Grid container spacing={2.5}>
        {/* Filters Panel */}
        <Grid size={{ xs: 12, md: 3 }}>
          <InvestorFilters onFilterChange={setFilters} />
        </Grid>

        {/* Investor Grid */}
        <Grid size={{ xs: 12, md: 9 }}>
          {filteredInvestors.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5eaef',
              }}
            >
              <IconBuildingBank size={48} color="#DFE5EF" />
              <Typography variant="h6" sx={{ color: '#5A6A85', mt: 2 }}>
                No investors match your filters
              </Typography>
              <Typography variant="body2" sx={{ color: '#7C8FAC', mt: 0.5 }}>
                Try adjusting your filter criteria
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {filteredInvestors.map((investor) => (
                <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={investor.id}>
                  <InvestorCard
                    investor={investor}
                    onSaveToCRM={handleSaveToCRM}
                    onViewProfile={(inv) =>
                      setSnackbar({ open: true, message: `Viewing ${inv.name}'s full profile...` })
                    }
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  )
}
