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
  CircularProgress,
  IconButton,
  Tooltip,
  Checkbox,
} from '@mui/material'
import {
  IconBuildingBank,
  IconMapPin,
  IconBriefcase,
  IconMail,
  IconBrandLinkedin,
  IconSparkles,
  IconRocket,
  IconListCheck,
  IconUsers,
  IconTarget,
  IconCopy,
  IconCheck,
  IconX,
} from '@tabler/icons-react'
import InvestorCard, { type PipelineStatus } from '@/components/investors/InvestorCard'
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

interface OutreachModal {
  open: boolean
  investor: Investor | null
  loading: boolean
  subject: string
  message: string
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Tooltip title={copied ? 'Copied!' : `Copy ${label}`}>
      <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? '#13DEB9' : '#7C8FAC' }}>
        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
      </IconButton>
    </Tooltip>
  )
}

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
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  })
  const [viewingInvestor, setViewingInvestor] = useState<Investor | null>(null)
  const [savedInvestors, setSavedInvestors] = useState<Set<string>>(new Set())
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [pipelineStatuses, setPipelineStatuses] = useState<Record<string, PipelineStatus>>({})
  const [outreachModal, setOutreachModal] = useState<OutreachModal>({
    open: false,
    investor: null,
    loading: false,
    subject: '',
    message: '',
  })

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
    setSnackbar({ open: true, message: `${investor.name} added to your CRM pipeline!`, severity: 'success' })
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredInvestors.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredInvestors.map((inv) => inv.id)))
    }
  }

  const handlePipelineStatusChange = (investorId: string, status: PipelineStatus) => {
    setPipelineStatuses((prev) => ({ ...prev, [investorId]: status }))
  }

  const handleAddToPipeline = (investor: Investor) => {
    setPipelineStatuses((prev) => ({
      ...prev,
      [investor.id]: prev[investor.id] === 'not-contacted' || !prev[investor.id] ? 'draft-ready' : prev[investor.id],
    }))
    setSnackbar({ open: true, message: `${investor.name} added to Outreach Pipeline`, severity: 'success' })
  }

  const handleGenerateIntro = async (investor: Investor) => {
    setOutreachModal({ open: true, investor, loading: true, subject: '', message: '' })

    try {
      const res = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorName: investor.name,
          investorFirm: investor.firm,
          focusAreas: investor.focus_areas,
          stage: investor.funding_stages[0],
          companyName: 'RaiseOps',
        }),
      })
      const data = await res.json()
      setOutreachModal((prev) => ({ ...prev, loading: false, subject: data.subject, message: data.message }))
      // Mark as draft-ready in pipeline
      setPipelineStatuses((prev) => ({ ...prev, [investor.id]: 'draft-ready' }))
    } catch {
      setOutreachModal((prev) => ({
        ...prev,
        loading: false,
        subject: 'Error generating outreach',
        message: 'Please try again.',
      }))
    }
  }

  const handleGenerateTop10 = () => {
    const top10 = filteredInvestors.slice(0, 10)
    setSelectedIds(new Set(top10.map((inv) => inv.id)))
    setSnackbar({ open: true, message: `Top 10 matches selected — ready for outreach!`, severity: 'info' })
  }

  const handleBulkOutreach = async () => {
    if (selectedIds.size === 0) {
      setSnackbar({ open: true, message: 'Select investors first to generate outreach', severity: 'info' })
      return
    }
    const first = filteredInvestors.find((inv) => selectedIds.has(inv.id))
    if (first) handleGenerateIntro(first)
  }

  const handleBuildPitchList = () => {
    const count = selectedIds.size || filteredInvestors.length
    setSnackbar({ open: true, message: `Pitch list built with ${count} investors — saved to CRM`, severity: 'success' })
    if (selectedIds.size > 0) {
      setSavedInvestors((prev) => new Set([...prev, ...selectedIds]))
    }
  }

  const allSelected = filteredInvestors.length > 0 && selectedIds.size === filteredInvestors.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < filteredInvestors.length

  return (
    <Box>
      {/* ── Page header ─────────────────────────────── */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547' }}>
              Investor Discovery
            </Typography>
            <Chip
              label="AI-Powered"
              size="small"
              icon={<IconSparkles size={12} />}
              sx={{
                background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.65rem',
                height: 22,
                '& .MuiChip-icon': { color: '#fff' },
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Your AI fundraising engine — find, match, and reach the right investors
          </Typography>
        </Box>
      </Box>

      {/* ── Stats bar ───────────────────────────────── */}
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
              <Box component="strong" sx={{ color: '#2A3547' }}>2,847</Box> investors in database
            </Typography>
          </Box>
          <Chip
            label={`${filteredInvestors.length} matches`}
            size="small"
            sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontWeight: 600 }}
          />
          {selectedIds.size > 0 && (
            <Chip
              label={`${selectedIds.size} selected`}
              size="small"
              sx={{ bgcolor: '#E6FFFA', color: '#13DEB9', fontWeight: 600 }}
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
            <MenuItem value="name">Name (A–Z)</MenuItem>
            <MenuItem value="portfolio_count">Portfolio Size</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ── Layout: filters + grid ──────────────────── */}
      <Grid container spacing={2.5}>
        {/* Filters Panel */}
        <Grid size={{ xs: 12, md: 3 }}>
          <InvestorFilters onFilterChange={setFilters} />
        </Grid>

        {/* Investor Grid */}
        <Grid size={{ xs: 12, md: 9 }}>
          {filteredInvestors.length > 0 && (
            <>
              {/* ── Bulk Action Bar ──────────────────── */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  mb: 2.5,
                  p: 1.75,
                  bgcolor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5eaef',
                }}
              >
                <Tooltip title={allSelected ? 'Deselect all' : 'Select all'}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleSelectAll}
                    size="small"
                    sx={{ p: 0.25, color: '#DDE3EE', '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#5D87FF' } }}
                  />
                </Tooltip>

                <Typography sx={{ fontSize: '0.8rem', color: '#5A6A85', mr: 0.5 }}>
                  {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Bulk actions:'}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<IconTarget size={14} />}
                  onClick={handleGenerateTop10}
                  sx={{
                    fontSize: '0.75rem',
                    borderColor: '#DDE3EE',
                    color: '#5A6A85',
                    borderRadius: '8px',
                    '&:hover': { borderColor: '#5D87FF', color: '#5D87FF', bgcolor: '#ECF2FF' },
                  }}
                >
                  Generate Top 10
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<IconRocket size={14} />}
                  onClick={handleBulkOutreach}
                  disabled={selectedIds.size === 0}
                  sx={{
                    fontSize: '0.75rem',
                    borderRadius: '8px',
                    ...(selectedIds.size > 0
                      ? {
                          background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                          color: '#fff',
                          border: 'none',
                          '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #059669 100%)', border: 'none' },
                        }
                      : { borderColor: '#DDE3EE', color: '#AABACF' }),
                  }}
                >
                  Generate Outreach{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<IconListCheck size={14} />}
                  onClick={handleBuildPitchList}
                  sx={{
                    fontSize: '0.75rem',
                    borderColor: '#DDE3EE',
                    color: '#5A6A85',
                    borderRadius: '8px',
                    '&:hover': { borderColor: '#10B981', color: '#10B981', bgcolor: '#E6FFFA' },
                  }}
                >
                  Build Pitch List
                </Button>
              </Box>
            </>
          )}

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
                    pipelineStatus={pipelineStatuses[investor.id] ?? 'not-contacted'}
                    isSelected={selectedIds.has(investor.id)}
                    isSaved={savedInvestors.has(investor.id)}
                    onGenerateIntro={() => handleGenerateIntro(investor)}
                    onPipelineStatusChange={(status) => handlePipelineStatusChange(investor.id, status)}
                    onToggleSelect={() => handleToggleSelect(investor.id)}
                    onSaveToCRM={() => handleSaveToCRM(investor)}
                    onViewProfile={() => setViewingInvestor(investor)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* ── Snackbar ─────────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity ?? 'success'}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ── Generate Intro Modal ─────────────────────── */}
      <Dialog
        open={outreachModal.open}
        onClose={() => !outreachModal.loading && setOutreachModal((prev) => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
      >
        {/* Gradient header */}
        <Box sx={{ background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)', p: 2.5, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {outreachModal.investor && (
              <Avatar
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(outreachModal.investor.name)}&background=ffffff30&color=ffffff&bold=true&size=80`}
                sx={{ width: 44, height: 44, borderRadius: '11px', border: '2px solid rgba(255,255,255,0.3)' }}
              />
            )}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconRocket size={16} color="rgba(255,255,255,0.9)" />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  AI-Generated Intro
                </Typography>
              </Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>
                {outreachModal.investor?.name}
              </Typography>
              {outreachModal.investor?.firm && (
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>
                  {outreachModal.investor.firm}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={() => !outreachModal.loading && setOutreachModal((prev) => ({ ...prev, open: false }))}
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
              size="small"
            >
              <IconX size={18} />
            </IconButton>
          </Box>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          {outreachModal.loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5, gap: 2 }}>
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress
                  size={52}
                  thickness={3}
                  sx={{ color: '#2563EB' }}
                />
                <IconSparkles size={20} color="#2563EB" style={{ position: 'absolute' }} />
              </Box>
              <Typography sx={{ color: '#5A6A85', fontSize: '0.875rem', fontWeight: 500 }}>
                Crafting your personalized outreach...
              </Typography>
              <Typography sx={{ color: '#7C8FAC', fontSize: '0.78rem', textAlign: 'center', maxWidth: 280 }}>
                Analyzing investor thesis, portfolio fit, and crafting a compelling message
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2.5}>
              {/* Subject line */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#7C8FAC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Subject Line
                  </Typography>
                  <CopyButton text={outreachModal.subject} label="subject" />
                </Box>
                <Box
                  sx={{
                    bgcolor: '#F6F8FB',
                    borderRadius: '8px',
                    p: 1.5,
                    border: '1px solid #e5eaef',
                  }}
                >
                  <Typography sx={{ fontSize: '0.8rem', color: '#2A3547', fontWeight: 600, lineHeight: 1.5 }}>
                    {outreachModal.subject}
                  </Typography>
                </Box>
              </Box>

              {/* Message body */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#7C8FAC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Message
                  </Typography>
                  <CopyButton text={outreachModal.message} label="message" />
                </Box>
                <Box
                  sx={{
                    bgcolor: '#F6F8FB',
                    borderRadius: '8px',
                    p: 1.75,
                    border: '1px solid #e5eaef',
                    maxHeight: 280,
                    overflowY: 'auto',
                  }}
                >
                  <Typography
                    component="pre"
                    sx={{
                      fontSize: '0.8rem',
                      color: '#2A3547',
                      lineHeight: 1.75,
                      fontFamily: 'inherit',
                      whiteSpace: 'pre-wrap',
                      m: 0,
                    }}
                  >
                    {outreachModal.message}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>

        {!outreachModal.loading && (
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setOutreachModal((prev) => ({ ...prev, open: false }))}
              sx={{ color: '#5A6A85', borderRadius: '8px' }}
            >
              Close
            </Button>
            <Button
              variant="outlined"
              startIcon={<IconCopy size={15} />}
              onClick={() => {
                navigator.clipboard.writeText(`Subject: ${outreachModal.subject}\n\n${outreachModal.message}`)
                setSnackbar({ open: true, message: 'Full outreach copied to clipboard!', severity: 'success' })
              }}
              sx={{ borderColor: '#DDE3EE', color: '#5A6A85', borderRadius: '8px', '&:hover': { borderColor: '#5D87FF', color: '#5D87FF' } }}
            >
              Copy All
            </Button>
            <Button
              variant="contained"
              startIcon={<IconCheck size={15} />}
              onClick={() => {
                if (outreachModal.investor) {
                  handlePipelineStatusChange(outreachModal.investor.id, 'sent')
                  setSnackbar({ open: true, message: `${outreachModal.investor.name} marked as Sent`, severity: 'success' })
                }
                setOutreachModal((prev) => ({ ...prev, open: false }))
              }}
              sx={{
                background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                borderRadius: '8px',
                '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #059669 100%)' },
              }}
            >
              Mark as Sent
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* ── Investor Profile Modal ───────────────────── */}
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
                      <Button size="small" variant="outlined" startIcon={<IconMail size={15} />} href={`mailto:${viewingInvestor.email}`} sx={{ borderColor: '#e5eaef', color: '#5A6A85', fontSize: '0.75rem' }}>
                        {viewingInvestor.email}
                      </Button>
                    )}
                    {viewingInvestor.linkedin_url && (
                      <Button size="small" variant="outlined" startIcon={<IconBrandLinkedin size={15} />} href={viewingInvestor.linkedin_url} target="_blank" rel="noopener noreferrer" sx={{ borderColor: '#0077B5', color: '#0077B5', fontSize: '0.75rem' }}>
                        LinkedIn
                      </Button>
                    )}
                  </Stack>
                </>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
              <Button onClick={() => setViewingInvestor(null)} sx={{ color: '#5A6A85', borderRadius: '8px' }}>Close</Button>
              <Button
                variant="outlined"
                onClick={() => {
                  handleGenerateIntro(viewingInvestor)
                  setViewingInvestor(null)
                }}
                startIcon={<IconRocket size={15} />}
                sx={{ borderRadius: '8px', borderColor: '#2563EB', color: '#2563EB' }}
              >
                Generate Intro
              </Button>
              {!savedInvestors.has(viewingInvestor.id) ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    handleSaveToCRM(viewingInvestor)
                    setViewingInvestor(null)
                  }}
                  sx={{ background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)', borderRadius: '8px' }}
                >
                  + Save to CRM
                </Button>
              ) : (
                <Button variant="outlined" disabled sx={{ borderColor: '#13DEB9', color: '#13DEB9', borderRadius: '8px' }}>
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
