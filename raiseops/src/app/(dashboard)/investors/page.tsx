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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Stack,
  Divider,
} from '@mui/material'
import { IconBuildingBank, IconMapPin, IconBriefcase, IconMail, IconBrandLinkedin, IconX } from '@tabler/icons-react'
import InvestorCard from '@/components/investors/InvestorCard'
import InvestorFilters, { type FilterState } from '@/components/investors/InvestorFilters'
import type { Investor } from '@/lib/supabase/types'

const TYPE_LABELS: Record<string, string> = {
  angel: 'Angel Investor',
  vc: 'Venture Capital',
  'family-office': 'Family Office',
  corporate: 'Corporate VC',
  accelerator: 'Accelerator',
}

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
  const [viewingInvestor, setViewingInvestor] = useState<Investor | null>(null)
  const [savedInvestors, setSavedInvestors] = useState<Set<string>>(new Set())

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
    setSavedInvestors((prev) => new Set([...prev, investor.id]))
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
                    onViewProfile={(inv) => setViewingInvestor(inv)}
                    isSaved={savedInvestors.has(investor.id)}
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

      {/* Investor Profile Modal */}
      <Dialog
        open={Boolean(viewingInvestor)}
        onClose={() => setViewingInvestor(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        {viewingInvestor && (
          <>
            <DialogTitle sx={{ pb: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(viewingInvestor.name)}&background=ECF2FF&color=5D87FF&bold=true&size=80`}
                  alt={viewingInvestor.name}
                  sx={{ width: 64, height: 64, borderRadius: '14px', border: '2px solid #e5eaef' }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#2A3547' }}>
                    {viewingInvestor.name}
                  </Typography>
                  {viewingInvestor.firm && (
                    <Typography variant="body2" sx={{ color: '#5A6A85', fontWeight: 500 }}>
                      {viewingInvestor.firm}
                    </Typography>
                  )}
                  <Chip
                    label={TYPE_LABELS[viewingInvestor.investor_type] ?? viewingInvestor.investor_type}
                    size="small"
                    sx={{ mt: 0.5, bgcolor: '#ECF2FF', color: '#5D87FF', fontWeight: 600, fontSize: '0.7rem' }}
                  />
                </Box>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    bgcolor: viewingInvestor.match_score >= 80 ? '#E6FFFA' : '#FEF5E5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${viewingInvestor.match_score >= 80 ? '#13DEB9' : '#FFAE1F'}`,
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: viewingInvestor.match_score >= 80 ? '#13DEB9' : '#FFAE1F', lineHeight: 1 }}>
                    {viewingInvestor.match_score}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6rem', color: '#7C8FAC', lineHeight: 1 }}>fit</Typography>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              {viewingInvestor.bio && (
                <Typography variant="body2" sx={{ color: '#5A6A85', lineHeight: 1.7, mb: 2 }}>
                  {viewingInvestor.bio}
                </Typography>
              )}

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                {viewingInvestor.location && (
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconMapPin size={16} color="#7C8FAC" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#7C8FAC', display: 'block' }}>Location</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>{viewingInvestor.location}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {viewingInvestor.portfolio_count && (
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconBriefcase size={16} color="#7C8FAC" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#7C8FAC', display: 'block' }}>Portfolio</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>{viewingInvestor.portfolio_count} companies</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {viewingInvestor.investment_range_min && (
                  <Grid size={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#7C8FAC', display: 'block' }}>Check Size</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>
                        {viewingInvestor.investment_range_min >= 1000000
                          ? `$${(viewingInvestor.investment_range_min / 1000000).toFixed(1)}M`
                          : `$${(viewingInvestor.investment_range_min / 1000).toFixed(0)}K`}
                        {' – '}
                        {viewingInvestor.investment_range_max
                          ? viewingInvestor.investment_range_max >= 1000000
                            ? `$${(viewingInvestor.investment_range_max / 1000000).toFixed(1)}M`
                            : `$${(viewingInvestor.investment_range_max / 1000).toFixed(0)}K`
                          : ''}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#7C8FAC', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.75 }}>
                  Focus Areas
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {viewingInvestor.focus_areas.map((area) => (
                    <Chip key={area} label={area} size="small" sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontWeight: 500, fontSize: '0.75rem' }} />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: '#7C8FAC', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.75 }}>
                  Stages
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {viewingInvestor.funding_stages.map((stage) => (
                    <Chip key={stage} label={stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' ')} size="small" variant="outlined" sx={{ borderColor: '#e5eaef', color: '#5A6A85', fontSize: '0.75rem' }} />
                  ))}
                </Stack>
              </Box>

              {(viewingInvestor.email || viewingInvestor.linkedin_url) && (
                <>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                  <Stack direction="row" spacing={1.5}>
                    {viewingInvestor.email && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<IconMail size={15} />}
                        href={`mailto:${viewingInvestor.email}`}
                        sx={{ borderColor: '#e5eaef', color: '#5A6A85', fontSize: '0.75rem' }}
                      >
                        {viewingInvestor.email}
                      </Button>
                    )}
                    {viewingInvestor.linkedin_url && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<IconBrandLinkedin size={15} />}
                        href={viewingInvestor.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ borderColor: '#0077B5', color: '#0077B5', fontSize: '0.75rem' }}
                      >
                        LinkedIn
                      </Button>
                    )}
                  </Stack>
                </>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
              <Button onClick={() => setViewingInvestor(null)} sx={{ color: '#5A6A85' }}>Close</Button>
              {!savedInvestors.has(viewingInvestor.id) ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    handleSaveToCRM(viewingInvestor)
                    setViewingInvestor(null)
                  }}
                  sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' }}
                >
                  + Save to CRM
                </Button>
              ) : (
                <Button variant="outlined" disabled sx={{ borderColor: '#13DEB9', color: '#13DEB9' }}>
                  ✓ Saved to CRM
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
