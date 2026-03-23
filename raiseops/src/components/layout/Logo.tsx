'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Box } from '@mui/material'

interface LogoProps {
  href?: string
  /** Set to true when rendering on a light background (e.g. auth pages) */
  onLight?: boolean
}

export default function Logo({ href = '/dashboard', onLight = false }: LogoProps) {
  const img = (
    // PNG is 1536×1024 (3:2). Display at 204×136 so the aspect ratio is
    // preserved and the dark logo background blends into the dark sidebar.
    <Image
      src="/raiseopslogo.png"
      alt="RaiseOps"
      width={204}
      height={136}
      priority
      style={{ display: 'block', width: '100%', height: 'auto' }}
    />
  )

  return (
    <Box
      component={Link}
      href={href}
      sx={{
        display: 'block',
        textDecoration: 'none',
        '&:hover': { opacity: 0.85 },
        transition: 'opacity 0.2s',
        // On light backgrounds wrap the logo in a dark pill so the dark-bg PNG
        // doesn't appear as a floating rectangle.
        ...(onLight && {
          bgcolor: '#0D1B2A',
          borderRadius: '12px',
          px: 2,
          py: 1,
          display: 'inline-flex',
        }),
      }}
    >
      {img}
    </Box>
  )
}
