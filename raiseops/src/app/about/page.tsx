import { Box, Grid, Typography, Avatar, Stack } from '@mui/material'
import MarketingPageShell from '@/components/marketing/MarketingPageShell'

const VALUES = [
  {
    title: 'Founder-first',
    description: 'Every feature ships because it saves a founder time or gets them closer to a term sheet.',
  },
  {
    title: 'Signal over noise',
    description: "We'd rather surface 10 great-fit investors than 1,000 irrelevant ones.",
  },
  {
    title: 'Move fast, close faster',
    description: 'Fundraising has a clock. RaiseOps is built to compress weeks of manual work into hours.',
  },
]

const TEAM = [
  { name: 'Bret Bickham', role: 'Founder & CEO', initials: 'BB', color: '#5D87FF' },
  { name: 'Maya Chen', role: 'Head of Product', initials: 'MC', color: '#13DEB9' },
  { name: 'Jordan Reyes', role: 'Head of Engineering', initials: 'JR', color: '#7B61FF' },
]

export default function AboutPage() {
  return (
    <MarketingPageShell
      eyebrow="Company"
      title="We're building the operating system for fundraising"
      subtitle="RaiseOps is a product of Scalyn. We started RaiseOps after watching too many great founders lose momentum to spreadsheets, cold outreach guesswork, and scattered investor updates."
      maxWidth="lg"
    >
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {VALUES.map((value) => (
          <Grid size={{ xs: 12, md: 4 }} key={value.title}>
            <Box sx={{ p: 3, border: '1px solid #e5eaef', borderRadius: '12px', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2A3547', mb: 1 }}>
                {value.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A6A85', lineHeight: 1.7 }}>
                {value.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2A3547', mb: 3 }}>
        Meet the team
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
        {TEAM.map((member) => (
          <Box key={member.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: member.color, width: 48, height: 48, fontWeight: 700 }}>
              {member.initials}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#2A3547' }}>
                {member.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                {member.role}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </MarketingPageShell>
  )
}
