'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Snackbar,
  Stack,
  CircularProgress,
} from '@mui/material'
import { IconUpload, IconCheck, IconTrash } from '@tabler/icons-react'

const INDUSTRIES = ['FinTech', 'EdTech', 'HealthTech', 'SaaS', 'B2B', 'Consumer', 'DeepTech', 'ClimaTech', 'AgriTech', 'LegalTech']

const FUNDING_STAGES = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'series-c', label: 'Series C' },
  { value: 'growth', label: 'Growth' },
]

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
      {value === index && children}
    </Box>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  // Profile state — all empty by default, populated from real user data
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    facebook: '',
    tiktok: '',
  })

  // Company state — all empty by default
  const [company, setCompany] = useState({
    name: '',
    industry: '',
    fundingStage: '',
    headquarters: '',
    teamSize: '',
  })

  // Load from Supabase auth
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const meta = user.user_metadata ?? {}
      setAvatarUrl(meta.avatar_url ?? null)
      setProfile({
        fullName: meta.full_name ?? meta.name ?? '',
        email: user.email ?? '',
        bio: meta.bio ?? '',
        website: meta.website ?? '',
        linkedin: meta.linkedin_url ?? '',
        twitter: meta.twitter_handle ?? '',
        instagram: meta.instagram ?? '',
        facebook: meta.facebook ?? '',
        tiktok: meta.tiktok ?? '',
      })
      setCompany({
        name: meta.company_name ?? '',
        industry: meta.industry ?? '',
        fundingStage: meta.funding_stage ?? '',
        headquarters: meta.headquarters ?? '',
        teamSize: meta.team_size ?? '',
      })
    }
    loadUser()
  }, [])

  // Notifications state
  const [notifications, setNotifications] = useState({
    newInvestorMatch: true,
    meetingReminder: true,
    postScheduled: false,
    weeklyDigest: true,
    fundingAlert: true,
    teamUpdates: false,
  })

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    if (file.size > 2 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'Photo must be under 2MB.', severity: 'error' })
      return
    }

    setUploadingPhoto(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
      await supabase.auth.refreshSession()
      setAvatarUrl(publicUrl)
      setSnackbar({ open: true, message: 'Photo updated!', severity: 'success' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemovePhoto = async () => {
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { avatar_url: null } })
    setAvatarUrl(null)
    setSnackbar({ open: true, message: 'Photo removed.', severity: 'success' })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error, data } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          bio: profile.bio,
          website: profile.website,
          linkedin_url: profile.linkedin,
          twitter_handle: profile.twitter,
          instagram: profile.instagram,
          facebook: profile.facebook,
          tiktok: profile.tiktok,
          company_name: company.name,
          industry: company.industry,
          funding_stage: company.fundingStage,
          headquarters: company.headquarters,
          team_size: company.teamSize,
        },
      })
      if (error) throw error
      // Refresh session so updated metadata is reflected everywhere immediately
      await supabase.auth.refreshSession()
      // Update local state from the returned user to confirm what was saved
      if (data.user) {
        const meta = data.user.user_metadata ?? {}
        setProfile((prev) => ({ ...prev, fullName: meta.full_name ?? prev.fullName }))
      }
      setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings.'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!security.newPassword) {
      setSnackbar({ open: true, message: 'Please enter a new password.', severity: 'error' })
      return
    }
    if (security.newPassword !== security.confirmPassword) {
      setSnackbar({ open: true, message: 'New passwords do not match.', severity: 'error' })
      return
    }
    if (security.newPassword.length < 8) {
      setSnackbar({ open: true, message: 'Password must be at least 8 characters.', severity: 'error' })
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: security.newPassword })
      if (error) throw error
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password.'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const initials = profile.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2A3547', mb: 0.5 }}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ color: '#5A6A85' }}>
          Manage your account preferences and startup profile
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{ border: '1px solid #e5eaef', borderRadius: '12px', overflow: 'hidden' }}
      >
        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #e5eaef', px: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', minWidth: 100 },
              '& .Mui-selected': { fontWeight: 600, color: '#5D87FF' },
              '& .MuiTabs-indicator': { bgcolor: '#5D87FF' },
            }}
          >
            <Tab label="Profile" />
            <Tab label="Company" />
            <Tab label="Social Media" />
            <Tab label="Notifications" />
            <Tab label="Security" />
            <Tab label="Billing" />
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#fff' }}>
          {/* PROFILE TAB */}
          <TabPanel value={tab} index={0}>
            <Grid container spacing={3}>
              {/* Avatar */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={avatarUrl ?? undefined}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: '#5D87FF',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      border: '3px solid #ECF2FF',
                    }}
                  >
                    {!avatarUrl && initials}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547', mb: 1 }}>
                      Profile Photo
                    </Typography>
                    {/* Hidden file input */}
                    <Box
                      component="input"
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      aria-label="Upload profile photo"
                      title="Upload profile photo"
                      onChange={handlePhotoUpload}
                      sx={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={uploadingPhoto ? <CircularProgress size={14} /> : <IconUpload size={16} />}
                      disabled={uploadingPhoto}
                      onClick={() => fileInputRef.current?.click()}
                      sx={{ borderColor: '#e5eaef', color: '#5A6A85', mr: 1, '&:hover': { borderColor: '#5D87FF', color: '#5D87FF' } }}
                    >
                      {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                    {avatarUrl && (
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<IconTrash size={14} />}
                        onClick={handleRemovePhoto}
                        sx={{ color: '#FA896B' }}
                      >
                        Remove
                      </Button>
                    )}
                    <Typography variant="caption" sx={{ color: '#7C8FAC', display: 'block', mt: 0.5 }}>
                      JPG, PNG, GIF or WebP. Max 2MB.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email Address"
                  fullWidth
                  value={profile.email}
                  disabled
                  helperText="Contact support to change your email."
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Bio"
                  fullWidth
                  multiline
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  helperText={`${profile.bio.length}/280 characters`}
                  inputProps={{ maxLength: 280 }}
                  placeholder="Tell investors a bit about yourself..."
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Website"
                  fullWidth
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourcompany.com"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="LinkedIn URL"
                  fullWidth
                  value={profile.linkedin}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourname"
                />
              </Grid>

              <Grid size={12}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)', px: 4 }}
                  startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <IconCheck size={16} />}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* COMPANY TAB */}
          <TabPanel value={tab} index={1}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Company Name"
                  fullWidth
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  placeholder="Acme Corp"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Industry"
                  select
                  fullWidth
                  value={company.industry}
                  onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                  SelectProps={{ displayEmpty: true }}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value=""><em>Select industry...</em></MenuItem>
                  {INDUSTRIES.map((ind) => (
                    <MenuItem key={ind} value={ind}>{ind}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Current Funding Stage"
                  select
                  fullWidth
                  value={company.fundingStage}
                  onChange={(e) => setCompany({ ...company, fundingStage: e.target.value })}
                  SelectProps={{ displayEmpty: true }}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value=""><em>Select stage...</em></MenuItem>
                  {FUNDING_STAGES.map((stage) => (
                    <MenuItem key={stage.value} value={stage.value}>{stage.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Headquarters"
                  fullWidth
                  value={company.headquarters}
                  onChange={(e) => setCompany({ ...company, headquarters: e.target.value })}
                  placeholder="City, State"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Team Size"
                  select
                  fullWidth
                  value={company.teamSize}
                  onChange={(e) => setCompany({ ...company, teamSize: e.target.value })}
                  SelectProps={{ displayEmpty: true }}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value=""><em>Select team size...</em></MenuItem>
                  {['1-5', '6-10', '11-25', '26-50', '51-100', '100+'].map((size) => (
                    <MenuItem key={size} value={size}>{size} employees</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={12}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)', px: 4 }}
                  startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <IconCheck size={16} />}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* SOCIAL MEDIA TAB */}
          <TabPanel value={tab} index={2}>
            <Box sx={{ maxWidth: 600 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', mb: 0.5 }}>
                Social Media Links
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A6A85', mb: 3 }}>
                Connect your social profiles to manage content and track engagement.
              </Typography>
              <Stack spacing={2.5}>
                <TextField
                  label="LinkedIn URL"
                  fullWidth
                  value={profile.linkedin}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourname"
                />
                <TextField
                  label="Twitter / X Handle"
                  fullWidth
                  value={profile.twitter}
                  onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  placeholder="@yourhandle"
                />
                <TextField
                  label="Instagram Handle"
                  fullWidth
                  value={profile.instagram}
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                  placeholder="@yourhandle"
                />
                <TextField
                  label="Facebook Page URL"
                  fullWidth
                  value={profile.facebook}
                  onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                  placeholder="https://facebook.com/yourpage"
                />
                <TextField
                  label="TikTok Handle"
                  fullWidth
                  value={profile.tiktok}
                  onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })}
                  placeholder="@yourhandle"
                />
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)', px: 4 }}
                    startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <IconCheck size={16} />}
                  >
                    Save Social Links
                  </Button>
                </Box>
              </Stack>
            </Box>
          </TabPanel>

          {/* NOTIFICATIONS TAB */}
          <TabPanel value={tab} index={3}>
            <Box sx={{ maxWidth: 600 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', mb: 0.5 }}>
                Email Notifications
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A6A85', mb: 3 }}>
                Choose which updates you want to receive via email.
              </Typography>

              <Stack spacing={0}>
                {[
                  { key: 'newInvestorMatch', label: 'New Investor Match', description: 'Get notified when new investors match your profile criteria' },
                  { key: 'meetingReminder', label: 'Meeting Reminders', description: '24-hour reminder before scheduled investor meetings' },
                  { key: 'postScheduled', label: 'Post Scheduled Confirmation', description: 'Confirmation email when your social media post is scheduled' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of your fundraising activity every Monday morning' },
                  { key: 'fundingAlert', label: 'Funding Milestone Alerts', description: 'Updates when you reach key fundraising milestones' },
                  { key: 'teamUpdates', label: 'Team Updates', description: 'Notifications when team members make changes' },
                ].map((item, index, arr) => (
                  <React.Fragment key={item.key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#5A6A85' }}>
                          {item.description}
                        </Typography>
                      </Box>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#5D87FF' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#5D87FF' },
                        }}
                      />
                    </Box>
                    {index < arr.length - 1 && <Divider sx={{ borderColor: '#e5eaef' }} />}
                  </React.Fragment>
                ))}
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)', px: 4 }}
                  startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <IconCheck size={16} />}
                >
                  Save Preferences
                </Button>
              </Box>
            </Box>
          </TabPanel>

          {/* SECURITY TAB */}
          <TabPanel value={tab} index={4}>
            <Box sx={{ maxWidth: 480 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', mb: 0.5 }}>
                Change Password
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A6A85', mb: 3 }}>
                Ensure your account is using a strong, unique password.
              </Typography>

              <Stack spacing={2.5}>
                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  value={security.currentPassword}
                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                />
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={security.newPassword}
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  helperText="Minimum 8 characters"
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                  error={security.confirmPassword.length > 0 && security.newPassword !== security.confirmPassword}
                  helperText={
                    security.confirmPassword.length > 0 && security.newPassword !== security.confirmPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                />
                <Button
                  variant="contained"
                  onClick={handlePasswordChange}
                  disabled={saving}
                  sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)', width: 'fit-content', px: 4 }}
                >
                  {saving ? <CircularProgress size={16} sx={{ color: '#fff', mr: 1 }} /> : null}
                  Update Password
                </Button>
              </Stack>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', mb: 0.5 }}>
                Two-Factor Authentication
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A6A85', mb: 2 }}>
                Add an extra layer of security to your account.
              </Typography>
              <Button
                variant="outlined"
                sx={{ borderColor: '#5D87FF', color: '#5D87FF', '&:hover': { bgcolor: '#ECF2FF' } }}
              >
                Enable 2FA
              </Button>
            </Box>
          </TabPanel>

          {/* BILLING TAB */}
          <TabPanel value={tab} index={5}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', mb: 2 }}>
                Current Plan
              </Typography>
              <Card sx={{ maxWidth: 460, border: '2px solid #5D87FF', boxShadow: '0 4px 20px rgba(93,135,255,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2A3547' }}>
                        Starter Plan
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#5A6A85' }}>
                        Billed monthly
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#5D87FF', lineHeight: 1 }}>
                        $49
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#5A6A85' }}>per month</Typography>
                    </Box>
                  </Box>

                  <Stack spacing={1} sx={{ mb: 2.5 }}>
                    {['50 investor searches/month', 'Basic CRM (25 contacts)', '10 scheduled posts', 'Email support'].map((feature) => (
                      <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#E6FFFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconCheck size={10} color="#13DEB9" />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#5A6A85' }}>{feature}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)', py: 1.25 }}
                  >
                    Upgrade to Growth — $149/mo
                  </Button>
                </CardContent>
              </Card>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', mb: 1 }}>
                Billing History
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A6A85', mb: 2 }}>
                No billing history yet.
              </Typography>
            </Box>
          </TabPanel>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
