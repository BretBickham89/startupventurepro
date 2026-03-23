'use client'

import React from 'react'
import Link from 'next/link'
import { Box, Container, Typography, Grid, Stack, Button } from '@mui/material'
import {
  IconCheck,
  IconSearch,
  IconAddressBook,
  IconBrandLinkedin,
  IconMail,
  IconChartBar,
  IconCalendarEvent,
  IconBolt,
  IconHeadset,
  IconTemplate,
  IconStar,
  IconCode,
  IconUsers,
  IconFileExport,
  IconShieldCheck,
  IconArrowRight,
} from '@tabler/icons-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const OUTCOMES = [
  { stat: '5×', label: 'More investor replies' },
  { stat: '10×', label: 'Faster outreach' },
  { stat: '0 hrs', label: 'Daily content effort' },
  { stat: '60%', label: 'Shorter fundraising cycles' },
]

interface Feature {
  icon: React.ElementType
  text: string
}

interface Tier {
  name: string
  price: string
  description: string
  cta: string
  ctaHref: string
  highlighted: boolean
  badge?: string
  features: Feature[]
}

const TIERS: Tier[] = [
  {
    name: 'Launch',
    price: '$49',
    description: 'For founders validating ideas and starting investor outreach',
    cta: 'Start Free Trial',
    ctaHref: '/register',
    highlighted: false,
    features: [
      { icon: IconSearch, text: 'Discover investors matched to your stage and sector' },
      { icon: IconAddressBook, text: 'Track investor conversations and follow-ups' },
      { icon: IconBrandLinkedin, text: 'Automated content that builds investor visibility' },
      { icon: IconMail, text: 'Outreach templates that get replies' },
      { icon: IconChartBar, text: 'Performance analytics to sharpen your pitch' },
      { icon: IconCalendarEvent, text: 'Content calendar to stay consistent' },
    ],
  },
  {
    name: 'Raise',
    price: '$149',
    description: 'For founders actively raising capital and scaling growth',
    cta: 'Start Raising',
    ctaHref: '/register',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      { icon: IconBolt, text: 'Unlimited investor discovery with AI match scoring' },
      { icon: IconAddressBook, text: 'Track and manage investor conversations in one place' },
      { icon: IconBrandLinkedin, text: 'Automated content that builds investor visibility' },
      { icon: IconMail, text: 'AI-generated outreach sequences that convert' },
      { icon: IconChartBar, text: 'Advanced analytics and reporting' },
      { icon: IconHeadset, text: 'Priority support with 24/7 chat' },
      { icon: IconCalendarEvent, text: 'Meeting scheduler that fills your calendar' },
      { icon: IconTemplate, text: 'Battle-tested investor email templates' },
    ],
  },
  {
    name: 'Scale',
    price: '$399',
    description: 'For startups optimizing and closing larger rounds',
    cta: 'Talk to Sales',
    ctaHref: '#',
    highlighted: false,
    features: [
      { icon: IconCheck, text: 'Everything in Raise' },
      { icon: IconStar, text: 'White-glove onboarding and strategy call' },
      { icon: IconCode, text: 'Custom integrations (Salesforce, HubSpot)' },
      { icon: IconUsers, text: 'Dedicated fundraising success manager' },
      { icon: IconFileExport, text: 'Custom investor data exports and reports' },
      { icon: IconUsers, text: 'Team collaboration (up to 5 seats)' },
      { icon: IconCode, text: 'API access for custom workflows' },
      { icon: IconShieldCheck, text: 'SLA guarantee with uptime commitment' },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function OutcomeCard({ stat, label }: { stat: string; label: string }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        px: { xs: 2, md: 3 },
        py: { xs: 2.5, md: 3 },
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontWeight: 800,
          lineHeight: 1,
          mb: 0.75,
          background: 'linear-gradient(135deg, #60A5FA 0%, #34D399 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {stat}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500, fontSize: '0.875rem' }}
      >
        {label}
      </Typography>
    </Box>
  )
}

function FeatureRow({ icon: Icon, text, highlighted }: Feature & { highlighted: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: '7px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 0.1,
          ...(highlighted
            ? {
                background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(16,185,129,0.15) 100%)',
                border: '1px solid rgba(37,99,235,0.2)',
              }
            : {
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
              }),
        }}
      >
        <Icon
          size={13}
          color={highlighted ? '#60A5FA' : 'rgba(255,255,255,0.5)'}
          strokeWidth={2.2}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: highlighted ? '#374151' : 'rgba(255,255,255,0.65)',
          fontSize: '0.875rem',
          lineHeight: 1.55,
        }}
      >
        {text}
      </Typography>
    </Box>
  )
}

