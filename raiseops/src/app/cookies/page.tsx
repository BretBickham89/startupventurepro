import { Box, Typography } from '@mui/material'
import MarketingPageShell from '@/components/marketing/MarketingPageShell'
import LegalSection from '@/components/marketing/LegalSection'

export default function CookiePolicyPage() {
  return (
    <MarketingPageShell eyebrow="Legal" title="Cookie Policy">
      <Typography variant="body2" sx={{ color: '#7C8FAC', mb: 5 }}>
        Last updated: January 1, 2026
      </Typography>

      <LegalSection heading="1. What Are Cookies">
        Cookies are small text files stored on your device that help us recognize your browser
        and remember your preferences across visits.
      </LegalSection>

      <LegalSection heading="2. How We Use Cookies">
        We use essential cookies to keep you signed in and secure, and analytics cookies to
        understand how founders use RaiseOps so we can improve it.
      </LegalSection>

      <LegalSection heading="3. Types of Cookies We Use">
        Strictly necessary (session, authentication), functional (remembering your dashboard
        preferences), and analytics (aggregated, anonymized usage data).
      </LegalSection>

      <LegalSection heading="4. Managing Cookies">
        You can control or disable cookies through your browser settings. Disabling essential
        cookies may prevent you from signing in.
      </LegalSection>

      <Box sx={{ mt: 6, p: 3, bgcolor: '#F6F8FB', borderRadius: '12px' }}>
        <Typography variant="body2" sx={{ color: '#5A6A85' }}>
          This is placeholder legal content for demo purposes. Replace with your finalized cookie
          policy before launch.
        </Typography>
      </Box>
    </MarketingPageShell>
  )
}
