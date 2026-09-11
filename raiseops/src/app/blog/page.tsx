import { Box, Grid, Typography, Chip } from '@mui/material'
import MarketingPageShell from '@/components/marketing/MarketingPageShell'

interface Post {
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
}

const POSTS: Post[] = [
  {
    title: 'How to write an investor update that actually gets read',
    excerpt: 'The 5-part structure top-tier founders use to keep investors engaged between rounds.',
    category: 'Fundraising',
    date: 'Mar 18, 2026',
    readTime: '6 min read',
  },
  {
    title: 'We analyzed 2,000 cold intro emails to investors. Here\'s what works.',
    excerpt: 'Subject lines, send times, and the one sentence that doubled reply rates.',
    category: 'Outreach',
    date: 'Mar 10, 2026',
    readTime: '8 min read',
  },
  {
    title: 'Pre-seed vs. seed: what actually changes in your pitch',
    excerpt: 'A stage-by-stage breakdown of what investors expect to see in your deck.',
    category: 'Strategy',
    date: 'Feb 27, 2026',
    readTime: '5 min read',
  },
  {
    title: 'Building in public without burning out',
    excerpt: 'A content calendar template founders use to stay visible without losing focus.',
    category: 'Content',
    date: 'Feb 14, 2026',
    readTime: '4 min read',
  },
]

export default function BlogPage() {
  return (
    <MarketingPageShell
      eyebrow="Company"
      title="The RaiseOps Blog"
      subtitle="Tactical advice on fundraising, investor outreach, and building your founder brand."
      maxWidth="lg"
    >
      <Grid container spacing={3}>
        {POSTS.map((post) => (
          <Grid size={{ xs: 12, sm: 6 }} key={post.title}>
            <Box
              sx={{
                p: 3,
                border: '1px solid #e5eaef',
                borderRadius: '12px',
                height: '100%',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
              }}
            >
              <Chip
                label={post.category}
                size="small"
                sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', fontWeight: 600, mb: 1.5 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2A3547', mb: 1, lineHeight: 1.3 }}>
                {post.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A6A85', mb: 2, lineHeight: 1.6 }}>
                {post.excerpt}
              </Typography>
              <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                {post.date} · {post.readTime}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </MarketingPageShell>
  )
}