function PricingCard({ tier }: { tier: Tier }) {
  if (tier.highlighted) {
    return (
      // Gradient border trick: outer box has the gradient, inner card clips to white bg
      <Box
        sx={{
          position: 'relative',
          borderRadius: '18px',
          p: '2px',
          background: 'linear-gradient(145deg, #2563EB 0%, #10B981 100%)',
          boxShadow: '0 0 50px rgba(37,99,235,0.25), 0 20px 60px rgba(16,185,129,0.12)',
          transform: { md: 'scale(1.05)' },
          zIndex: 1,
          height: '100%',
        }}
      >
        {/* Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              px: 2,
              py: 0.6,
              borderRadius: '100px',
              whiteSpace: 'nowrap',
            }}
          >
            {tier.badge}
          </Box>
        </Box>

        {/* White card */}
        <Box
          sx={{
            borderRadius: '16px',
            bgcolor: '#fff',
            p: { xs: 3, md: 4 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#0D1B2A', mb: 0.5 }}>
              {tier.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.5 }}>
              {tier.description}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 3 }}>
            <Typography
              sx={{
                fontSize: '3rem',
                fontWeight: 800,
                color: '#0D1B2A',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {tier.price}
            </Typography>
            <Typography sx={{ color: '#9CA3AF', fontSize: '0.9rem' }}>/month</Typography>
          </Box>

          <Button
            component={Link}
            href={tier.ctaHref}
            fullWidth
            variant="contained"
            endIcon={<IconArrowRight size={16} />}
            sx={{
              mb: 3.5,
              py: 1.5,
              fontWeight: 700,
              fontSize: '0.9375rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                boxShadow: '0 4px 24px rgba(37,99,235,0.45)',
              },
            }}
          >
            {tier.cta}
          </Button>

          <Box
            sx={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #E5E7EB, transparent)',
              mb: 3,
            }}
          />

          <Stack spacing={2} sx={{ flex: 1 }}>
            {tier.features.map((f) => (
              <FeatureRow key={f.text} {...f} highlighted />
            ))}
          </Stack>
        </Box>
      </Box>
    )
  }

  // Dark card (Launch / Scale)
  return (
    <Box
      sx={{
        borderRadius: '16px',
        bgcolor: '#0D1927',
        border: '1px solid rgba(255,255,255,0.07)',
        p: { xs: 3, md: 4 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: 'rgba(255,255,255,0.14)' },
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#fff', mb: 0.5 }}>
          {tier.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
          {tier.description}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 3 }}>
        <Typography
          sx={{
            fontSize: '3rem',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          {tier.price}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>/month</Typography>
      </Box>

      <Button
        component={Link}
        href={tier.ctaHref}
        fullWidth
        variant="outlined"
        endIcon={<IconArrowRight size={16} />}
        sx={{
          mb: 3.5,
          py: 1.5,
          fontWeight: 600,
          fontSize: '0.9375rem',
          borderRadius: '10px',
          borderColor: 'rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.85)',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.35)',
            bgcolor: 'rgba(255,255,255,0.05)',
            color: '#fff',
          },
        }}
      >
        {tier.cta}
      </Button>

      <Box
        sx={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          mb: 3,
        }}
      />

      <Stack spacing={2} sx={{ flex: 1 }}>
        {tier.features.map((f) => (
          <FeatureRow key={f.text} {...f} highlighted={false} />
        ))}
      </Stack>
    </Box>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function PricingSection() {
  return (
    <Box
      id="pricing"
      sx={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f0f4ff 4%, #07111C 8%)',
        pt: { xs: 10, md: 14 },
        pb: { xs: 10, md: 14 },
      }}
    >
      <Container maxWidth="lg">

        {/* ── What Founders Achieve ── */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(96,165,250,0.1)',
                border: '1px solid rgba(96,165,250,0.2)',
                borderRadius: '100px',
                px: 2,
                py: 0.75,
                mb: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#60A5FA',
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#93C5FD',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Real Results
              </Typography>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#fff',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                letterSpacing: '-0.025em',
                mb: 1.5,
              }}
            >
              What founders achieve with RaiseOps
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '1.0625rem',
                maxWidth: 460,
                mx: 'auto',
              }}
            >
              Founders using RaiseOps start seeing investor responses within the first 7 days.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {OUTCOMES.map((o) => (
              <Grid size={{ xs: 6, md: 3 }} key={o.label}>
                <OutcomeCard {...o} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── Pricing Header ── */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#fff',
              fontSize: { xs: '2rem', md: '2.75rem' },
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Start raising faster
            <Box
              component="span"
              sx={{
                display: 'block',
                background: 'linear-gradient(135deg, #60A5FA 0%, #34D399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              with AI-powered execution
            </Box>
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '1.0625rem',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            From first investor outreach to closed rounds — fully automated
          </Typography>
        </Box>

        {/* ── Pricing Cards ── */}
        <Grid
          container
          spacing={3}
          alignItems="stretch"
          sx={{ mb: { xs: 5, md: 7 } }}
        >
          {TIERS.map((tier) => (
            <Grid
              size={{ xs: 12, md: 4 }}
              key={tier.name}
              sx={{ display: 'flex' }}
            >
              <Box sx={{ width: '100%', py: { md: tier.highlighted ? 0 : 2 } }}>
                <PricingCard tier={tier} />
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* ── Social Proof ── */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '100px',
              px: 3,
              py: 1.25,
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[...Array(5)].map((_, i) => (
                <Typography key={i} sx={{ color: '#FBBF24', fontSize: '0.85rem', lineHeight: 1 }}>
                  ★
                </Typography>
              ))}
            </Box>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}
            >
              Founders using RaiseOps start seeing investor responses{' '}
              <Box component="span" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                within the first 7 days
              </Box>
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  )
}
