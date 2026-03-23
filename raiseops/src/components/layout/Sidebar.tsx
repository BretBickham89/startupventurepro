'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  Button,
} from '@mui/material'
import {
  IconLayoutDashboard,
  IconBuildingBank,
  IconAddressBook,
  IconCalendar,
  IconBrandLinkedin,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconRocket,
  IconChartBar,
} from '@tabler/icons-react'
import Logo from './Logo'
import { createClient } from '@/lib/supabase/client'

const SIDEBAR_WIDTH = 270

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={20} />,
  },
  {
    label: 'Investor Discovery',
    href: '/investors',
    icon: <IconBuildingBank size={20} />,
  },
  {
    label: 'Investor CRM',
    href: '/investors/crm',
    icon: <IconAddressBook size={20} />,
  },
  {
    label: 'Content Calendar',
    href: '/content',
    icon: <IconCalendar size={20} />,
  },
  {
    label: 'AI Brief Builder',
    href: '/raise',
    icon: <IconRocket size={20} />,
    badge: 'AI',
  },
]

const TOOL_ITEMS: NavItem[] = [
  {
    label: 'Social Media',
    href: '/social',
    icon: <IconBrandLinkedin size={20} />,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <IconChartBar size={20} />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <IconSettings size={20} />,
  },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = React.useState('')
  const [userInitials, setUserInitials] = React.useState('?')
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const meta = user.user_metadata ?? {}
      const name = meta.full_name ?? meta.name ?? user.email?.split('@')[0] ?? ''
      setUserName(name)
      setUserInitials(
        name ? name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '?'
      )
      if (meta.avatar_url) setAvatarUrl(meta.avatar_url)
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100vh',
        bgcolor: '#0D1B2A',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Logo />
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2, px: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.35)',
            px: 1,
            display: 'block',
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            fontSize: '0.65rem',
          }}
        >
          Main Menu
        </Typography>

        <List disablePadding>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive(item.href)}
                sx={{
                  borderRadius: '10px',
                  py: 1.25,
                  px: 1.5,
                  color: isActive(item.href) ? '#fff' : 'rgba(255,255,255,0.6)',
                  bgcolor: isActive(item.href) ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive(item.href)
                      ? 'rgba(37, 99, 235, 0.25)'
                      : 'rgba(255,255,255,0.07)',
                    color: '#fff',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(37, 99, 235, 0.2)',
                    '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.25)' },
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive(item.href) ? '#2563EB' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.href) ? 600 : 400,
                  }}
                />
                {item.badge && (
                  <Box
                    sx={{
                      px: 0.75,
                      py: 0.1,
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                      fontSize: '0.55rem',
                      fontWeight: 800,
                      color: '#fff',
                      letterSpacing: '0.03em',
                      lineHeight: '1.6',
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
                {!item.badge && isActive(item.href) && (
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: '#2563EB',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.35)',
            px: 1,
            display: 'block',
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            fontSize: '0.65rem',
          }}
        >
          Tools
        </Typography>

        <List disablePadding>
          {TOOL_ITEMS.map((item) => (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive(item.href)}
                sx={{
                  borderRadius: '10px',
                  py: 1.25,
                  px: 1.5,
                  color: isActive(item.href) ? '#fff' : 'rgba(255,255,255,0.6)',
                  bgcolor: isActive(item.href) ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive(item.href)
                      ? 'rgba(37, 99, 235, 0.25)'
                      : 'rgba(255,255,255,0.07)',
                    color: '#fff',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(37, 99, 235, 0.2)',
                    '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.25)' },
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive(item.href) ? '#2563EB' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.href) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Upgrade card */}
        <Box
          sx={{
            mt: 3,
            mx: 1,
            p: 2,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(93,135,255,0.2) 0%, rgba(16,185,129,0.15) 100%)',
            border: '1px solid rgba(93,135,255,0.2)',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#fff', fontWeight: 600, display: 'block', mb: 0.5 }}
          >
            Upgrade to Growth
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1.5 }}>
            Get unlimited investor searches and AI scoring
          </Typography>
          <Button
            component={Link}
            href="/#pricing"
            fullWidth
            variant="contained"
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
              fontSize: '0.75rem',
              py: 0.75,
            }}
          >
            Upgrade Now
          </Button>
        </Box>
      </Box>

      {/* User profile section */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          src={avatarUrl ?? undefined}
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#2563EB',
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          {!avatarUrl && userInitials}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {userName || 'Account'}
          </Typography>
        </Box>
        <Tooltip title="Sign Out">
          <Box
            onClick={handleSignOut}
            sx={{
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)',
              display: 'flex',
              '&:hover': { color: '#EF4444' },
              transition: 'color 0.2s',
            }}
          >
            <IconLogout size={18} />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: SIDEBAR_WIDTH,
            zIndex: 1200,
          }}
        >
          <SidebarContent />
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            bgcolor: 'transparent',
            border: 'none',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  )
}
