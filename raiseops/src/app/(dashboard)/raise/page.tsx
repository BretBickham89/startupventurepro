'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material'
import {
  IconSparkles,
  IconCopy,
  IconCheck,
  IconRocket,
  IconRefresh,
  IconFileDescription,
  IconMail,
  IconBrandLinkedin,
  IconTarget,
  IconBulb,
  IconAlertCircle,
  IconDownload,
  IconShield,
} from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'
import type { FundraisingBrief, BriefInput } from '@/lib/ai/schemas'

const STAGES = [
  { value: 'pre-seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'series-c', label: 'Series C' },
  { value: 'growth', label: 'Growth' },
]

const ROUND_TYPES = [
  { value: 'safe', label: 'SAFE (Simple Agreement for Future Equity)' },
  { value: 'convertible-note', label: 'Convertible Note' },
  { value: 'priced-equity', label: 'Priced Equity Round' },
  { value: 'revenue-based', label: 'Revenue-Based Financing' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
      <IconButton size="small" onClick={handle} sx={{ color: copied ? '#13DEB9' : '#7C8FAC' }}>
        {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
      </IconButton>
    </Tooltip>
  )
}

interface OutputSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  action?: React.ReactNode
}

function OutputSection({ title, icon, children, action }: OutputSectionProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: '#5D87FF' }}>{icon}</Box>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2A3547', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </Typography>
        </Box>
        {action}
      </Box>
      {children}
    </Box>
  )
}

