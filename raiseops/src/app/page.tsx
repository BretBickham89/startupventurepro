'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/layout/Logo'
import PricingSection from '@/components/marketing/PricingSection'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  Divider,
  IconButton,
  useScrollTrigger,
  Slide,
  Paper,
} from '@mui/material'
import {
  IconBuildingBank,
  IconAddressBook,
  IconCalendar,
  IconBrandLinkedin,
  IconChartBar,
  IconSparkles,
  IconArrowRight,
  IconPlayerPlay,
  IconCheck,
  IconStar,
  IconMenu2,
  IconX,
} from '@tabler/icons-react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
]

const FEATURES = [
  {
    icon: <IconBuildingBank size={28} />,
    title: 'Investor Discovery',
    description:
      'Access 10,000+ verified investors filtered by stage, industry, and match score. Find your perfect funding partners in minutes.',
    color: '#2563EB',
    bg: '#ECF2FF',
  },
  {
    icon: <IconAddressBook size={28} />,
    title: 'Investor CRM',
    description:
      'Track every interaction, manage your pipeline from first contact to term sheet. Never miss a follow-up again.',
    color: '#10B981',
    bg: '#E8F7FF',
  },
  {
    icon: <IconCalendar size={28} />,
    title: 'Content Calendar',
    description:
      'Plan and schedule your founder story across all platforms. Build a consistent narrative that attracts investors.',
    color: '#13DEB9',
    bg: '#E6FFFA',
  },
  {
    icon: <IconBrandLinkedin size={28} />,
    title: 'Social Media Management',
    description:
      'Build your personal brand and attract inbound investor interest. Manage LinkedIn, Twitter, and more from one dashboard.',
    color: '#EF4444',
    bg: '#FDEDE8',
  },
  {
    icon: <IconSparkles size={28} />,
    title: 'AI Match Score',
    description:
      'Our algorithm scores investor-startup fit based on 50+ data points including portfolio history, check sizes, and sector focus.',
    color: '#FFAE1F',
    bg: '#FEF5E5',
  },
  {
    icon: <IconChartBar size={28} />,
    title: 'Analytics Dashboard',
    description:
      'Real-time insights on your fundraising progress and content performance. Data-driven decisions for faster rounds.',
    color: '#7B61FF',
    bg: '#F0EDFF',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    company: 'NovaTech AI',
    quote:
      'RaiseOps helped us close our $3.2M seed round in just 6 weeks. The investor matching algorithm is incredibly accurate — 9 out of our 10 top matches became real conversations.',
    avatar: 'SC',
    avatarBg: '#2563EB',
    raised: '$3.2M Seed',
  },
  {
    name: 'Marcus Williams',
    role: 'Co-Founder',
    company: 'HealthFlow',
    quote:
      "The CRM pipeline alone is worth 10x the subscription price. We tracked 140 investor conversations without missing a single follow-up. It's like having a full-time fundraising associate.",
    avatar: 'MW',
    avatarBg: '#13DEB9',
    raised: '$8.5M Series A',
  },
  {
    name: 'Priya Patel',
    role: 'Founder',
    company: 'EduScale',
    quote:
      'My LinkedIn following grew from 800 to 12,000 in 3 months using the content calendar. Two VCs reached out inbound because of my founder content. This platform is a game changer.',
    avatar: 'PP',
    avatarBg: '#EF4444',
    raised: '$1.8M Pre-seed',
  },
]


