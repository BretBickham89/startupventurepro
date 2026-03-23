// Import Plus Jakarta Sans from Google Fonts in your layout:
// import { Plus_Jakarta_Sans } from 'next/font/google'
import { createTheme } from '@mui/material/styles'
import { palette } from './palette'

const theme = createTheme({
  palette: {
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    text: palette.text,
    background: palette.background,
    divider: palette.divider,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57,
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57,
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 6px rgba(0,0,0,0.06)',
    '0px 4px 12px rgba(0,0,0,0.08)',
    '0px 6px 16px rgba(0,0,0,0.10)',
    '0px 8px 20px rgba(0,0,0,0.12)',
    '0px 10px 24px rgba(0,0,0,0.14)',
    '0px 12px 28px rgba(0,0,0,0.16)',
    '0px 14px 32px rgba(0,0,0,0.18)',
    '0px 16px 36px rgba(0,0,0,0.20)',
    '0px 18px 40px rgba(0,0,0,0.22)',
    '0px 20px 44px rgba(0,0,0,0.24)',
    '0px 22px 48px rgba(0,0,0,0.26)',
    '0px 24px 52px rgba(0,0,0,0.28)',
    '0px 26px 56px rgba(0,0,0,0.30)',
    '0px 28px 60px rgba(0,0,0,0.32)',
    '0px 30px 64px rgba(0,0,0,0.34)',
    '0px 32px 68px rgba(0,0,0,0.36)',
    '0px 34px 72px rgba(0,0,0,0.38)',
    '0px 36px 76px rgba(0,0,0,0.40)',
    '0px 38px 80px rgba(0,0,0,0.42)',
    '0px 40px 84px rgba(0,0,0,0.44)',
    '0px 42px 88px rgba(0,0,0,0.46)',
    '0px 44px 92px rgba(0,0,0,0.48)',
    '0px 46px 96px rgba(0,0,0,0.50)',
    '0px 48px 100px rgba(0,0,0,0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.3)',
          },
        },
        sizeLarge: {
          padding: '10px 24px',
          fontSize: '1rem',
        },
        sizeMedium: {
          padding: '8px 20px',
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.75rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 4px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E2E8F0',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E2E8F0',
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
          color: '#5A6A85',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 600,
        },
      },
    },
  },
})

export default theme
