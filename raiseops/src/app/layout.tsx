import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import ThemeRegistry from '@/components/providers/ThemeRegistry'
import './global.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'RaiseOps — Raise Capital. Build Momentum. Scale Your Startup.',
    template: '%s | RaiseOps',
  },
  description:
    'The all-in-one platform connecting founders with investors, managing your fundraising pipeline, and amplifying your brand story.',
  keywords: [
    'startup funding',
    'investor discovery',
    'fundraising CRM',
    'founder platform',
    'venture capital',
    'seed funding',
  ],
  authors: [{ name: 'Scalyn' }],
  creator: 'Scalyn',
  publisher: 'Scalyn',
  openGraph: {
    title: 'RaiseOps — Raise Capital. Build Momentum.',
    description: 'Connect with 10,000+ verified investors and manage your fundraising pipeline.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RaiseOps',
    description: 'The all-in-one platform for founders raising capital.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
