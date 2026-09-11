'use client'

import React, { useState } from 'react'
import { Box, Grid, Typography, TextField, Button, Stack, Alert } from '@mui/material'
import { IconMail, IconBrandLinkedin, IconMapPin } from '@tabler/icons-react'
import MarketingPageShell from '@/components/marketing/MarketingPageShell'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSubmitted(true)
  }

  return (
    <MarketingPageShell
      eyebrow="Company"
      title="Get in touch"
      subtitle="Questions about RaiseOps, partnerships, or anything else — we'd love to hear from you."
      maxWidth="lg"
    >
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <IconMail size={20} color="#5D87FF" />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2A3547' }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                  hello@raiseops.com
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <IconBrandLinkedin size={20} color="#5D87FF" />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2A3547' }}>
                  LinkedIn
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                  linkedin.com/company/raiseops
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <IconMapPin size={20} color="#5D87FF" />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2A3547' }}>
                  Based in
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                  Remote-first, HQ in the United States
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {submitted ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Thanks, {form.name.split(' ')[0]}! Your message has been received — we&apos;ll get back to you soon.
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Your Name"
                  fullWidth
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <TextField
                  label="Message"
                  fullWidth
                  multiline
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
                    width: 'fit-content',
                    px: 4,
                  }}
                >
                  Send Message
                </Button>
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>
    </MarketingPageShell>
  )
}
