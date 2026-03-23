'use client'

import React, { useState } from 'react'
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
import { IconUpload, IconCheck } from '@tabler/icons-react'

const INDUSTRIES = ['FinTech', 'EdTech', 'HealthTech', 'SaaS', 'B2B', 'Consumer', 'DeepTech', 'ClimaTech', 'AgriTech', 'LegalTech']

const FUNDING_STAGES = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'series-c', label: 'Series C' },
  { value: 'growth', label: 'Growth' },
]

const BILLING_HISTORY = [
  { date: 'Mar 1, 2026', description: 'Starter Plan — Monthly', amount: '$49.00', status: 'Paid' },
  { date: 'Feb 1, 2026', description: 'Starter Plan — Monthly', amount: '$49.00', status: 'Paid' },
  { date: 'Jan 1, 2026', description: 'Starter Plan — Monthly', amount: '$49.00', status: 'Paid' },
  { date: 'Dec 1, 2025', description: 'Starter Plan — Monthly', amount: '$49.00', status: 'Paid' },
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
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  // Profile state
  const [profile, setProfile] = useState({
    fullName: 'Jane Doe',
    email: 'jane@acmecorp.com',
    bio: 'Founder & CEO at Acme Corp. Building the future of enterprise software. Ex-Google. MIT CS \'18.',
    website: 'https://acmecorp.com',
    linkedin: 'https://linkedin.com/in/janedoe',
    twitter: '@janedoe',
  })

  // Company state
  const [company, setCompany] = useState({
    name: 'Acme Corp',
    industry: 'SaaS',
    fundingStage: 'seed',
    headquarters: 'San Francisco, CA',
    teamSize: '8',
  })

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

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' })
  }

  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      setSnackbar({ open: true, message: 'New passwords do not match.', severity: 'error' })
      return
    }
    if (security.newPassword.length < 8) {
      setSnackbar({ open: true, message: 'Password must be at least 8 characters.', severity: 'error' })
      return
    }
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' })
  }

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
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: '#5D87FF',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      border: '3px solid #ECF2FF',
                    }}
                  >
                    JD
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547', mb: 1 }}>
                      Profile Photo
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<IconUpload size={16} />}
                      sx={{ borderColor: '#e5eaef', color: '#5A6A85', mr: 1, '&:hover': { borderColor: '#5D87FF', color: '#5D87FF' } }}
                    >
                      Upload Photo
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: '#FA896B' }}
                    >
                      Remove
                    </Button>
                    <Typography variant="caption" sx={{ color: '#7C8FAC', display: 'block', mt: 0.5 }}>
                      JPG, PNG or GIF. Max size 2MB.
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
                  helperText="Email cannot be changed here. Contact support."
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

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Twitter Handle"
                  fullWidth
                  value={profile.twitter}
                  onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  placeholder="@yourhandle"
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
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Industry"
                  select
                  fullWidth
                  value={company.industry}
                  onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                >
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
                >
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
                >
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

          {/* NOTIFICATIONS TAB */}
          <TabPanel value={tab} index={2}>
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
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 2,
                      }}
                    >
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
                        onChange={(e) =>
                          setNotifications({ ...notifications, [item.key]: e.target.checked })
                        }
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
          <TabPanel value={tab} index={3}>
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
                  error={
                    security.confirmPassword.length > 0 &&
                    security.newPassword !== security.confirmPassword
                  }
                  helperText={
                    security.confirmPassword.length > 0 &&
                    security.newPassword !== security.confirmPassword
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
          <TabPanel value={tab} index={4}>
            {/* Current Plan */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', mb: 2 }}>
                Current Plan
              </Typography>
              <Card
                sx={{
                  maxWidth: 460,
                  border: '2px solid #5D87FF',
                  boxShadow: '0 4px 20px rgba(93,135,255,0.15)',
                }}
              >
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
                    {[
                      '50 investor searches/month',
                      'Basic CRM (25 contacts)',
                      '10 scheduled posts',
                      'Email support',
                    ].map((feature) => (
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

            {/* Billing History */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A3547', mb: 2 }}>
                Billing History
              </Typography>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: '1px solid #e5eaef', borderRadius: '10px', overflow: 'hidden' }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { bgcolor: '#F6F8FB' } }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {BILLING_HISTORY.map((row, i) => (
                      <TableRow key={i} sx={{ '&:hover': { bgcolor: '#F6F8FB' } }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#5A6A85' }}>{row.date}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#2A3547' }}>{row.description}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2A3547' }}>{row.amount}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{ bgcolor: '#E6FFFA', color: '#02b3a9', fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
