'use client'

import React, { useState } from 'react'
import { Box } from '@mui/material'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const SIDEBAR_WIDTH = 270
const HEADER_HEIGHT = 64

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F6F8FB' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${SIDEBAR_WIDTH}px` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
        }}
      >
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            mt: `${HEADER_HEIGHT}px`,
            p: { xs: 2, sm: 3 },
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
