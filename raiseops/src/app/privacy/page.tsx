import { Box, Typography } from '@mui/material'
import MarketingPageShell from '@/components/marketing/MarketingPageShell'
import LegalSection from '@/components/marketing/LegalSection'

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageShell eyebrow="Legal" title="Privacy Policy">
      <Typography variant="body2" sx={{ color: '#7C8FAC', mb: 5 }}>
        Last updated: January 1, 2026
      </Typography>

      <LegalSection heading="1. Information We Collect">
        We collect information you provide directly, such as your name, email, company details, and
        fundraising data you enter into RaiseOps. We also collect usage data — like which features you
        use and how often — to improve the product.
      </LegalSection>

      <LegalSection heading="2. How We Use Your Information">
        We use your information to operate and improve RaiseOps, personalize investor matches,
        send you product updates, and provide customer support. We never sell your personal data
        to third parties.
      </LegalSection>

      <LegalSection heading="3. Data Sharing">
        We share data only with service providers who help us run RaiseOps (hosting, analytics,
        email delivery) under strict confidentiality agreements, or when required by law.
      </LegalSection>

      <LegalSection heading="4. Data Security">
        We use industry-standard encryption in transit and at rest, and role-based access controls
        to protect your account and fundraising data.
      </LegalSection>

      <LegalSection heading="5. Your Rights">
        You can access, correct, export, or delete your personal data at any time from your
        Account Settings, or by contacting us at privacy@raiseops.com.
      </LegalSection>

      <LegalSection heading="6. Contact Us">
        Questions about this policy? Reach out at privacy@raiseops.com.
      </LegalSection>

      <Box sx={{ mt: 6, p: 3, bgcolor: '#F6F8FB', borderRadius: '12px' }}>
        <Typography variant="body2" sx={{ color: '#5A6A85' }}>
          This is placeholder legal content for demo purposes. Replace with your finalized,
          attorney-reviewed privacy policy before launch.
        </Typography>
      </Box>
    </MarketingPageShell>
  )
}
