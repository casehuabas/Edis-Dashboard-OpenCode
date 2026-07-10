import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    cream: Palette['primary'];
    clay: Palette['primary'];
    gold: Palette['primary'];
  }
  interface PaletteOptions {
    cream?: PaletteOptions['primary'];
    clay?: PaletteOptions['primary'];
    gold?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    cream: true;
    clay: true;
    gold: true;
  }
}

const hobbitTheme = createTheme({
  palette: {
    primary: {
      main: '#4A7C2E',
      light: '#6B9B37',
      dark: '#2D4A1E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6B4423',
      light: '#8B5E3C',
      dark: '#3E2723',
      contrastText: '#FFF8F0',
    },
    error: {
      main: '#8B3A3A',
      light: '#A0522D',
      dark: '#6B2A2A',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D4A843',
      light: '#E8C56B',
      dark: '#B8922E',
      contrastText: '#3E2723',
    },
    info: {
      main: '#8DB66A',
      light: '#A8CC8A',
      dark: '#6B9B37',
      contrastText: '#1A3310',
    },
    success: {
      main: '#4A7C2E',
      light: '#6B9B37',
      dark: '#2D4A1E',
      contrastText: '#FFFFFF',
    },
    cream: {
      main: '#FFF8F0',
      light: '#FFFAF3',
      dark: '#F5E6CC',
      contrastText: '#3E2723',
    },
    clay: {
      main: '#8B3A3A',
      light: '#C56E4E',
      dark: '#6B2A2A',
      contrastText: '#FFFFFF',
    },
    gold: {
      main: '#D4A843',
      light: '#F2DBA0',
      dark: '#B8922E',
      contrastText: '#2C1810',
    },
    background: {
      default: '#FFF8F0',
      paper: '#FFFAF3',
    },
    text: {
      primary: '#3E2723',
      secondary: '#6B6359',
      disabled: '#9E9488',
    },
    divider: '#E8D5B7',
  },
  typography: {
    fontFamily: '"Merriweather", Georgia, "Times New Roman", serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    h5: {
      fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(ellipse at 20% 0%, rgba(107, 155, 55, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(212, 168, 67, 0.06) 0%, transparent 50%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #E8D5B7',
          boxShadow: '0 4px 20px rgba(62, 39, 35, 0.12)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'linear-gradient(135deg, transparent 0%, rgba(245, 230, 204, 0.3) 50%, transparent 100%)',
            pointerEvents: 'none',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&.MuiButton-colorPrimary': {
            background: 'linear-gradient(135deg, #4A7C2E, #2D4A1E)',
            boxShadow: '0 3px 12px rgba(74, 124, 46, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6B9B37, #4A7C2E)',
              boxShadow: '0 4px 16px rgba(74, 124, 46, 0.4)',
            },
          },
          '&.MuiButton-colorSecondary': {
            background: 'linear-gradient(135deg, #8B5E3C, #6B4423)',
            boxShadow: '0 3px 12px rgba(107, 68, 35, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #A67B5B, #8B5E3C)',
              boxShadow: '0 4px 16px rgba(107, 68, 35, 0.4)',
            },
          },
        },
        outlined: {
          borderColor: '#E8D5B7',
          color: '#6B4423',
          '&:hover': {
            borderColor: '#8B5E3C',
            background: 'rgba(139, 94, 60, 0.06)',
          },
        },
        text: {
          color: '#6B4423',
          '&:hover': {
            background: 'rgba(107, 68, 35, 0.06)',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            background: 'linear-gradient(to bottom, #FFF8F0, #F5E6CC)',
          },
          '& .MuiTableCell-head': {
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 600,
            color: '#3E2723',
            borderBottom: '2px solid #E8D5B7',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(245, 230, 204, 0.4) !important',
          },
          '&:last-child td': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E8D5B7',
          color: '#4A3728',
          padding: '12px 16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontFamily: '"Merriweather", Georgia, serif',
            backgroundColor: '#FFFAF3',
            '& fieldset': {
              borderColor: '#E8D5B7',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#8B5E3C',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6B9B37',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"Playfair Display", Georgia, serif',
            color: '#6B6359',
            '&.Mui-focused': {
              color: '#4A7C2E',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(139, 58, 58, 0.08)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  },
});

export default hobbitTheme;
