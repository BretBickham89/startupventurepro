import { Box, Typography } from '@mui/material'
import MarketingPageShell from '@/components/marketing/MarketingPageShell'
import LegalSection from '@/components/marketing/LegalSection'

export default function GDPRPage() {
  return (
    <MarketingPageShell eyebrow="Legal" title="GDPR Compliance">
      <Typography variant="body2" sx={{ color: '#7C8FAC', mb: 5 }}>
        Last updated: January 1, 2026
      </Typography>

      <LegalSection heading="Our Commitment">
        RaiseOps is committed to complying with the EU General Data Protection Regulation (GDPR)
        for all users, regardless of location.
      </LegalSection>

      <LegalSection heading="Legal Basis for Processing">
        We process your data based on your consent when you create an account, and our legitimate
        interest in operating and improving the platform.
      </LegalSection>

      <LegalSection heading="Your GDPR Rights">
        You have the right to access, rectify, erase, restrict, or port your personal data, and to
        object to certain processing. Contact privacy@raiseops.com to exercise these rights.
      </LegalSection>

      <LegalSection heading="Data Retention">
        We retain your data only as long as your account is active, or as needed to comply with
        legal obligations, after which it is deleted or anonymized.
      </LegalSection>

      <LegalSection heading="International Transfers">
        Where data is transferred outside the EEA, we rely on Standard Contractual Clauses and
        equivalent safeguards.
      </LegalSection>

      <LegalSection heading="Data Protection Officer">
        Our Data Protection Officer can be reached at privacy@raiseops.com for any GDPR-related
        inquiries.
      </LegalSection>

      <Box sx={{ mt: 6, p: 3, bgcolor: '#F6F8FB', borderRadius: '12px' }}>
        <Typography variant="body2" sx={{ color: '#5A6A85' }}>
          This is placeholder legal content for demo purposes. Replace with your finalized GDPR
          documentation before launch.
        </Typography>
      </Box>
    </MarketingPageShell>
  )
}
