import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
} from '@mui/material';
import { Forest as ForestIcon } from '@mui/icons-material';
import TaskList from './components/TaskList';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #2D4A1E 0%, #4A7C2E 100%)',
          borderBottom: '3px solid #6B9B37',
          boxShadow: '0 4px 20px rgba(45, 74, 30, 0.3)',
        }}
      >
        <Toolbar>
          <ForestIcon sx={{ mr: 1.5, fontSize: 28, color: '#E8C56B' }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#FFF8F0',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              letterSpacing: '0.02em',
            }}
          >
            The Shire Task Board
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 248, 240, 0.7)',
              fontStyle: 'italic',
              fontFamily: '"Merriweather", Georgia, serif',
            }}
          >
            A cozy place for getting things done
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <TaskList />
      </Container>

      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 3,
          borderTop: '1px solid #E8D5B7',
          background: 'linear-gradient(to top, #F5E6CC, transparent)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#6B6359',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
          }}
        >
          ❦ In a hole in the ground there lived a task list ❦
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
