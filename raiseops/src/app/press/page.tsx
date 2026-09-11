import { Box, Grid, Typography, Stack } from '@mui/material'
import MarketingPageShell from '@/components/marketing/MarketingPageShell'

interface PressItem {
  outlet: string
  title: string
  date: string
}

const PRESS: PressItem[] = [
  { outlet: 'TechCrunch', title: 'RaiseOps wants to be the CRM every founder actually uses', date: 'Mar 2026' },
  { outlet: 'Forbes', title: 'The startup helping founders raise capital faster with AI matching', date: 'Feb 2026' },
  { outlet: 'The Information', title: 'Inside the tools founders use to close their seed round', date: 'Jan 2026' },
]

export default function PressPage() {
  return (
    <MarketingPageShell
      eyebrow="Company"
      title="Press & Media"
      subtitle="Coverage of RaiseOps, and resources for journalists writing about us."
      maxWidth="lg"
    >
      <Stack spacing={2} sx={{ mb: 6 }}>
        {PRESS.map((item) => (
          <Box
            key={item.title}
            sx={{
              p: 3,
              border: '1px solid #e5eaef',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#5D87FF', fontWeight: 700 }}>
                {item.outlet}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#2A3547' }}>
                {item.title}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
              {item.date}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 3, bgcolor: '#F6F8FB', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2A3547', mb: 1 }}>
              Media Kit
            </Typography>
            <Typography variant="body2" sx={{ color: '#5A6A85' }}>
              Logos, product screenshots, and brand guidelines for press use.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 3, bgcolor: '#F6F8FB', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2A3547', mb: 1 }}>
              Press Inquiries
            </Typography>
            <Typography variant="body2" sx={{ color: '#5A6A85' }}>
              Reach our team at{' '}
              <Box component="a" href="mailto:press@raiseops.com" sx={{ color: '#5D87FF', fontWeight: 600 }}>
                press@raiseops.com
              </Box>
              .
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </MarketingPageShell>
  )
}
