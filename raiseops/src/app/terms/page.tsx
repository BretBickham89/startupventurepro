import { Box, Typography } from '@mui/material'
import MarketingPageShell from '@/components/marketing/MarketingPageShell'
import LegalSection from '@/components/marketing/LegalSection'

export default function TermsOfServicePage() {
  return (
    <MarketingPageShell eyebrow="Legal" title="Terms of Service">
      <Typography variant="body2" sx={{ color: '#7C8FAC', mb: 5 }}>
        Last updated: January 1, 2026
      </Typography>

      <LegalSection heading="1. Acceptance of Terms">
        By creating an account or using RaiseOps, you agree to be bound by these Terms of Service
        and our Privacy Policy.
      </LegalSection>

      <LegalSection heading="2. Description of Service">
        RaiseOps provides tools to help founders discover investors, manage fundraising pipelines,
        schedule content, and track fundraising analytics. Features are provided &quot;as is&quot; and may
        change over time.
      </LegalSection>

      <LegalSection heading="3. Your Account">
        You&apos;re responsible for maintaining the security of your account credentials and for all
        activity that occurs under your account.
      </LegalSection>

      <LegalSection heading="4. Acceptable Use">
        You agree not to misuse RaiseOps — including scraping investor data for resale, sending
        spam, or attempting to disrupt the service.
      </LegalSection>

      <LegalSection heading="5. Subscription & Billing">
        Paid plans are billed in advance on a monthly or annual basis. You can cancel anytime from
        Settings → Billing; access continues until the end of your billing period.
      </LegalSection>

      <LegalSection heading="6. Limitation of Liability">
        RaiseOps is not liable for indirect or consequential damages arising from your use of the
        platform, including fundraising outcomes.
      </LegalSection>

      <LegalSection heading="7. Changes to These Terms">
        We may update these terms from time to time. We&apos;ll notify you of material changes by email
        or in-app notice.
      </LegalSection>

      <Box sx={{ mt: 6, p: 3, bgcolor: '#F6F8FB', borderRadius: '12px' }}>
        <Typography variant="body2" sx={{ color: '#5A6A85' }}>
          This is placeholder legal content for demo purposes. Replace with your finalized,
          attorney-reviewed terms before launch.
        </Typography>
      </Box>
    </MarketingPageShell>
  )
}
