import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { Forest as ForestIcon, AccountBalance, Receipt, Task } from '@mui/icons-material';
import LedgerList from './components/LedgerList';
import VoucherList from './components/VoucherList';
import TaskList from './components/TaskList';

interface Ledger {
  id: number;
  name: string;
  type: string;
  balance: number;
  description: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [tab, setTab] = useState(0);
  const [selectedLedger, setSelectedLedger] = useState<Ledger | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setSelectedLedger(null);
  };

  const handleSelectLedger = (ledger: Ledger) => {
    setSelectedLedger(ledger);
    setTab(1);
  };

  const handleBackToLedgers = () => {
    setSelectedLedger(null);
    setTab(0);
  };

  const tabIconStyle = { fontSize: 20, mr: 0.5 };

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
            The Shire Ledger
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
            A cozy home for coin and kin
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          borderBottom: '2px solid #E8D5B7',
          backgroundColor: '#FFF8F0',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="md">
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                color: '#6B6359',
                minHeight: 48,
                px: 3,
                '&.Mui-selected': {
                  color: '#2D4A1E',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#4A7C2E',
                height: 3,
              },
            }}
          >
            <Tab icon={<AccountBalance sx={tabIconStyle} />} label="Ledgers" />
            <Tab icon={<Receipt sx={tabIconStyle} />} label="Vouchers" />
            <Tab icon={<Task sx={tabIconStyle} />} label="Tasks" />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        {tab === 0 && <LedgerList onSelectLedger={handleSelectLedger} />}
        {tab === 1 && (
          <VoucherList
            selectedLedger={selectedLedger}
            onBack={handleBackToLedgers}
          />
        )}
        {tab === 2 && <TaskList />}
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
          ❦ Not all those who wander are lost — but all who spend should keep a ledger ❦
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
