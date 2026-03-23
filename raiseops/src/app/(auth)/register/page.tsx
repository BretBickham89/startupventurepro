'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Grid,
} from '@mui/material'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'

const FUNDING_STAGES = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'series-c', label: 'Series C' },
  { value: 'growth', label: 'Growth' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    fundingStage: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
            funding_stage: formData.fundingStage,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card sx={{ borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: '#E6FFFA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Typography sx={{ color: '#13DEB9', fontSize: '2rem' }}>✓</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Account Created!
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Welcome to RaiseOps. Redirecting you to your dashboard...
          </Typography>
          <CircularProgress size={24} sx={{ mt: 2, color: '#5D87FF' }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}
          >
            RO
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2A3547' }}>
            RaiseOps
          </Typography>
        </Box>

        {/* Heading */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
            Create your account
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Start your free 14-day trial. No credit card required.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={formData.fullName}
                onChange={handleChange('fullName')}
                required
                placeholder="Jane Smith"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange('email')}
                required
                autoComplete="email"
                placeholder="jane@company.com"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formData.password}
                onChange={handleChange('password')}
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Company Name"
                fullWidth
                value={formData.companyName}
                onChange={handleChange('companyName')}
                placeholder="Acme Corp"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Current Funding Stage"
                select
                fullWidth
                value={formData.fundingStage}
                onChange={handleChange('fundingStage')}
              >
                <MenuItem value="">
                  <em>Select stage...</em>
                </MenuItem>
                {FUNDING_STAGES.map((stage) => (
                  <MenuItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                size="small"
                sx={{ color: '#5D87FF', '&.Mui-checked': { color: '#5D87FF' } }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                I agree to the{' '}
                <Typography component="a" href="#" variant="body2" sx={{ color: '#5D87FF', textDecoration: 'none' }}>
                  Terms of Service
                </Typography>{' '}
                and{' '}
                <Typography component="a" href="#" variant="body2" sx={{ color: '#5D87FF', textDecoration: 'none' }}>
                  Privacy Policy
                </Typography>
              </Typography>
            }
            sx={{ mt: 2, mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
              mb: 2,
              py: 1.5,
              boxShadow: '0 4px 16px rgba(93, 135, 255, 0.35)',
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create Account'}
          </Button>
        </Box>

        {/* Sign in link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Already have an account?{' '}
            <Typography
              component={Link}
              href="/login"
              variant="body2"
              sx={{ color: '#5D87FF', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Sign In
            </Typography>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