export default function RaisePage() {
  const [input, setInput] = useState<BriefInput>({
    companyName: '',
    stage: 'seed',
    roundType: 'safe',
    raiseAmount: '',
    useOfFunds: '',
    tractionPoints: '',
    mrr: '',
    growthRate: '',
    customerCount: '',
    risks: '',
    founderBio: '',
    targetInvestorTags: '',
  })
  const [brief, setBrief] = useState<FundraisingBrief | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })
  const [saved, setSaved] = useState(false)

  // Pre-fill company name from user profile
  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const meta = user.user_metadata ?? {}
      const company = meta.company_name ?? ''
      if (company) setInput((prev) => ({ ...prev, companyName: company }))
    }
    load()
  }, [])

  const handleChange = (field: keyof BriefInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [field]: e.target.value }))
    setSaved(false)
  }

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    setBrief(null)
    setActiveTab(0)

    try {
      const res = await fetch('/api/ai/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to generate brief.')
      } else {
        setBrief(data.brief)
      }
    } catch {
      setError('Network error — please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!brief) return
    const lines = [
      `# Fundraising Brief — ${input.companyName}`,
      `Stage: ${input.stage}  |  Round: ${input.roundType}  |  Raise: ${input.raiseAmount || 'TBD'}`,
      '',
      '## Executive Summary',
      brief.executive_summary,
      '',
      '## Narrative',
      brief.narrative,
      '',
      '## Investor Update',
      brief.investor_update,
      '',
      '## Pitch Email',
      brief.pitch_email,
      '',
      '## LinkedIn Post',
      brief.linkedin_post,
      '',
      '## Key Claims',
      ...brief.key_claims.map((c) => `• ${c}`),
      '',
      '## Talking Points',
      ...brief.talking_points.map((t) => `• ${t}`),
      '',
      '## Risks & Mitigations',
      ...brief.risks_and_mitigations.map((r) => `• Risk: ${r.risk}\n  Mitigation: ${r.mitigation}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${input.companyName.replace(/\s+/g, '-').toLowerCase()}-fundraising-brief.md`
    a.click()
    URL.revokeObjectURL(url)
    setSnackbar({ open: true, message: 'Brief downloaded as Markdown.' })
  }

  const canGenerate = input.companyName.trim().length > 0 && (input.useOfFunds.trim() || input.tractionPoints.trim())

  const TABS = [
    { label: 'Summary', icon: <IconFileDescription size={15} /> },
    { label: 'Email', icon: <IconMail size={15} /> },
    { label: 'LinkedIn', icon: <IconBrandLinkedin size={15} /> },
    { label: 'Claims', icon: <IconTarget size={15} /> },
    { label: 'Talking Points', icon: <IconBulb size={15} /> },
    { label: 'Risks', icon: <IconShield size={15} /> },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547' }}>
              AI Brief Builder
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
            Generate a complete fundraising brief, pitch email, and social content in seconds
          </Typography>
        </Box>
        {brief && (
          <Button
            variant="outlined"
            startIcon={<IconDownload size={16} />}
            onClick={handleDownload}
            sx={{ borderColor: '#5D87FF', color: '#5D87FF', '&:hover': { bgcolor: '#ECF2FF' } }}
          >
            Download .md
          </Button>
        )}
      </Box>

      <Grid container spacing={2.5}>
        {/* ── Input Form ──────────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#2A3547', mb: 2.5, fontSize: '0.9375rem' }}>
                Startup Details
              </Typography>

              <Stack spacing={2}>
                {/* Row 1: Company + Stage */}
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <TextField
                      label="Company Name"
                      fullWidth
                      size="small"
                      value={input.companyName}
                      onChange={handleChange('companyName')}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField
                      label="Stage"
                      select
                      fullWidth
                      size="small"
                      value={input.stage}
                      onChange={handleChange('stage')}
                    >
                      {STAGES.map((s) => (
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                {/* Row 2: Round type + Raise amount */}
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <TextField
                      label="Round Type"
                      select
                      fullWidth
                      size="small"
                      value={input.roundType}
                      onChange={handleChange('roundType')}
                    >
                      {ROUND_TYPES.map((r) => (
                        <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField
                      label="Raise Amount"
                      fullWidth
                      size="small"
                      placeholder="e.g. $2M"
                      value={input.raiseAmount}
                      onChange={handleChange('raiseAmount')}
                    />
                  </Grid>
                </Grid>

                {/* Key Metrics Row */}
                <Box>
                  <Typography variant="caption" sx={{ color: '#5A6A85', fontWeight: 600, display: 'block', mb: 1 }}>
                    Key Metrics
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        label="MRR"
                        fullWidth
                        size="small"
                        placeholder="$24K"
                        value={input.mrr}
                        onChange={handleChange('mrr')}
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        label="Growth Rate"
                        fullWidth
                        size="small"
                        placeholder="18% MoM"
                        value={input.growthRate}
                        onChange={handleChange('growthRate')}
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        label="Customers"
                        fullWidth
                        size="small"
                        placeholder="1,243"
                        value={input.customerCount}
                        onChange={handleChange('customerCount')}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <TextField
                  label="Use of Funds"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="50% product engineering, 30% GTM, 20% ops..."
                  value={input.useOfFunds}
                  onChange={handleChange('useOfFunds')}
                />

                <TextField
                  label="Traction & Milestones"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Signed 3 enterprise LOIs, launched V2 in Jan, partnership with Stripe..."
                  value={input.tractionPoints}
                  onChange={handleChange('tractionPoints')}
                />

                <TextField
                  label="Founder Bio"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Ex-Google PM + MIT CS grad. Previously built and sold a SaaS to Salesforce..."
                  value={input.founderBio}
                  onChange={handleChange('founderBio')}
                />

                <TextField
                  label="Target Investor Thesis"
                  fullWidth
                  size="small"
                  placeholder="B2B SaaS, AI/ML, FinTech, enterprise software"
                  value={input.targetInvestorTags}
                  onChange={handleChange('targetInvestorTags')}
                  helperText="Comma-separated focus areas to personalize outreach context"
                />

                <TextField
                  label="Key Risks & Mitigations"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Market timing risk — mitigated by 3 enterprise pilots already signed..."
                  value={input.risks}
                  onChange={handleChange('risks')}
                />

                {error && (
                  <Alert
                    severity="error"
                    icon={<IconAlertCircle size={18} />}
                    sx={{ borderRadius: '8px', fontSize: '0.8125rem' }}
                  >
                    {error}
                  </Alert>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!canGenerate || loading}
                  onClick={handleGenerate}
                  startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <IconRocket size={18} />}
                  sx={{
                    background: loading ? undefined : 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                    fontWeight: 700,
                    py: 1.5,
                    borderRadius: '10px',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #059669 100%)',
                    },
                  }}
                >
                  {loading ? 'Generating Brief…' : 'Generate Fundraising Brief'}
                </Button>

                {brief && !loading && (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<IconRefresh size={16} />}
                    onClick={handleGenerate}
                    sx={{ borderColor: '#DDE3EE', color: '#5A6A85' }}
                  >
                    Regenerate
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Output Panel ─────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {!brief && !loading && (
            <Card sx={{ height: '100%', minHeight: 400 }}>
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  py: 8,
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(16,185,129,0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconSparkles size={32} color="#2563EB" />
                </Box>
                <Typography sx={{ fontWeight: 700, color: '#2A3547', fontSize: '1.125rem' }}>
                  Your brief will appear here
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A6A85', textAlign: 'center', maxWidth: 360 }}>
                  Fill in your startup details on the left, then click{' '}
                  <strong>Generate Fundraising Brief</strong> to produce your complete fundraising package.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                  {['Executive Summary', 'Pitch Email', 'LinkedIn Post', 'Key Claims', 'Talking Points'].map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      size="small"
                      sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontSize: '0.7rem', height: 22, fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card sx={{ height: '100%', minHeight: 400 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2.5 }}>
                <Box sx={{ position: 'relative', width: 64, height: 64 }}>
                  <CircularProgress
                    size={64}
                    thickness={3}
                    sx={{ color: 'transparent', '& .MuiCircularProgress-circle': { stroke: 'url(#gradient)' } }}
                  />
                  <Box
                    sx={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <IconSparkles size={24} color="#2563EB" />
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 700, color: '#2A3547' }}>Generating your brief…</Typography>
                <Typography variant="body2" sx={{ color: '#5A6A85', textAlign: 'center' }}>
                  Claude is crafting your narrative, pitch email, and talking points
                </Typography>
              </CardContent>
            </Card>
          )}

          {brief && !loading && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                {/* Tab bar */}
                <Box sx={{ borderBottom: '1px solid #e5eaef', mb: 3 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      minHeight: 40,
                      '& .MuiTab-root': { minHeight: 40, py: 0, fontSize: '0.78rem', fontWeight: 600, textTransform: 'none' },
                      '& .Mui-selected': { color: '#2563EB' },
                      '& .MuiTabs-indicator': { bgcolor: '#2563EB' },
                    }}
                  >
                    {TABS.map((tab, i) => (
                      <Tab
                        key={tab.label}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            {tab.icon}
                            {tab.label}
                          </Box>
                        }
                        value={i}
                      />
                    ))}
                  </Tabs>
                </Box>

                {/* Tab 0: Summary */}
                {activeTab === 0 && (
                  <Stack spacing={3}>
                    <OutputSection
                      title="Executive Summary"
                      icon={<IconFileDescription size={16} />}
                      action={<CopyButton text={brief.executive_summary} />}
                    >
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: '#F6F8FB',
                          borderRadius: '10px',
                          border: '1px solid #e5eaef',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#2A3547', lineHeight: 1.8 }}>
                          {brief.executive_summary}
                        </Typography>
                      </Box>
                    </OutputSection>
                    <Divider />
                    <OutputSection
                      title="Fundraising Narrative"
                      icon={<IconFileDescription size={16} />}
                      action={<CopyButton text={brief.narrative} />}
                    >
                      <Typography variant="body2" sx={{ color: '#2A3547', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                        {brief.narrative}
                      </Typography>
                    </OutputSection>
                    <Divider />
                    <OutputSection
                      title="Investor Update"
                      icon={<IconFileDescription size={16} />}
                      action={<CopyButton text={brief.investor_update} />}
                    >
                      <Typography variant="body2" sx={{ color: '#2A3547', lineHeight: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                        {brief.investor_update}
                      </Typography>
                    </OutputSection>
                  </Stack>
                )}

                {/* Tab 1: Pitch Email */}
                {activeTab === 1 && (
                  <OutputSection
                    title="Pitch Email (Body)"
                    icon={<IconMail size={16} />}
                    action={<CopyButton text={brief.pitch_email} />}
                  >
                    <Box sx={{ p: 2.5, bgcolor: '#F6F8FB', borderRadius: '10px', border: '1px solid #e5eaef' }}>
                      <Typography variant="body2" sx={{ color: '#2A3547', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                        {brief.pitch_email}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#7C8FAC', mt: 1, display: 'block' }}>
                      Tip: Personalize the subject line when sending to a specific investor.
                    </Typography>
                  </OutputSection>
                )}

                {/* Tab 2: LinkedIn Post */}
                {activeTab === 2 && (
                  <OutputSection
                    title="LinkedIn Post"
                    icon={<IconBrandLinkedin size={16} />}
                    action={<CopyButton text={brief.linkedin_post} />}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: '#E3F2FD',
                        borderRadius: '10px',
                        border: '1px solid #90CAF9',
                        position: 'relative',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#0D47A1', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                        {brief.linkedin_post}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Typography variant="caption" sx={{ color: brief.linkedin_post.length > 350 ? '#FA896B' : '#7C8FAC' }}>
                        {brief.linkedin_post.length} / 3000 chars
                      </Typography>
                    </Box>
                  </OutputSection>
                )}

                {/* Tab 3: Key Claims */}
                {activeTab === 3 && (
                  <OutputSection
                    title="Key Claims"
                    icon={<IconTarget size={16} />}
                    action={<CopyButton text={brief.key_claims.map((c) => `• ${c}`).join('\n')} />}
                  >
                    <Stack spacing={1.25}>
                      {brief.key_claims.map((claim, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: 'flex',
                            gap: 1.5,
                            p: 1.5,
                            bgcolor: '#F6F8FB',
                            borderRadius: '8px',
                            border: '1px solid #e5eaef',
                          }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              mt: 0.1,
                            }}
                          >
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff' }}>
                              {i + 1}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#2A3547', lineHeight: 1.6 }}>
                            {claim}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </OutputSection>
                )}

                {/* Tab 4: Talking Points */}
                {activeTab === 4 && (
                  <OutputSection
                    title="Talking Points"
                    icon={<IconBulb size={16} />}
                    action={<CopyButton text={brief.talking_points.map((t) => `• ${t}`).join('\n')} />}
                  >
                    <Stack spacing={1}>
                      {brief.talking_points.map((point, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: 'flex',
                            gap: 1.5,
                            alignItems: 'flex-start',
                            p: 1.5,
                            bgcolor: i % 2 === 0 ? '#F6F8FB' : '#fff',
                            borderRadius: '8px',
                            border: '1px solid #f0f3f7',
                          }}
                        >
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2563EB', mt: '6px', flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ color: '#2A3547', lineHeight: 1.7 }}>
                            {point}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </OutputSection>
                )}

                {/* Tab 5: Risks */}
                {activeTab === 5 && (
                  <OutputSection
                    title="Risks & Mitigations"
                    icon={<IconShield size={16} />}
                    action={
                      <CopyButton
                        text={brief.risks_and_mitigations
                          .map((r) => `Risk: ${r.risk}\nMitigation: ${r.mitigation}`)
                          .join('\n\n')}
                      />
                    }
                  >
                    <Stack spacing={2}>
                      {brief.risks_and_mitigations.map((item, i) => (
                        <Box key={i} sx={{ p: 2, bgcolor: '#FEF5E5', borderRadius: '10px', border: '1px solid #FFAE1F40' }}>
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFAE1F', mb: 0.75 }}>
                            Risk {i + 1}: {item.risk}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'flex-start' }}>
                            <IconCheck size={14} color="#13DEB9" style={{ marginTop: 2, flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ color: '#2A3547', lineHeight: 1.7 }}>
                              {item.mitigation}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </OutputSection>
                )}
              </CardContent>
            </Card>
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