export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Box sx={{ bgcolor: '#fff', overflowX: 'hidden' }}>
      {/* NAVBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid #e5eaef' : 'none',
          transition: 'all 0.3s ease',
          color: '#0D1B2A',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 72 }}>
            {/* Logo */}
            <Box sx={{ flexGrow: 0 }}>
              <Logo href="/" onLight />
            </Box>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mx: 'auto' }}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.label}
                  href={link.href}
                  component="a"
                  sx={{
                    color: '#0D1B2A',
                    fontWeight: 500,
                    '&:hover': { bgcolor: '#F6F8FB', color: '#2563EB' },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Auth Buttons */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Button
                component={Link}
                href="/login"
                variant="text"
                sx={{ color: '#0D1B2A', fontWeight: 500 }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
                  px: 3,
                }}
              >
                Get Started
              </Button>
            </Box>

            {/* Mobile menu button */}
            <IconButton
              sx={{ display: { md: 'none' }, ml: 'auto', color: '#0D1B2A' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </IconButton>
          </Toolbar>
        </Container>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <Box
            sx={{
              display: { md: 'none' },
              bgcolor: '#fff',
              borderTop: '1px solid #e5eaef',
              p: 2,
            }}
          >
            {NAV_LINKS.map((link) => (
              <Button
                key={link.label}
                href={link.href}
                component="a"
                fullWidth
                sx={{ justifyContent: 'flex-start', color: '#0D1B2A', py: 1 }}
              >
                {link.label}
              </Button>
            ))}
            <Divider sx={{ my: 1 }} />
            <Button component={Link} href="/login" fullWidth sx={{ color: '#0D1B2A', mb: 1 }}>
              Sign In
            </Button>
            <Button
              component={Link}
              href="/register"
              fullWidth
              variant="contained"
              sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)' }}
            >
              Get Started Free
            </Button>
          </Box>
        )}
      </AppBar>

      {/* HERO SECTION */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #F6F8FF 0%, #EBF3FF 50%, #F0F9FF 100%)',
          pt: { xs: 14, md: 18 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(93,135,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left: Copy */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip
                label="Trusted by 500+ founders"
                size="small"
                sx={{
                  bgcolor: '#ECF2FF',
                  color: '#2563EB',
                  fontWeight: 600,
                  mb: 3,
                  px: 1,
                  '& .MuiChip-icon': { color: '#2563EB' },
                }}
                icon={<IconStar size={14} />}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: '#0D1B2A',
                  mb: 3,
                }}
              >
                Raise Capital.{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Build Momentum.
                </Box>{' '}
                Scale Your Startup.
              </Typography>

              <Typography
                variant="h6"
                sx={{ color: '#5A6A85', fontWeight: 400, lineHeight: 1.7, mb: 4, fontSize: '1.1rem' }}
              >
                The all-in-one platform connecting founders with investors, managing your
                fundraising pipeline, and amplifying your brand story.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  endIcon={<IconArrowRight size={20} />}
                  sx={{
                    background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<IconPlayerPlay size={20} />}
                  sx={{
                    borderColor: '#2563EB',
                    color: '#2563EB',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#ECF2FF', borderColor: '#4570EA' },
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>

              <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
                {[
                  { value: '10K+', label: 'Verified Investors' },
                  { value: '$2.1B+', label: 'Capital Connected' },
                  { value: '500+', label: 'Active Founders' },
                ].map((stat) => (
                  <Box key={stat.label}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#0D1B2A' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Right: Stats card visual */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative' }}>
                {/* Main card */}
                <Paper
                  elevation={0}
                  sx={{
                    background: 'linear-gradient(135deg, #2A3547 0%, #1a2236 100%)',
                    borderRadius: '20px',
                    p: 3,
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 24px 64px rgba(42, 53, 71, 0.3)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                    Your Fundraising Dashboard
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                      { label: 'Investors Matched', value: '2,847', trend: '+128 this week', color: '#2563EB' },
                      { label: 'Funding Raised', value: '$142M', trend: 'By our community', color: '#13DEB9' },
                      { label: 'Active Startups', value: '1,243', trend: '+47 this month', color: '#10B981' },
                    ].map((metric) => (
                      <Grid size={{ xs: 12, sm: 4 }} key={metric.label}>
                        <Box
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.07)',
                            borderRadius: '12px',
                            p: 2,
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <Typography
                            sx={{ fontSize: '1.5rem', fontWeight: 700, color: metric.color }}
                          >
                            {metric.value}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>
                            {metric.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            {metric.trend}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Pipeline visualization */}
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1.5 }}>
                    FUNDRAISING PIPELINE
                  </Typography>
                  {[
                    { stage: 'Prospects', count: 23, color: '#2563EB', width: '100%' },
                    { stage: 'Contacted', count: 18, color: '#10B981', width: '78%' },
                    { stage: 'Meeting Scheduled', count: 8, color: '#13DEB9', width: '35%' },
                    { stage: 'Due Diligence', count: 4, color: '#FFAE1F', width: '17%' },
                    { stage: 'Term Sheet', count: 2, color: '#EF4444', width: '9%' },
                  ].map((stage) => (
                    <Box key={stage.stage} sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {stage.stage}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          {stage.count}
                        </Typography>
                      </Box>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 6 }}>
                        <Box
                          sx={{
                            width: stage.width,
                            height: '100%',
                            bgcolor: stage.color,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Paper>

                {/* Floating notification */}
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    bgcolor: '#fff',
                    borderRadius: '12px',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: '1px solid #e5eaef',
                    minWidth: 200,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: '#E6FFFA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ color: '#13DEB9', fontWeight: 700, fontSize: '0.75rem' }}>
                      ✓
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#0D1B2A', display: 'block' }}>
                      New Match Found!
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                      Sequoia Capital — 94% fit
                    </Typography>
                  </Box>
                </Paper>

                {/* Floating meeting card */}
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    bgcolor: '#fff',
                    borderRadius: '12px',
                    p: 1.5,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: '1px solid #e5eaef',
                    minWidth: 180,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#0D1B2A', display: 'block' }}>
                    Meeting Confirmed
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#5A6A85', display: 'block' }}>
                    Andreessen Horowitz
                  </Typography>
                  <Chip
                    label="Tomorrow 2:00 PM"
                    size="small"
                    sx={{ bgcolor: '#ECF2FF', color: '#2563EB', fontSize: '0.65rem', mt: 0.5 }}
                  />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* LOGOS BAR */}
      <Box sx={{ py: 4, bgcolor: '#F6F8FB', borderTop: '1px solid #e5eaef', borderBottom: '1px solid #e5eaef' }}>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            align="center"
            sx={{ color: '#5A6A85', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Founders from these companies have raised with us
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 4,
            }}
          >
            {['Y Combinator', 'Techstars', '500 Global', 'a16z Portfolio', 'First Round'].map(
              (name) => (
                <Typography
                  key={name}
                  sx={{ color: '#7C8FAC', fontWeight: 700, fontSize: '0.875rem' }}
                >
                  {name}
                </Typography>
              )
            )}
          </Box>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 8 }}>
            <Chip
              label="Features"
              size="small"
              sx={{ bgcolor: '#ECF2FF', color: '#2563EB', fontWeight: 600, mb: 2 }}
            />
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: '#0D1B2A', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}
            >
              Everything you need to raise your round
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#5A6A85', maxWidth: 600, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.7 }}
            >
              From initial investor discovery to closing your round, RaiseOps has every
              tool a founder needs in one powerful platform.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {FEATURES.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '14px',
                        bgcolor: feature.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: feature.color,
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0D1B2A' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5A6A85', lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* SOCIAL PROOF / TESTIMONIALS */}
      <Box id="about" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F6F8FB' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 8 }}>
            <Chip
              label="Testimonials"
              size="small"
              sx={{ bgcolor: '#ECF2FF', color: '#2563EB', fontWeight: 600, mb: 2 }}
            />
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: '#0D1B2A', fontSize: { xs: '1.75rem', md: '2.25rem' } }}
            >
              Join the fastest-growing founders
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                <Card sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    {/* Stars */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <IconStar key={i} size={16} fill="#FFAE1F" color="#FFAE1F" />
                      ))}
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{ color: '#0D1B2A', lineHeight: 1.7, mb: 3, fontStyle: 'italic' }}
                    >
                      &quot;{t.quote}&quot;
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: t.avatarBg,
                          width: 44,
                          height: 44,
                          fontWeight: 700,
                        }}
                      >
                        {t.avatar}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0D1B2A' }}>
                          {t.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                          {t.role} · {t.company}
                        </Typography>
                      </Box>
                      <Chip
                        label={t.raised}
                        size="small"
                        sx={{ bgcolor: '#E6FFFA', color: '#02b3a9', fontWeight: 600, fontSize: '0.65rem' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* PRICING SECTION */}
      <PricingSection />

      {/* CTA BANNER */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(135deg, #2A3547 0%, #1a2236 50%, #2A3547 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(93,135,255,0.15) 0%, transparent 70%)',
          }}
        />
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: '#fff',
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              Ready to raise your round?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, fontSize: '1.1rem' }}
            >
              Join 500+ founders who are already using RaiseOps to connect with
              investors and close their rounds faster.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                endIcon={<IconArrowRight size={20} />}
                sx={{
                  background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
                  px: 5,
                  py: 1.5,
                  fontSize: '1rem',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  px: 5,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Schedule a Demo
              </Button>
            </Stack>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 2 }}>
              No credit card required · 14-day free trial · Cancel anytime
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ bgcolor: '#1a2236', color: 'rgba(255,255,255,0.7)', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Logo href="/" />
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.7, maxWidth: 280 }}>
                The all-in-one platform for founders raising capital, building their brand, and
                scaling their startup.
              </Typography>
            </Grid>

            {[
              {
                title: 'Product',
                links: [
                  { label: 'Investor Discovery', href: '/investors' },
                  { label: 'CRM Pipeline', href: '/investors/crm' },
                  { label: 'Content Calendar', href: '/content' },
                  { label: 'Analytics', href: '/analytics' },
                  { label: 'Integrations', href: '/#features' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'About Us', href: '/about' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Careers', href: '/careers' },
                  { label: 'Press', href: '/press' },
                  { label: 'Contact', href: '/contact' },
                ],
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Cookie Policy', href: '/cookies' },
                  { label: 'GDPR', href: '/gdpr' },
                ],
              },
            ].map((col) => (
              <Grid size={{ xs: 6, md: 2 }} key={col.title}>
                <Typography
                  variant="overline"
                  sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, display: 'block', mb: 1.5 }}
                >
                  {col.title}
                </Typography>
                <Stack spacing={1}>
                  {col.links.map((link) => (
                    <Typography
                      key={link.label}
                      variant="body2"
                      component={Link}
                      href={link.href}
                      sx={{
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        '&:hover': { color: '#2563EB' },
                        transition: 'color 0.2s',
                        cursor: 'pointer',
                        display: 'block',
                      }}
                    >
                      {link.label}
                    </Typography>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              © {new Date().getFullYear()} Scalyn Inc. RaiseOps is a product of{' '}
              <Box component="span" sx={{ color: '#10B981', fontWeight: 600 }}>Scalyn</Box>
              . All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <Typography
                  key={social}
                  variant="body2"
                  component="a"
                  href="#"
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    '&:hover': { color: '#2563EB' },
                  }}
                >
                  {social}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
