import { Box, Stack, Typography, Chip, Button } from '@mui/material'
import { IconMapPin, IconClock } from '@tabler/icons-react'
import MarketingPageShell from '@/components/marketing/MarketingPageShell'

interface Role {
  title: string
  team: string
  location: string
  type: string
}

const ROLES: Role[] = [
  { title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Remote (US)', type: 'Full-time' },
  { title: 'Product Designer', team: 'Product', location: 'Remote (US)', type: 'Full-time' },
  { title: 'Growth Marketer', team: 'Marketing', location: 'Remote', type: 'Full-time' },
  { title: 'Customer Success Lead', team: 'Success', location: 'Remote (US)', type: 'Full-time' },
]

export default function CareersPage() {
  return (
    <MarketingPageShell
      eyebrow="Company"
      title="Join the team building the future of fundraising"
      subtitle="We're a small, remote-first team obsessed with helping founders raise faster. Here's what we're hiring for right now."
      maxWidth="lg"
    >
      <Stack spacing={2}>
        {ROLES.map((role) => (
          <Box
            key={role.title}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              p: 3,
              border: '1px solid #e5eaef',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
            }}
          >
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
                {role.title}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Chip label={role.team} size="small" sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontWeight: 600 }} />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <IconMapPin size={14} color="#7C8FAC" />
                  <Typography variant="caption" sx={{ color: '#7C8FAC' }}>{role.location}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <IconClock size={14} color="#7C8FAC" />
                  <Typography variant="caption" sx={{ color: '#7C8FAC' }}>{role.type}</Typography>
                </Stack>
              </Stack>
            </Box>
            <Button
              component="a"
              href="mailto:careers@raiseops.com"
              variant="outlined"
              sx={{ borderColor: '#5D87FF', color: '#5D87FF', whiteSpace: 'nowrap' }}
            >
              Apply
            </Button>
          </Box>
        ))}
      </Stack>

      <Box sx={{ mt: 5, p: 3, bgcolor: '#F6F8FB', borderRadius: '12px', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#5A6A85' }}>
          Don&apos;t see the right role?{' '}
          <Box component="a" href="mailto:careers@raiseops.com" sx={{ color: '#5D87FF', fontWeight: 600 }}>
            Reach out anyway
          </Box>
          .
        </Typography>
      </Box>
    </MarketingPageShell>
  )
}
