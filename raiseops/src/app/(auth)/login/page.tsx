'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/layout/Logo'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { IconEye, IconEyeOff, IconBrandGoogle } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('error') === 'oauth_failed') {
      setError('Google sign-in failed. Please try again or use email/password.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
      setLoading(false)
    }
    // On success the browser navigates away — no need to setLoading(false)
  }

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Logo href="/login" onLight />
        </Box>

        {/* Heading */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Sign in to your account to continue
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
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            sx={{ mb: 2 }}
            placeholder="you@company.com"
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            sx={{ mb: 1 }}
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                  sx={{ color: '#5D87FF', '&.Mui-checked': { color: '#5D87FF' } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: '#5A6A85' }}>Remember me</Typography>}
            />
            <Typography
              variant="body2"
              component="a"
              href="#"
              sx={{ color: '#5D87FF', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Forgot password?
            </Typography>
          </Box>

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
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
          </Button>
        </Box>

        {/* Divider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="caption" sx={{ color: '#5A6A85', whiteSpace: 'nowrap' }}>
            or continue with
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        {/* Google OAuth */}
        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<IconBrandGoogle size={20} />}
          onClick={handleGoogleSignIn}
          sx={{
            borderColor: '#e5eaef',
            color: '#2A3547',
            mb: 3,
            '&:hover': { bgcolor: '#F6F8FB', borderColor: '#5D87FF' },
          }}
        >
          Sign in with Google
        </Button>

        {/* Sign up link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#5A6A85' }}>
            Don&apos;t have an account?{' '}
            <Typography
              component={Link}
              href="/register"
              variant="body2"
              sx={{ color: '#5D87FF', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Sign Up
            </Typography>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
