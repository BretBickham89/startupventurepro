'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Box,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  IconMenu2,
  IconSearch,
  IconBell,
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
} from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'

const SIDEBAR_WIDTH = 270

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/investors': 'Investor Discovery',
  '/investors/crm': 'Investor CRM',
  '/content': 'Content Calendar',
  '/social': 'Social Media',
  '/settings': 'Settings',
}

interface HeaderProps {
  onMenuClick: () => void
}

const NOTIFICATIONS = [
  { title: 'New investor match found', subtitle: 'Sequoia Capital — 94% fit score', time: '2m ago', color: '#2563EB', href: '/investors' },
  { title: 'Meeting reminder', subtitle: 'Andreessen Horowitz — Tomorrow 2:00 PM', time: '1h ago', color: '#FFAE1F', href: '/investors' },
  { title: 'Post published', subtitle: 'Your LinkedIn post reached 1,240 views', time: '3h ago', color: '#13DEB9', href: '/social' },
]

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null)
  const [userName, setUserName] = useState('Account')
  const [userEmail, setUserEmail] = useState('')
  const [userInitials, setUserInitials] = useState('?')

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const meta = user.user_metadata ?? {}
      const name = meta.full_name ?? meta.name ?? user.email?.split('@')[0] ?? 'Account'
      setUserName(name)
      setUserEmail(user.email ?? '')
      setUserInitials(
        name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
      )
    }
    loadUser()
  }, [])

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] || 'Dashboard'

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    handleMenuClose()
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleProfile = () => {
    handleMenuClose()
    router.push('/settings')
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
        bgcolor: '#fff',
        color: '#0D1B2A',
        borderBottom: '1px solid #e5eaef',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ height: 64, px: { xs: 2, sm: 3 } }}>
        {/* Mobile menu toggle */}
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 1, display: { md: 'none' }, color: '#0D1B2A' }}
        >
          <IconMenu2 size={22} />
        </IconButton>

        {/* Page Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#0D1B2A',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {pageTitle}
        </Typography>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Search Bar */}
        <TextField
          size="small"
          placeholder="Search..."
          sx={{
            width: { xs: 120, sm: 220 },
            mr: 1.5,
            '& .MuiOutlinedInput-root': {
              bgcolor: '#F6F8FB',
              borderRadius: '8px',
              fontSize: '0.875rem',
              '& fieldset': { borderColor: '#e5eaef' },
              '&:hover fieldset': { borderColor: '#2563EB' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={16} color="#5A6A85" />
              </InputAdornment>
            ),
          }}
        />

        {/* Notifications */}
        <IconButton
          onClick={(e) => setNotifAnchorEl(e.currentTarget)}
          sx={{ color: '#5A6A85', mr: 0.5 }}
        >
          <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
            <IconBell size={20} />
          </Badge>
        </IconButton>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={() => setNotifAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 1,
              width: 320,
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #e5eaef',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e5eaef' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
          </Box>
          {NOTIFICATIONS.map((notif, i) => (
            <MenuItem
              key={i}
              onClick={() => { setNotifAnchorEl(null); router.push(notif.href) }}
              sx={{ py: 1.5, px: 2 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: notif.color,
                  mr: 2,
                  flexShrink: 0,
                  mt: 0.5,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0D1B2A' }}>
                  {notif.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#5A6A85', display: 'block' }}>
                  {notif.subtitle}
                </Typography>
                <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                  {notif.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* User Avatar + Dropdown */}
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            ml: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: '8px',
            '&:hover': { bgcolor: '#F6F8FB' },
            transition: 'background 0.2s',
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#2563EB',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {userInitials}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0D1B2A', lineHeight: 1.2 }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#5A6A85', lineHeight: 1 }}>
              Starter Plan
            </Typography>
          </Box>
          <IconChevronDown size={16} color="#5A6A85" />
        </Box>

        {/* User Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #e5eaef',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0D1B2A' }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#5A6A85' }}>
              {userEmail}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfile} sx={{ py: 1.25 }}>
            <ListItemIcon><IconUser size={18} color="#5A6A85" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleProfile} sx={{ py: 1.25 }}>
            <ListItemIcon><IconSettings size={18} color="#5A6A85" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleSignOut}
            sx={{ py: 1.25, color: '#EF4444' }}
          >
            <ListItemIcon><IconLogout size={18} color="#FA896B" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', color: '#EF4444' }}>
              Sign Out
            </ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
